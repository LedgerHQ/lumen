import { useCallback, useRef, useState } from 'react';
import type {
  SnackbarAppearance,
  SnackbarDuration,
  SnackbarItem,
  SnackbarNotifyOptions,
  SnackbarUpdateOptions,
} from './types';

let fallbackIdCounter = 0;

const SHORT_MS = 5000;
const MEDIUM_MS = 8000;

const DEFAULT_DURATIONS: Record<SnackbarAppearance, SnackbarDuration> = {
  info: 'short',
  success: 'short',
  warning: 'infinite',
  error: 'infinite',
};

const presetToMs = (duration: SnackbarDuration): number => {
  if (typeof duration === 'number') return duration;
  switch (duration) {
    case 'short':
      return SHORT_MS;
    case 'medium':
      return MEDIUM_MS;
    case 'infinite':
      return Infinity;
  }
};

/**
 * Resolves lifetime in milliseconds. Precedence: per-item `duration`, then
 * loading (persists), then provider overrides, then appearance defaults.
 */
const resolveDurationMs = (
  item: {
    appearance: SnackbarAppearance;
    loading: boolean;
    duration?: SnackbarDuration;
  },
  durations?: Partial<Record<SnackbarAppearance, SnackbarDuration>>,
): number => {
  if (item.duration !== undefined) return presetToMs(item.duration);
  if (item.loading) return Infinity;
  const override = durations?.[item.appearance];
  if (override !== undefined) return presetToMs(override);
  return presetToMs(DEFAULT_DURATIONS[item.appearance]);
};

const createSnackbarId = (): string => {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }
  fallbackIdCounter += 1;
  return `snackbar-${Date.now()}-${fallbackIdCounter}`;
};

const toItem = (
  id: string,
  options: SnackbarNotifyOptions,
  durations?: Partial<Record<SnackbarAppearance, SnackbarDuration>>,
): SnackbarItem => {
  const appearance = options.appearance ?? 'info';
  const loading = options.loading ?? false;
  return {
    id,
    appearance,
    loading,
    title: options.title,
    durationMs: resolveDurationMs(
      { appearance, loading, duration: options.duration },
      durations,
    ),
    dismissible: options.dismissible ?? true,
    action: options.action,
  };
};

// Drop undefined keys so a patch never wipes an existing field.
const stripUndefined = (
  patch: SnackbarUpdateOptions,
): SnackbarUpdateOptions => {
  const result: SnackbarUpdateOptions = {};
  for (const key of Object.keys(patch) as (keyof SnackbarUpdateOptions)[]) {
    if (patch[key] !== undefined) {
      Object.assign(result, { [key]: patch[key] });
    }
  }
  return result;
};

/**
 * Owns the ordered list of live snackbars. Duration is resolved at add/update.
 * The item wrapper owns the countdown and the exit animation.
 *
 * `dismiss` is two-phase for visible items: the first call flags `exiting` so
 * the wrapper can animate, the second (after the animation) drops the item.
 * Backlog items are not mounted, so they are dropped immediately.
 */
export const useSnackbarQueue = (
  maxItems: number,
  durations?: Partial<Record<SnackbarAppearance, SnackbarDuration>>,
): {
  items: SnackbarItem[];
  add: (options: SnackbarNotifyOptions) => string;
  update: (id: string, patch: SnackbarUpdateOptions) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
} => {
  const [items, setItems] = useState<SnackbarItem[]>([]);
  const maxItemsRef = useRef(maxItems);
  maxItemsRef.current = maxItems;
  const durationsRef = useRef(durations);
  durationsRef.current = durations;

  const add = useCallback((options: SnackbarNotifyOptions): string => {
    const id = createSnackbarId();
    setItems((prev) => [...prev, toItem(id, options, durationsRef.current)]);
    return id;
  }, []);

  const update = useCallback(
    (id: string, rawPatch: SnackbarUpdateOptions): void => {
      setItems((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item;
          const { duration, ...fields } = stripUndefined(rawPatch);
          const timingChanged =
            duration !== undefined ||
            fields.loading !== undefined ||
            fields.appearance !== undefined;
          if (!timingChanged) {
            return { ...item, ...fields };
          }
          return {
            ...item,
            ...fields,
            durationMs: resolveDurationMs(
              {
                appearance: fields.appearance ?? item.appearance,
                loading: fields.loading ?? item.loading,
                duration,
              },
              durationsRef.current,
            ),
          };
        }),
      );
    },
    [],
  );

  const dismiss = useCallback((id: string): void => {
    setItems((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      if (index === -1) return prev;
      const item = prev[index];
      if (item.exiting || index >= maxItemsRef.current) {
        return prev.filter((entry) => entry.id !== id);
      }
      return prev.map((entry) =>
        entry.id === id ? { ...entry, exiting: true } : entry,
      );
    });
  }, []);

  const dismissAll = useCallback((): void => {
    setItems((prev) =>
      prev
        .filter((_, index) => index < maxItemsRef.current)
        .map((item) => ({ ...item, exiting: true })),
    );
  }, []);

  return { items, add, update, dismiss, dismissAll };
};

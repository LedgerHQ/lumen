import { useCallback, useRef, useState } from 'react';
import type {
  ToastAppearance,
  ToastItem,
  ToastNotifyOptions,
  ToastUpdateOptions,
} from './types';

let fallbackIdCounter = 0;

const DEFAULT_DURATIONS: Record<ToastAppearance, number> = {
  info: 5000,
  success: 5000,
  warning: 0,
  error: 0,
};

/**
 * Resolves lifetime in milliseconds. Precedence: per-item `duration`, then
 * loading (persists), then provider overrides, then appearance defaults. A
 * resolved `0` (never dismiss) is normalized to `Infinity`, the internal
 * sentinel `useToastTimer` checks for.
 */
const resolveDurationMs = (
  item: {
    appearance: ToastAppearance;
    loading: boolean;
    duration?: number;
  },
  durations?: Partial<Record<ToastAppearance, number>>,
): number => {
  const ms =
    item.duration === undefined
      ? item.loading
        ? Infinity
        : (durations?.[item.appearance] ?? DEFAULT_DURATIONS[item.appearance])
      : item.duration;
  return ms === 0 ? Infinity : ms;
};

const createToastId = (): string => {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }
  fallbackIdCounter += 1;
  return `toast-${Date.now()}-${fallbackIdCounter}`;
};

const toItem = (
  id: string,
  options: ToastNotifyOptions,
  durations?: Partial<Record<ToastAppearance, number>>,
): ToastItem => {
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

const DEFAULT_MAX_ITEMS = 3;

/**
 * `slice` and index comparisons disagree on fractions/NaN/negatives. Only a
 * positive integer is a slot count; anything else falls back to the default.
 */
const resolveMaxItems = (maxItems: number): number =>
  Number.isInteger(maxItems) && maxItems >= 1 ? maxItems : DEFAULT_MAX_ITEMS;

const stripUndefined = (patch: ToastUpdateOptions): ToastUpdateOptions => {
  const result: ToastUpdateOptions = {};
  for (const key of Object.keys(patch) as (keyof ToastUpdateOptions)[]) {
    if (patch[key] !== undefined || key === 'action') {
      Object.assign(result, { [key]: patch[key] });
    }
  }
  return result;
};

/**
 * Owns the ordered list of live toasts. Duration is resolved at add/update.
 * The item wrapper owns the countdown and the exit animation.
 *
 * `dismiss` is two-phase for visible items: the first call flags `exiting` so
 * the wrapper can animate, the second (after the animation) drops the item.
 * Backlog items are not mounted, so they are dropped immediately.
 */
export const useToastQueue = (
  maxItems: number,
  durations?: Partial<Record<ToastAppearance, number>>,
): {
  items: ToastItem[];
  maxItems: number;
  add: (options: ToastNotifyOptions) => string;
  update: (id: string, patch: ToastUpdateOptions) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
} => {
  const [items, setItems] = useState<ToastItem[]>([]);
  const resolvedMaxItems = resolveMaxItems(maxItems);
  const maxItemsRef = useRef(resolvedMaxItems);
  maxItemsRef.current = resolvedMaxItems;
  const durationsRef = useRef(durations);
  durationsRef.current = durations;

  const add = useCallback((options: ToastNotifyOptions): string => {
    const id = createToastId();
    setItems((prev) => [
      ...prev,
      {
        ...toItem(id, options, durationsRef.current),
        queued: prev.length >= maxItemsRef.current,
      },
    ]);
    return id;
  }, []);

  const update = useCallback(
    (id: string, rawPatch: ToastUpdateOptions): void => {
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

  return {
    items,
    maxItems: resolvedMaxItems,
    add,
    update,
    dismiss,
    dismissAll,
  };
};

import type {
  ToastAppearance,
  ToastItem,
  ToastNotifyOptions,
  ToastStoreConfig,
  ToastUpdateOptions,
} from './types';

let fallbackIdCounter = 0;

const DEFAULT_DURATIONS: Record<ToastAppearance, number> = {
  info: 5000,
  success: 5000,
  warning: 0,
  error: 0,
};

const DEFAULT_MAX_ITEMS = 3;

/**
 * `slice` and index comparisons disagree on fractions/NaN/negatives. Only a
 * positive integer is a slot count; anything else falls back to the default.
 */
export const resolveMaxItems = (maxItems: number): number =>
  Number.isInteger(maxItems) && maxItems >= 1 ? maxItems : DEFAULT_MAX_ITEMS;

const resolveDurationMs = (
  item: {
    appearance: ToastAppearance;
    loading: boolean;
    duration?: number;
  },
  durations?: Partial<Record<ToastAppearance, number>>,
): number => {
  if (item.duration !== undefined) {
    return item.duration === 0 ? Infinity : item.duration;
  }
  if (item.loading) return Infinity;
  const ms = durations?.[item.appearance] ?? DEFAULT_DURATIONS[item.appearance];
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

const stripUndefined = (patch: ToastUpdateOptions): ToastUpdateOptions => {
  const result: ToastUpdateOptions = {};
  for (const key of Object.keys(patch) as (keyof ToastUpdateOptions)[]) {
    if (patch[key] !== undefined || key === 'action') {
      Object.assign(result, { [key]: patch[key] });
    }
  }
  return result;
};

let items: ToastItem[] = [];
const listeners = new Set<() => void>();
let resolvedMaxItems = DEFAULT_MAX_ITEMS;
let durations: Partial<Record<ToastAppearance, number>> | undefined;
let mountedRenderers = 0;

const notify = (): void => {
  for (const listener of listeners) listener();
};

const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = (): ToastItem[] => items;

/**
 * Applies toaster config (slot count, duration overrides). Called by
 * the mounted `<Toaster />` whenever its props change; safe to call before
 * anything has mounted since `add`/`update` fall back to the defaults above.
 */
const configure = ({
  maxItems,
  durations: nextDurations,
}: ToastStoreConfig): void => {
  resolvedMaxItems = resolveMaxItems(maxItems);
  durations = nextDurations;
};

const add = (options: ToastNotifyOptions): string => {
  const id = createToastId();
  items = [
    ...items,
    {
      ...toItem(id, options, durations),
      queued: items.length >= resolvedMaxItems,
    },
  ];
  notify();
  return id;
};

const update = (id: string, rawPatch: ToastUpdateOptions): void => {
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return;

  const current = items[index];
  const { duration, ...fields } = stripUndefined(rawPatch);
  const timingChanged =
    duration !== undefined ||
    fields.loading !== undefined ||
    fields.appearance !== undefined;

  const next = timingChanged
    ? {
        ...current,
        ...fields,
        durationMs: resolveDurationMs(
          {
            appearance: fields.appearance ?? current.appearance,
            loading: fields.loading ?? current.loading,
            duration,
          },
          durations,
        ),
      }
    : { ...current, ...fields };

  items = items.map((item, i) => (i === index ? next : item));
  notify();
};

const dismiss = (id: string): void => {
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return;

  const item = items[index];
  items =
    item.exiting || index >= resolvedMaxItems
      ? items.filter((entry) => entry.id !== id)
      : items.map((entry) =>
          entry.id === id ? { ...entry, exiting: true } : entry,
        );
  notify();
};

const dismissAll = (): void => {
  items = items
    .filter((_, index) => index < resolvedMaxItems)
    .map((item) => ({ ...item, exiting: true }));
  notify();
};

/**
 * Tracks how many `<Toaster />` instances are currently mounted. Every one
 * renders the full `items` list into its own portal, so mounting more than
 * one duplicates every toast on screen — warn loudly rather than silently
 * pick a "winner", since it usually means a real mistake in the consuming
 * app (e.g. a shared layout mounted twice).
 */
const registerRenderer = (): (() => void) => {
  mountedRenderers += 1;
  if (mountedRenderers > 1) {
    // eslint-disable-next-line no-console
    console.warn(
      `[Toaster] ${mountedRenderers} <Toaster /> instances are mounted at once. ` +
        'Every toast will render once per instance. Mount a single <Toaster /> for the whole app.',
    );
  }
  return () => {
    mountedRenderers -= 1;
  };
};

/**
 * Owns the toast queue outside React, so it's reachable from anywhere
 * (thunks, sagas, non-component code) — not just from inside a mounted
 * component tree. `subscribe`/`getSnapshot` are meant to be handed straight to
 * `useSyncExternalStore`; `createToastController` builds the imperative
 * `toast.*` API on top of `add`/`update`/`dismiss`/`dismissAll`.
 *
 * Duration is resolved at add/update. `dismiss` is two-phase for visible
 * items: the first call flags `exiting` so the wrapper can animate, the
 * second drops it. Backlog items are not mounted, so they drop immediately.
 */
export const toastStore = {
  subscribe,
  getSnapshot,
  configure,
  registerRenderer,
  add,
  update,
  dismiss,
  dismissAll,
};

/**
 * Test-only: resets the module-level store between tests. Not part of the
 * public API — do not call from application code.
 */
export const resetToastStore = (): void => {
  items = [];
  listeners.clear();
  resolvedMaxItems = DEFAULT_MAX_ITEMS;
  durations = undefined;
  mountedRenderers = 0;
};

import type { ComponentPropsWithRef, ReactNode } from 'react';

/**
 * Status of a snackbar, driving its leading icon and default timing.
 */
export type SnackbarAppearance = 'info' | 'success' | 'warning' | 'error';

/**
 * How long a snackbar stays visible.
 *
 * A `number` is interpreted as milliseconds.
 * The presets are short: 5000ms, medium: 8000ms and infinite: Infinity.
 */
export type SnackbarDuration = 'short' | 'medium' | 'infinite' | number;

/**
 * Corner or edge the queue is anchored to. Items enter from the same edge.
 */
export type SnackbarPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

/**
 * A single trailing action rendered as a text button inside the snackbar.
 * The action never dismisses the snackbar on its own.
 */
export type SnackbarAction = {
  /**
   * The visible label of the action button.
   */
  label: string;
  /**
   * Fired when the action button is pressed.
   */
  onAction: () => void;
};

/**
 * Props for the presentational `Snackbar` item.
 */
export type SnackbarProps = {
  /**
   * The status of the snackbar, driving the leading icon.
   * @default info
   */
  appearance?: SnackbarAppearance;
  /**
   * Replaces the leading status icon with a spinner.
   * @default false
   */
  loading?: boolean;
  /**
   * The main text. Rendered on a single line and truncated with an ellipsis.
   * @required
   */
  title: string;
  /**
   * Optional trailing action button. Pressing it does not dismiss the snackbar.
   */
  action?: SnackbarAction;
  /**
   * Optional close handler. When provided, a close button is rendered.
   */
  onClose?: () => void;
  /**
   * Accessible label for the close button.
   */
  closeAriaLabel?: string;
} & Omit<ComponentPropsWithRef<'div'>, 'title'>;

/**
 * Options accepted by `snackbar.notify` and the appearance shortcuts.
 */
export type SnackbarNotifyOptions = {
  /**
   * The status of the snackbar.
   * @default info
   */
  appearance?: SnackbarAppearance;
  /**
   * Renders a spinner in place of the status icon. Loading snackbars persist
   * (never auto-dismiss) unless `duration` is set explicitly.
   * @default false
   */
  loading?: boolean;
  /**
   * The main text. Rendered on a single line and truncated.
   * @required
   */
  title: string;
  /**
   * Overrides the resolved duration for this item only.
   */
  duration?: SnackbarDuration;
  /**
   * Whether the user can dismiss the snackbar via the close button.
   * @default true
   */
  dismissible?: boolean;
  /**
   * Optional trailing action button.
   */
  action?: SnackbarAction;
};

/**
 * A partial patch applied to a live snackbar via `snackbar.update`.
 */
export type SnackbarUpdateOptions = Partial<SnackbarNotifyOptions>;

/**
 * Per-state options for `snackbar.promise`. `appearance` and `loading` are
 * derived from the promise lifecycle, so they cannot be set here.
 */
export type SnackbarPromiseState = Omit<
  SnackbarNotifyOptions,
  'appearance' | 'loading'
>;

/**
 * The three lifecycle states mapped by `snackbar.promise`. `success` and
 * `error` may be functions of the resolved value / rejection reason.
 */
export type SnackbarPromiseOptions<Value> = {
  loading: SnackbarPromiseState;
  success: SnackbarPromiseState | ((value: Value) => SnackbarPromiseState);
  error: SnackbarPromiseState | ((error: unknown) => SnackbarPromiseState);
};

/**
 * A live snackbar tracked by the queue.
 */
export type SnackbarItem = {
  id: string;
  appearance: SnackbarAppearance;
  loading: boolean;
  title: string;
  /**
   * Resolved lifetime in milliseconds. `Infinity` means the item persists
   * until dismissed or updated.
   */
  durationMs: number;
  dismissible: boolean;
  action?: SnackbarAction;
  /**
   * Set on the first `dismiss`. A second `dismiss` after the exit animation
   * drops the item from the list.
   */
  exiting?: boolean;
};

/**
 * The imperative controller returned by `useSnackbar`.
 */
export type SnackbarController = {
  /**
   * Enqueues a snackbar and returns its stable id.
   */
  notify: (options: SnackbarNotifyOptions) => { id: string };
  /**
   * Enqueues an `info` snackbar.
   */
  info: (options: Omit<SnackbarNotifyOptions, 'appearance'>) => { id: string };
  /**
   * Enqueues a `success` snackbar.
   */
  success: (options: Omit<SnackbarNotifyOptions, 'appearance'>) => {
    id: string;
  };
  /**
   * Enqueues a `warning` snackbar.
   */
  warning: (options: Omit<SnackbarNotifyOptions, 'appearance'>) => {
    id: string;
  };
  /**
   * Enqueues an `error` snackbar.
   */
  error: (options: Omit<SnackbarNotifyOptions, 'appearance'>) => { id: string };
  /**
   * Enqueues a loading snackbar (spinner, persists until updated or dismissed).
   */
  loading: (options: Omit<SnackbarNotifyOptions, 'appearance' | 'loading'>) => {
    id: string;
  };
  /**
   * Patches a live snackbar. Recomputes `durationMs` when appearance, loading,
   * or duration changes (e.g. a loading snackbar becoming a success).
   */
  update: (id: string, options: SnackbarUpdateOptions) => void;
  /**
   * Dismisses a single snackbar by id.
   */
  dismiss: (id: string) => void;
  /**
   * Dismisses every snackbar, visible or queued.
   */
  dismissAll: () => void;
  /**
   * Binds a promise to a single snackbar, moving it through loading, then
   * success or error. The snackbar keeps the same id across the lifecycle.
   */
  promise: <Value>(
    promise: Promise<Value>,
    options: SnackbarPromiseOptions<Value>,
  ) => { id: string };
};

/**
 * Props for `SnackbarProvider`.
 */
export type SnackbarProviderProps = {
  children: ReactNode;
  /**
   * Maximum number of snackbars visible at once. Extra items wait in a FIFO
   * backlog and appear as visible slots free up.
   * @default 3
   */
  maxItems?: number;
  /**
   * The corner or edge the queue is anchored to.
   * @default bottom-right
   */
  position?: SnackbarPosition;
  /**
   * Per-appearance duration overrides, layered over the Lumen status defaults.
   */
  durations?: Partial<Record<SnackbarAppearance, SnackbarDuration>>;
};

/**
 * Status of a toast, driving its leading icon and default timing.
 */
export type ToastAppearance = 'info' | 'success' | 'warning' | 'error';

/**
 * A single trailing action rendered as a text button inside the toast.
 * The action never dismisses the toast on its own.
 */
export type ToastAction = {
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
 * Options accepted by `toast.notify` and the appearance shortcuts.
 */
export type ToastNotifyOptions = {
  /**
   * The status of the toast.
   * @default info
   */
  appearance?: ToastAppearance;
  /**
   * Renders a spinner in place of the status icon. Loading toasts persist
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
  duration?: number;
  /**
   * Whether the user can dismiss the toast via the close button.
   * @default true
   */
  dismissible?: boolean;
  /**
   * Optional trailing action button.
   */
  action?: ToastAction;
};

/**
 * A partial patch applied to a live toast via `toast.update`.
 */
export type ToastUpdateOptions = Partial<ToastNotifyOptions>;

/**
 * Per-state options for `toast.promise`. `appearance` and `loading` are
 * derived from the promise lifecycle, so they cannot be set here.
 */
export type ToastPromiseState = Omit<
  ToastNotifyOptions,
  'appearance' | 'loading'
>;

/**
 * The three lifecycle states mapped by `toast.promise`. `success` and
 * `error` may be functions of the resolved value / rejection reason.
 */
export type ToastPromiseOptions<Value> = {
  loading: ToastPromiseState;
  success: ToastPromiseState | ((value: Value) => ToastPromiseState);
  error: ToastPromiseState | ((error: unknown) => ToastPromiseState);
};

/**
 * A live toast tracked by the queue.
 */
export type ToastItem = {
  id: string;
  appearance: ToastAppearance;
  loading: boolean;
  title: string;
  /**
   * Resolved lifetime in milliseconds. `Infinity` means the item persists
   * until dismissed or updated.
   */
  durationMs: number;
  dismissible: boolean;
  action?: ToastAction;
  /**
   * Set when the item was added while every visible slot was taken, so it
   * waited in the backlog. The view uses it to animate the promotion from
   * behind the stack rather than from the anchored edge.
   */
  queued?: boolean;
  /**
   * Set on the first `dismiss`. A second `dismiss` after the exit animation
   * drops the item from the list.
   */
  exiting?: boolean;
};

/**
 * The imperative controller returned by `useToast`.
 */
export type ToastController = {
  /**
   * Enqueues a toast and returns its stable id.
   */
  notify: (options: ToastNotifyOptions) => { id: string };
  /**
   * Enqueues an `info` toast.
   */
  info: (options: Omit<ToastNotifyOptions, 'appearance'>) => { id: string };
  /**
   * Enqueues a `success` toast.
   */
  success: (options: Omit<ToastNotifyOptions, 'appearance'>) => {
    id: string;
  };
  /**
   * Enqueues a `warning` toast.
   */
  warning: (options: Omit<ToastNotifyOptions, 'appearance'>) => {
    id: string;
  };
  /**
   * Enqueues an `error` toast.
   */
  error: (options: Omit<ToastNotifyOptions, 'appearance'>) => { id: string };
  /**
   * Enqueues a loading toast (spinner, persists until updated or dismissed).
   */
  loading: (options: Omit<ToastNotifyOptions, 'appearance' | 'loading'>) => {
    id: string;
  };
  /**
   * Patches a live toast. Recomputes `durationMs` when appearance, loading,
   * or duration changes (e.g. a loading toast becoming a success). Pass
   * `action: undefined` to remove a trailing action.
   */
  update: (id: string, options: ToastUpdateOptions) => void;
  /**
   * Dismisses a single toast by id.
   */
  dismiss: (id: string) => void;
  /**
   * Dismisses every toast, visible or queued.
   */
  dismissAll: () => void;
  /**
   * Binds a promise to a single toast, moving it through loading, then
   * success or error. The toast keeps the same id across the lifecycle.
   */
  promise: <Value>(
    promise: Promise<Value>,
    options: ToastPromiseOptions<Value>,
  ) => { id: string };
};

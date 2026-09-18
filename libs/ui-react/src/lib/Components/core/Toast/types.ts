import type {
  ToastAction,
  ToastAppearance,
  ToastDuration,
} from '@ledgerhq/lumen-utils-shared';
import type { ComponentPropsWithRef, ReactNode } from 'react';

// Re-exported for consumers importing from '@ledgerhq/lumen-ui-react': the
// domain model (appearance/duration/item/controller/...) is shared with
// ui-rnative and lives in utils-shared.
export type {
  ToastAction,
  ToastAppearance,
  ToastController,
  ToastDuration,
  ToastItem,
  ToastNotifyOptions,
  ToastPromiseOptions,
  ToastPromiseState,
  ToastUpdateOptions,
} from '@ledgerhq/lumen-utils-shared';

/**
 * Corner or edge the queue is anchored to. Items enter from the same edge.
 */
export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

/**
 * Props for the presentational `Toast` item.
 */
export type ToastProps = {
  /**
   * The status of the toast, driving the leading icon.
   * @default info
   */
  appearance?: ToastAppearance;
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
   * Optional trailing action button. Pressing it does not dismiss the toast.
   */
  action?: ToastAction;
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
 * Props for `ToastProvider`.
 */
export type ToastProviderProps = {
  children: ReactNode;
  /**
   * Maximum number of toasts visible at once. Extra items wait in a FIFO
   * backlog and appear as visible slots free up.
   * @default 3
   */
  maxItems?: number;
  /**
   * The corner or edge the queue is anchored to.
   * @default bottom-right
   */
  position?: ToastPosition;
  /**
   * Per-appearance duration overrides, layered over the Lumen status defaults.
   */
  durations?: Partial<Record<ToastAppearance, ToastDuration>>;
};

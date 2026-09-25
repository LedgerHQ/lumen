import type {
  ToastAction,
  ToastAppearance,
} from '@ledgerhq/lumen-utils-shared';
import type { ComponentPropsWithRef, ReactNode } from 'react';

export type {
  ToastAction,
  ToastAppearance,
  ToastController,
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
   * The main text. Wraps over up to five lines, then truncates.
   * @required
   */
  title: string;
  /**
   * Optional trailing action button. Pressing it does not dismiss the toast.
   * It wraps onto its own row, aligned with the title, when it cannot share
   * the title's row.
   */
  action?: ToastAction;
  /**
   * Optional close handler. When provided, a close button is rendered, pinned
   * to the top right whatever the title and action wrap to.
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
   * Maximum number of toasts visible at once. Must be a positive integer.
   * Extra items wait in a FIFO backlog and appear as visible slots free up.
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
  durations?: Partial<Record<ToastAppearance, number>>;
};

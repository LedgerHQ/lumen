import type {
  ToastAction,
  ToastAppearance,
} from '@ledgerhq/lumen-utils-shared';
import type { ReactNode } from 'react';
import type { StyledViewProps } from '../../../../styles';

// Re-exported for consumers importing from '@ledgerhq/lumen-ui-rnative': the
// domain model (appearance/duration/item/controller/...) is shared with
// ui-react and lives in utils-shared.
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
 * Edge the queue is anchored to. Items enter from the same edge, and are
 * dismissible by swiping left or right.
 */
export type ToastPosition = 'top' | 'bottom';

/**
 * Extra space to clear beyond the safe-area inset, on each edge — e.g. the
 * height of a custom tab bar. `top` and `bottom` apply only to the edge
 * matching `position` — the other is ignored. All default to `0`; a fixed
 * breathing-room gap is always added on top of `top`/`bottom` separately,
 * so this only needs to describe the extra obstruction, not the full gap.
 */
export type ToastInsets = {
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
};

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
   * It wraps onto its own row, right-aligned, when it cannot share the title's
   * row.
   */
  action?: ToastAction;
} & StyledViewProps;

/**
 * Props for `ToastProvider`.
 */
export type ToastProviderProps = {
  children: ReactNode;
  /**
   * Maximum number of toasts visible at once. Extra items wait in a FIFO
   * backlog and appear as visible slots free up.
   * @default 1
   */
  maxItems?: number;
  /**
   * The edge the queue is anchored to.
   * @default bottom
   */
  position?: ToastPosition;
  /**
   * Extra space to clear beyond the safe-area inset, on each edge — e.g.
   * the height of a custom tab bar for `top`/`bottom`, or horizontal
   * margins for the queue's width via `left`/`right`.
   * @default {}
   */
  insets?: ToastInsets;
  /**
   * Per-appearance duration overrides, layered over the Lumen status defaults.
   */
  durations?: Partial<Record<ToastAppearance, number>>;
};

import type { ReactNode } from 'react';

export type ProgressLabelPosition =
  | 'start-top'
  | 'start-bottom'
  | 'end-top'
  | 'end-bottom';

export type ProgressLabelLayoutProps = {
  /**
   * Renders the label content. Without it, the children render alone.
   */
  label?: ReactNode;
  /**
   * Where the label sits relative to the bar.
   * @default 'start-bottom'
   */
  labelPosition?: ProgressLabelPosition;
  /**
   * The id given to the label element, for `aria-labelledby`.
   */
  labelId?: string;
  children: ReactNode;
};

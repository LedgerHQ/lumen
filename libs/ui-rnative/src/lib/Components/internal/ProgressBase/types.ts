import type { ReactNode } from 'react';
import type { StyledViewProps } from '../../../../styles';

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
  children: ReactNode;
} & Omit<StyledViewProps, 'children'>;

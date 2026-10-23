import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
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
  /**
   * Layout props for the outermost element: the wrapper with a label,
   * otherwise the bar itself.
   */
  lx?: StyledViewProps['lx'];
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
};

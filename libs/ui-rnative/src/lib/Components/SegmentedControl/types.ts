import { ReactNode } from 'react';
import { StyledPressableProps } from '../../../styles';
import { BoxProps } from '../Utility';

export type SegmentedControlProps = {
  /**
   * Callback when the selected segment index changes.
   */
  onChange: (index: number) => void;
  /**
   * Accessible label for the control (e.g. "File view").
   */
  accessibilityLabel?: string;
  /**
   * Segment buttons (SegmentedControl.Button).
   */
  children: ReactNode;
} & Omit<BoxProps, 'children'>;

export type SegmentedControlButtonProps = {
  /**
   * Whether this segment is selected.
   */
  selected: boolean;
  /**
   * Button label (e.g. "Preview", "Raw").
   */
  children: ReactNode;
  /**
   * @internal Injected by SegmentedControl; do not pass.
   */
  index?: number;
  /**
   * Optional callback when the button is pressed (in addition to onChange on the parent).
   */
  onPress?: () => void;
} & Omit<StyledPressableProps, 'children'>;

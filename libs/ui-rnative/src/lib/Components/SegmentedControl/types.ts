import { ComponentType, ReactNode } from 'react';
import { StyledPressableProps } from '../../../styles';
import { IconSize } from '../Icon';
import { BoxProps } from '../Utility';

export type SegmentedControlProps = {
  /**
   * The value of the currently selected segment (drives the sliding pill).
   */
  selectedValue: string;
  /**
   * Callback when the selected segment value changes.
   */
  onSelectedChange: (value: string) => void;
  /**
   * Accessible label for the control (e.g. "File view").
   */
  accessibilityLabel?: string;
  /**
   * Segment buttons (SegmentedControlButton). Can be wrapped (e.g. in Tooltip).
   */
  children: ReactNode;
} & Omit<BoxProps, 'children'>;

type IconComponent = ComponentType<{
  size?: IconSize;
}>;

export type SegmentedControlButtonProps = {
  /**
   * Value for this segment (must be unique among siblings).
   */
  value: string;
  /**
   * Button label (e.g. "Preview", "Raw").
   */
  children: ReactNode;
  /**
   * Optional icon shown to the left of the label (from Symbols).
   */
  icon?: IconComponent;
  /**
   * Optional callback when the button is pressed (in addition to onSelectedChange on the parent).
   */
  onPress?: () => void;
} & Omit<StyledPressableProps, 'children'>;

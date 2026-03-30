import { ComponentType, ReactNode } from 'react';
import { LumenTextStyle, StyledPressableProps } from '../../../styles';
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
   * When true, the entire control is disabled (no interaction, selected uses muted styling).
   */
  disabled?: boolean;
  /**
   * Visual style of the control container: "background" shows the surface bg, "no-background" is transparent.
   * @default 'background'
   */
  appearance?: 'background' | 'no-background';
  /**
   * Controls how tab widths are calculated.
   * - "hug": each tab sizes to its content
   * - "fixed": all tabs share equal width, filling the container
   * @default 'fixed'
   */
  tabLayout?: 'hug' | 'fixed';
  /**
   * Accessible label for the control (e.g. "File view").
   */
  accessibilityLabel?: string;
  /**
   * Segment buttons (SegmentedControlButton).
   */
  children: ReactNode;
} & Omit<BoxProps, 'children'>;

type IconComponent = ComponentType<{
  size?: IconSize;
  color?: LumenTextStyle['color'];
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

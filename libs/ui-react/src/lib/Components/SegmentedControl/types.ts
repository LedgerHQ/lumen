import { ComponentType, ReactNode } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { IconSize } from '../Icon/types';

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
   * Segment buttons (SegmentedControlButton).
   */
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<'div'>, 'children'>;

type IconComponent = ComponentType<{
  size?: IconSize;
  className?: string;
}>;

export type SegmentedControlButtonProps = {
  /**
   * Value for this segment (must be unique among siblings).
   */
  value: string;
  /**
   * Button label.
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
} & Omit<ComponentPropsWithoutRef<'button'>, 'children'>;

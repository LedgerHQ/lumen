import type { ComponentType, ReactNode, ComponentPropsWithoutRef } from 'react';
import type { IconSize } from '../Icon/types';

export type SegmentedControlValue = string;

export type SegmentedControlProps<
  T extends SegmentedControlValue = SegmentedControlValue,
> = {
  /**
   * The value of the currently selected segment (drives the sliding pill).
   */
  selectedValue: T;
  /**
   * Callback when the selected segment value changes.
   */
  onSelectedChange: (value: T) => void;
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
   * - "fit": each tab sizes to its content
   * - "fixed": all tabs share equal width, filling the container
   * @default 'fixed'
   */
  tabLayout?: 'fit' | 'fixed';
  /**
   * Segment buttons (SegmentedControlButton).
   */
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<'div'>, 'children'>;

type IconComponent = ComponentType<{
  size?: IconSize;
  className?: string;
}>;

export type SegmentedControlButtonProps<
  T extends SegmentedControlValue = SegmentedControlValue,
> = {
  /**
   * Value for this segment (must be unique among siblings).
   */
  value: T;
  /**
   * Button label.
   */
  children: ReactNode;
  /**
   * Optional icon shown to the left of the label (from Symbols).
   */
  icon?: IconComponent;
  /**
   * Optional content shown to the right of the label (e.g. DotCount badge).
   */
  trailingContent?: ReactNode;
} & Omit<ComponentPropsWithoutRef<'button'>, 'children'>;

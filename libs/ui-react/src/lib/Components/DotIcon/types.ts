import type { ComponentPropsWithRef, ComponentType, ReactNode } from 'react';
import type { IconSize } from '../Icon';

export type DotIconSize = 16 | 20 | 24;

export type DotIconPin =
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end';

export type DotIconAppearance = 'success' | 'muted' | 'error';

export type DotIconProps = {
  /**
   * Icon component to render inside the dot.
   */
  icon: ComponentType<{ size?: IconSize; className?: string }>;
  /**
   * Semantic color of the dot background.
   */
  appearance: DotIconAppearance;
  /**
   * Corner placement of the dot indicator.
   * @default 'bottom-end'
   */
  pin?: DotIconPin;
  /**
   * The size of the dot indicator in pixels.
   * @default 20
   */
  size?: DotIconSize;
  /**
   * The shape of the dot indicator.
   * @default 'circle'
   */
  shape?: 'square' | 'circle';
  /**
   * Additional custom CSS classes to apply to the wrapper.
   */
  className?: string;
  /**
   * The wrapped component (e.g. MediaImage or Spot).
   */
  children?: ReactNode;
} & Omit<ComponentPropsWithRef<'div'>, 'children'>;

import type { ReactNode } from 'react';
import type { StyledViewProps } from '../../../../../styles';
import type { GradientStop } from '../gradient.types';
export type RadialGradientCenter = {
  /**
   * Horizontal position (0 = left, 1 = right)
   */
  x: number;
  /**
   * Vertical position (0 = top, 1 = bottom)
   */
  y: number;
};

export type RadialGradientProps = {
  /**
   * Gradient color stops
   * Takes an object of color, offset and opacity.
   * Offset is a number between 0 and 1.
   * Opacity is a number between 0 and 1.
   */
  stops: GradientStop[];
  /**
   * Optional children to render on top of the gradient
   */
  children?: ReactNode;
  /**
   * Center position of the gradient.
   * @default { x: 0.5, y: 0.5 }
   */
  center?: RadialGradientCenter;
} & StyledViewProps;

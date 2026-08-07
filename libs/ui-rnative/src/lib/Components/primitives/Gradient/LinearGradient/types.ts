import type { ReactNode } from 'react';
import type { StyledViewProps } from '../../../../../styles';
import type { GradientStop } from '../gradient.types';

export type GradientCoordinates = {
  x1: string;
  y1: string;
  x2: string;
  y2: string;
};

export type LinearGradientDirection =
  | 'to-bottom'
  | 'to-top'
  | 'to-left'
  | 'to-right'
  | 'to-bottomright'
  | 'to-bottomleft'
  | 'to-topright'
  | 'to-topleft';

/**
 * Props for the LinearGradient component.
 */
export type LinearGradientProps = {
  /**
   * Gradient color stops
   */
  stops: GradientStop[];
  /**
   * Optional children to render on top of the gradient
   */
  children?: ReactNode;
  /**
   * Direction preset for the gradient.
   * @default 'to-bottom'
   *
   * Can be a direction preset or a custom angle in degrees.
   * 0° points to the right, 90° points down.
   */
  direction?: LinearGradientDirection | number;
} & StyledViewProps;

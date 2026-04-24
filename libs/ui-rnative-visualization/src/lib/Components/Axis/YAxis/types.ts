import type { BaseAxisProps } from '../Axis';

export type YAxisProps = BaseAxisProps & {
  /**
   * Where the y-axis is rendered relative to the drawing area.
   * @default 'start'
   */
  position?: 'start' | 'end';
  /**
   * Width of the axis in pixels.
   * @default 40
   */
  width?: number;
};

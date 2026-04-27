import type { BaseAxisProps } from '../Axis.types';

export type XAxisProps = BaseAxisProps & {
  /**
   * Where the x-axis is rendered relative to the drawing area.
   * @default 'bottom'
   */
  position?: 'top' | 'bottom';
};

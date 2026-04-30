import type { ReactNode } from 'react';

import type { AxisConfigProps, ChartInset, Series } from '../../utils/types';

export type CartesianChartProps = {
  /**
   * Data series provided to child components via context.
   */
  series: Series[];
  /**
   * Scale and domain configuration for the x-axis.
   */
  xAxis?: Partial<AxisConfigProps>;
  /**
   * Scale and domain configuration for the y-axis.
   */
  yAxis?: Partial<AxisConfigProps>;
  /**
   * Width of the chart in pixels.
   * When omitted, the component auto-measures via `onLayout`.
   */
  width?: number;
  /**
   * Height of the chart in pixels.
   * @default 160
   */
  height?: number;
  /**
   * Extra padding between the SVG edge and the drawing area, added on top of
   * a built-in overflow buffer that prevents content (labels, points, ticks)
   * from being clipped. A number applies uniformly; a partial object sets
   * individual sides (unset sides default to `0`).
   */
  inset?: number | Partial<ChartInset>;
  /**
   * Space reserved for axes around the drawing area.
   * Shrinks the drawing area by the specified amount on each side.
   */
  axisPadding?: Partial<ChartInset>;
  /**
   * Accessible label for the chart.
   * @default 'Chart'
   */
  ariaLabel?: string;
  /**
   * SVG content rendered inside the chart's context provider.
   */
  children?: ReactNode;
};

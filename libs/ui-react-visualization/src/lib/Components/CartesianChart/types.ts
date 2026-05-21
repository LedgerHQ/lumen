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
   * Width of the chart.
   * A number is treated as pixels; a string (e.g. `'100%'`) fills the container
   * and enables auto-measurement via `ResizeObserver`.
   * @default '100%'
   */
  width?: number | string;
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
   * Accessible label for the chart SVG.
   * @default 'Chart'
   */
  ariaLabel?: string;
  /**
   * SVG content rendered inside the chart's context provider.
   */
  children?: ReactNode;
  /**
   * Enables scrubbing (hover/touch/keyboard) interactions on the chart.
   * When true, the SVG becomes focusable and captures pointer/keyboard events.
   * @default false
   */
  enableScrubbing?: boolean;
  /**
   * Callback fired whenever the scrubber moves to a new data index or is cleared.
   * Receives `undefined` when the scrubber leaves the chart.
   */
  onScrubberPositionChange?: (index: number | undefined) => void;
  /**
   * Whether to animate the chart on mount and data changes.
   * Duration is 0.8 seconds and easing is linear.
   * @default true
   */
  animate?: boolean;
  /**
   * Pixel radius within which the scrubber magnetically snaps to registered
   * magnetic `<Point>` components. Requires `enableScrubbing` to be `true`.
   * Set to `0` to disable magnetisation.
   * @default 6
   */
  magnetRadius?: number;
};

import type { ReactNode } from 'react';

import type { ChartInset, Series } from '../../utils/types';
import type { BaseAxisProps } from '../Axis';

export type CartesianChartProps = {
  /**
   * Data series provided to child components via context.
   */
  series: Series[];
  /**
   * Scale and domain configuration for the x-axis.
   */
  xAxis?: Partial<BaseAxisProps>;
  /**
   * Scale and domain configuration for the y-axis.
   */
  yAxis?: Partial<BaseAxisProps>;
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
   * Marks the chart as busy for assistive technologies (via the container's
   * accessibility state) to signal that its content is loading.
   * @default false
   */
  ariaBusy?: boolean;
  /**
   * Content rendered as an absolutely-positioned overlay above the chart SVG,
   * within the same positioned container (so it aligns with the chart
   * footprint). Used for e.g. an empty-state label.
   */
  overlay?: ReactNode;
  /**
   * SVG content rendered inside the chart's context provider.
   */
  children?: ReactNode;
  /**
   * Enables scrubbing (pan gesture) interactions on the chart.
   * When true, add a `<Scrubber>` as a child to visualise the interaction.
   * @default false
   */
  enableScrubbing?: boolean;
  /**
   * Callback fired whenever the scrubber moves to a new data index or is cleared.
   * Receives `undefined` when the scrub gesture ends or the scrubber position is otherwise cleared.
   */
  onScrubberPositionChange?: (index: number | undefined) => void;
  /**
   * Whether to animate the chart on mount and data changes.
   * Duration is 0.8 seconds.
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

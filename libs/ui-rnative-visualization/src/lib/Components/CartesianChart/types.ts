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
   * SVG content rendered in the always-visible "chrome" layer of the chart —
   * axes, grid, reference lines, scrubber visuals, and any other element that
   * should never be clipped by the reveal animation.
   *
   * Use this slot for components like `<XAxis>`, `<YAxis>`, `<ReferenceLine>`,
   * and `<Scrubber>` that frame or annotate the chart.
   */
  decorations?: ReactNode;
  /**
   * SVG content rendered in the animated "data" layer of the chart —
   * lines, points, and anything else that should be progressively revealed
   * when the chart mounts or when its data changes.
   *
   * Use this slot for `<Line>`, `<Point>`, or any other data-driven SVG.
   *
   * If `decorations` is omitted (legacy usage), `children` is rendered in the
   * chrome layer instead and no reveal animation is applied — preserving
   * backwards compatibility with consumers that pass mixed content here.
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
};

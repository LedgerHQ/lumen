import type { ReactNode } from 'react';

import type {
  ChartInset,
  ChartScaleFunction,
  DrawingArea,
  Series,
} from '../../utils/types';
import type { BaseAxisProps } from '../Axis';

/**
 * Chart-level scrubbing configuration. Owned here and composed by the chart
 * types and {@link ScrubberProviderProps} so the JSDoc lives in a single place.
 */
export type ScrubbingOptions = {
  /**
   * Enables scrubbing (hover/touch/keyboard) interactions on the chart.
   * When true, the SVG becomes focusable; add a `<Scrubber>` child to
   * visualise the interaction.
   * @default false
   */
  enableScrubbing?: boolean;
  /**
   * Callback fired whenever the scrubber moves to a new data index or is cleared.
   * Receives `undefined` when the scrubber leaves the chart.
   */
  onScrubberPositionChange?: (index: number | undefined) => void;
  /**
   * Pixel radius within which the scrubber magnetically snaps to registered
   * magnetic `<Point>` components. Requires `enableScrubbing` to be `true`.
   * Set to `0` to disable magnetization.
   * @default 8
   */
  magnetRadius?: number;
};

export type CartesianChartProps = ScrubbingOptions & {
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
   * Width of the chart.
   * A number is treated as pixels; a string (e.g. `'100%'`) fills the container
   * and enables auto-measurement via `ResizeObserver`.
   * @default '100%'
   */
  width?: number | string;
  /**
   * Height of the chart in pixels.
   * @default 240
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
   * Sets `aria-busy` on the chart SVG to signal that its content is loading.
   * @default false
   */
  ariaBusy?: boolean;
  /**
   * HTML content rendered as an absolutely-positioned overlay above the chart
   * SVG, within the same positioned container (so it aligns with the chart
   * footprint). Used for e.g. an empty-state label.
   */
  overlay?: ReactNode;
  /**
   * SVG content rendered inside the chart's context provider.
   */
  children?: ReactNode;
  /**
   * Whether to animate the chart on mount and data changes.
   * Duration is 0.8 seconds and easing is linear.
   * @default true
   */
  animate?: boolean;
};

export type CartesianChartContextValue = {
  /**
   * All data series registered in the chart.
   */
  series: Series[];
  /**
   * Lookup map for series by ID. Stable reference when series identity is unchanged.
   */
  seriesMap: Map<string, Series>;
  /**
   * Returns the x-axis scale. Accepts an optional axis ID for future multi-axis support.
   */
  getXScale: (id?: string) => ChartScaleFunction | undefined;
  /**
   * Returns the y-axis scale. Accepts an optional axis ID for future multi-axis support.
   */
  getYScale: (id?: string) => ChartScaleFunction | undefined;
  /**
   * Returns the x-axis config. Accepts an optional axis ID for future multi-axis support.
   */
  getXAxisConfig: (id?: string) => BaseAxisProps | undefined;
  /**
   * Returns the y-axis config. Accepts an optional axis ID for future multi-axis support.
   */
  getYAxisConfig: (id?: string) => BaseAxisProps | undefined;
  /**
   * Pixel bounds of the drawable region.
   */
  drawingArea: DrawingArea;
  /**
   * Number of data points along the x-axis.
   */
  dataLength: number;
};

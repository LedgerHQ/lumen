import type { ReactNode } from 'react';

import type { ChartInset, Series } from '../../utils/types';
import type { XAxisProps } from '../Axis/XAxis';
import type { YAxisProps } from '../Axis/YAxis';

export type LineChartProps = {
  /**
   * Data series to render as lines.
   * Each series produces one `<Line>` element.
   */
  series?: Series[];
  /**
   * Whether to show area fill under all lines.
   * @default false
   */
  showArea?: boolean;
  /**
   * Area fill style applied to all lines.
   * When `'gradient'`, renders a vertical gradient from the stroke color to transparent.
   * @default 'gradient'
   */
  areaType?: 'gradient';
  /**
   * Whether to render an x-axis.
   * @default false
   */
  showXAxis?: boolean;
  /**
   * Whether to render a y-axis.
   * @default false
   */
  showYAxis?: boolean;
  /**
   * Combined axis configuration and visual props for the x-axis.
   * Includes scale/domain settings as well as visual options like `showGrid` and `showLine`.
   */
  xAxis?: XAxisProps;
  /**
   * Combined axis configuration and visual props for the y-axis.
   * Includes scale/domain settings as well as visual options like `showGrid` and `showLine`.
   */
  yAxis?: YAxisProps;
  /**
   * Width of the chart.
   * A number is treated as pixels; a string (e.g. `'100%'`) fills the container.
   * @default '100%'
   */
  width?: number | string;
  /**
   * Height of the chart in pixels.
   * @default 240
   */
  height?: number;
  /**
   * Padding between the SVG edge and the drawing area.
   * A number applies uniformly; a partial object overrides individual sides.
   */
  inset?: number | Partial<ChartInset>;
  /**
   * Additional SVG content rendered inside the chart after lines and axes.
   */
  children?: ReactNode;
  /**
   * Enables scrubbing (hover/touch/keyboard) interactions on the chart.
   * When true, add a `<Scrubber>` as a child to visualise the interaction.
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
   * @default true
   */
  animate?: boolean;
  /**
   * Pixel radius within which the scrubber magnetically snaps to registered
   * magnetic `<Point>` components. Requires `enableScrubbing` to be `true`.
   * Set to `0` to disable magnetization.
   * @default 8
   */
  magnetRadius?: number;
  /**
   * Signals that new data is being fetched.
   *
   * - **No series**: renders an animated shimmer placeholder line.
   * - **Series present**: fades the current line to a muted grey and
   *   animates it until a new `series` is provided.
   *
   * @default false
   */
  loading?: boolean;
  /**
   * Text shown in the centre of the chart when there is no data and the chart
   * is not loading.
   * @default 'No data'
   */
  emptyLabel?: string;
};

/**
 * Series-render fields shared by `LineChart` and its internal line
 * sub-components. Derived from {@link LineChartProps} so the option types stay
 * in sync.
 */
type LineSeriesRenderProps = Required<
  Pick<LineChartProps, 'series' | 'showArea' | 'areaType'>
>;

export type LineChartLinesProps = LineSeriesRenderProps;

export type LineChartContentProps = LineSeriesRenderProps &
  Required<Pick<LineChartProps, 'showXAxis' | 'showYAxis'>> &
  Pick<LineChartProps, 'children'> & {
    xAxisConfig: XAxisProps;
    yAxisConfig: YAxisProps;
    isTransitionLoading: boolean;
  };

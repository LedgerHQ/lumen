import type { Series } from '../../utils/types';
import type { XAxisProps } from '../Axis/XAxis';
import type { YAxisProps } from '../Axis/YAxis';
import type { CartesianChartProps } from '../CartesianChart/types';
import type { LineRenderOptions } from '../Line/types';

export type LineChartProps = LineRenderOptions &
  Pick<
    CartesianChartProps,
    | 'width'
    | 'height'
    | 'inset'
    | 'animate'
    | 'children'
    | 'enableScrubbing'
    | 'onScrubberPositionChange'
    | 'magnetRadius'
  > & {
    /**
     * Data series to render as lines.
     * Each series produces one `<Line>` element.
     */
    series?: Series[];
    /**
     * Chart-wide override for null handling. When set, it applies to every line
     * and overrides any per-series `connectNulls`. When omitted, each series
     * follows its own `connectNulls` (default `false`, i.e. gaps at nulls).
     */
    connectNulls?: boolean;
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

export type LineChartLinesProps = LineSeriesRenderProps &
  Pick<LineChartProps, 'connectNulls'> & {
    stroke?: string;
  };

export type LineChartTransitionLinesProps = Omit<LineChartLinesProps, 'stroke'>;

export type LineChartContentProps = LineChartLinesProps &
  Required<Pick<LineChartProps, 'showXAxis' | 'showYAxis'>> &
  Pick<LineChartProps, 'children'> & {
    xAxisConfig: XAxisProps;
    yAxisConfig: YAxisProps;
    isTransitionLoading: boolean;
  };

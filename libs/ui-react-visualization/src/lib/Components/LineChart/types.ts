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
     * Chart-wide override controlling how null values are handled across all lines.
     * When true, skips null values and draws continuous lines across gaps.
     * When false, null values create gaps in the lines.
     * When omitted, each series' own `connectNulls` value is used (defaulting to `false`).
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
     * Whether the chart is loading. When there is no data, renders an animated
     * shimmer placeholder line (initial loading). When data is present (e.g. a
     * time-range change), the current line is recoloured to a muted grey and
     * shimmers until the new `series` is provided (transition loading).
     *
     * To get the transition behaviour, keep passing the previous `series` while
     * refetching; clearing it falls back to the initial placeholder.
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

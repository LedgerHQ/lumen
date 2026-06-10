import type { ChartInset, Series } from '../../utils/types';
import { DEFAULT_AXIS_HEIGHT } from '../Axis';
import type { XAxisProps } from '../Axis/XAxis';
import type { YAxisProps } from '../Axis/YAxis';

/**
 * Minimum number of non-null points a series needs to be drawable as a line.
 */
const MIN_VALID_POINTS = 2;
const LOADING_ARIA_LABEL = 'Loading chart';

type ComputeAxisPaddingParams = {
  showXAxis: boolean;
  showYAxis: boolean;
  xAxisPosition: XAxisProps['position'];
  yAxisPosition: YAxisProps['position'];
  yAxisWidth: YAxisProps['width'];
};

type ChartDisplayStateParams = {
  loading: boolean;
  hasData: boolean;
  emptyLabel: string;
};

/**
 * The mutually-exclusive states a chart can be in:
 * - `initial-loading`: loading with no data yet -> animated shimmer placeholder
 * - `empty`: not loading and no data -> static placeholder + empty label
 * - `transition-loading`: loading over existing data -> recoloured shimmer line
 * - `ready`: data present, not loading -> the actual chart
 */
type ChartStatus = 'initial-loading' | 'empty' | 'transition-loading' | 'ready';

type ChartDisplayState = {
  status: ChartStatus;
  ariaLabel: string | undefined;
};

/**
 * Reserves space on the relevant sides of the drawing area for visible axes.
 * Returns `undefined` when no axis is shown so the chart keeps its full area.
 */
export const computeAxisPadding = ({
  showXAxis,
  showYAxis,
  xAxisPosition,
  yAxisPosition,
  yAxisWidth,
}: ComputeAxisPaddingParams): Partial<ChartInset> | undefined => {
  if (!showXAxis && !showYAxis) {
    return undefined;
  }

  return {
    top: showXAxis && xAxisPosition === 'top' ? DEFAULT_AXIS_HEIGHT : 0,
    bottom: showXAxis && xAxisPosition === 'bottom' ? DEFAULT_AXIS_HEIGHT : 0,
    left: showYAxis && yAxisPosition === 'start' ? yAxisWidth : 0,
    right: showYAxis && yAxisPosition === 'end' ? yAxisWidth : 0,
  };
};

/**
 * Derives the chart's {@link ChartStatus} from its loading flag and whether it
 * has drawable data, along with the matching accessibility label.
 */
export const getChartDisplayState = ({
  loading,
  hasData,
  emptyLabel,
}: ChartDisplayStateParams): ChartDisplayState => {
  if (loading) {
    return {
      status: hasData ? 'transition-loading' : 'initial-loading',
      ariaLabel: LOADING_ARIA_LABEL,
    };
  }

  if (!hasData) {
    return { status: 'empty', ariaLabel: emptyLabel };
  }

  return { status: 'ready', ariaLabel: undefined };
};

/**
 * Whether any series has enough non-null points to render an actual line.
 * Drives the empty / loading / data states of the chart.
 */
export const hasValidSeriesData = (series: Series[] | undefined): boolean => {
  return (series ?? []).some((s) => {
    let validPoints = 0;
    for (const value of s.data ?? []) {
      if (value !== null) validPoints++;
      if (validPoints >= MIN_VALID_POINTS) return true;
    }
    return false;
  });
};

import type { ChartInset, Series } from '../../utils/types';
import { DEFAULT_AXIS_HEIGHT } from '../Axis';
import type { XAxisProps } from '../Axis/XAxis';
import type { YAxisProps } from '../Axis/YAxis';

/**
 * Minimum number of finite points a series needs to be drawable as a line.
 */
const MIN_DRAWABLE_POINTS = 2;
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
 * Whether any series has at least {@link MIN_DRAWABLE_POINTS} finite points,
 * i.e. enough to actually draw a line. Drives the empty / loading / data states
 * of the chart.
 */
export const canRenderLine = (series: Series[] | undefined): boolean => {
  return (series ?? []).some((s) => {
    let drawablePoints = 0;
    for (const value of s.data ?? []) {
      if (Number.isFinite(value)) drawablePoints++;
      if (drawablePoints >= MIN_DRAWABLE_POINTS) return true;
    }
    return false;
  });
};

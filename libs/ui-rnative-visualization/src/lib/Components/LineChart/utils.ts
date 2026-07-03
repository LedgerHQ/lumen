import { isFiniteNumber } from '../../utils/numbers';
import type { ChartInset, Series } from '../../utils/types';
import { DEFAULT_AXIS_HEIGHT } from '../Axis/XAxis';
import type { XAxisProps } from '../Axis/XAxis';
import { DEFAULT_AXIS_WIDTH } from '../Axis/YAxis';
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
};

type ChartDisplayStates = {
  showPlaceholder: boolean;
  placeholderLoading: boolean;
  showEmptyOverlay: boolean;
  isTransitionLoading: boolean;
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

  const resolvedYAxisWidth = yAxisWidth ?? DEFAULT_AXIS_WIDTH;

  return {
    top: showXAxis && xAxisPosition === 'top' ? DEFAULT_AXIS_HEIGHT : 0,
    bottom: showXAxis && xAxisPosition === 'bottom' ? DEFAULT_AXIS_HEIGHT : 0,
    left: showYAxis && yAxisPosition === 'start' ? resolvedYAxisWidth : 0,
    right: showYAxis && yAxisPosition === 'end' ? resolvedYAxisWidth : 0,
  };
};

/**
 * Derives the chart's display flags from its loading flag and whether it has
 * drawable data. The four input combinations map to the initial-loading, empty,
 * transition-loading, and ready states the chart renders.
 */
export const getChartDisplayStates = ({
  loading,
  hasData,
}: ChartDisplayStateParams): ChartDisplayStates => ({
  showPlaceholder: !hasData,
  placeholderLoading: loading && !hasData,
  showEmptyOverlay: !loading && !hasData,
  isTransitionLoading: loading && hasData,
});

/**
 * Accessibility label matching the chart's current state: the loading label
 * while loading, the empty label when there is nothing to draw, otherwise none.
 */
export const getChartAriaLabel = ({
  loading,
  hasData,
  emptyLabel,
}: ChartDisplayStateParams & { emptyLabel: string }): string | undefined => {
  if (loading) {
    return LOADING_ARIA_LABEL;
  }

  if (!hasData) {
    return emptyLabel;
  }

  return undefined;
};

/**
 * Whether any series has at least {@link MIN_DRAWABLE_POINTS} finite points,
 * i.e. enough to actually draw a line. Drives the empty / loading / data states
 * of the chart.
 *
 * When `xData` (the x-axis domain) is provided, only the first `xData.length`
 * points of each series are considered — mirroring the cap in `toScaledPoints`
 * (Line/utils.ts) — so a series longer than the axis cannot report drawable
 * points that would never be plotted.
 */
export const canRenderLine = (
  series: Series[] | undefined,
  xData?: readonly (string | number)[],
): boolean => {
  return (series ?? []).some((s) => {
    const data = s.data ?? [];
    const limit = xData ? Math.min(data.length, xData.length) : data.length;
    let drawablePoints = 0;
    for (let i = 0; i < limit; i++) {
      if (isFiniteNumber(data[i])) drawablePoints++;
      if (drawablePoints >= MIN_DRAWABLE_POINTS) return true;
    }
    return false;
  });
};

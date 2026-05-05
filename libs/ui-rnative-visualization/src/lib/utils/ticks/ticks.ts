import { isCategoricalScale, isNumericScale } from '../scales/scales';
import type {
  AxisConfigProps,
  ChartScaleFunction,
  DrawingArea,
} from '../types';

export const APPROXIMATE_TICK_COUNT = 5;

export type TickData = {
  position: number;
  value: number;
  label: string;
};

/**
 * Resolves which numeric tick values should appear on the axis.
 * Explicit ticks take priority, then scale-specific defaults.
 */
export const getTickValues = (
  scale: ChartScaleFunction,
  explicitTicks?: number[],
): number[] => {
  if (explicitTicks) return explicitTicks;
  if (isCategoricalScale(scale)) return scale.domain();
  if (isNumericScale(scale)) return scale.ticks(APPROXIMATE_TICK_COUNT);
  return [];
};

/**
 * Converts a tick value to its pixel position on the axis.
 * Band scales are centered within the band.
 */
export const getTickPosition = (
  scale: ChartScaleFunction,
  tick: number,
): number => {
  if (isCategoricalScale(scale)) {
    return (scale(tick) ?? 0) + scale.bandwidth() / 2;
  }
  return (scale as (v: number) => number)(tick);
};

/**
 * Resolves the display label for a tick value.
 * Priority: formatter > string label lookup > raw value.
 */
export const getTickLabel = (
  tick: number,
  axisData: AxisConfigProps['data'],
  formatter?: (value: number | string) => string,
): string => {
  const hasStringLabels =
    axisData && Array.isArray(axisData) && typeof axisData[0] === 'string';

  if (formatter) {
    const rawValue =
      hasStringLabels && axisData[tick] !== undefined ? axisData[tick] : tick;
    return String(formatter(rawValue as number | string));
  }

  if (hasStringLabels && axisData[tick] !== undefined) {
    return String(axisData[tick]);
  }

  return String(tick);
};

/**
 * Builds the complete tick data array from a scale and axis configuration.
 */
export const buildTicksData = (
  scale: ChartScaleFunction,
  axisConfig?: AxisConfigProps,
  explicitTicks?: number[],
  formatter?: (value: number | string) => string,
): TickData[] => {
  const tickValues = getTickValues(scale, explicitTicks);
  const axisData = axisConfig?.data;

  return tickValues.map((tick) => ({
    position: getTickPosition(scale, tick),
    value: tick,
    label: getTickLabel(tick, axisData, formatter),
  }));
};

/**
 * Excludes the X grid line at the Y-axis origin (left edge)
 * to prevent overlap with the Y-axis solid line.
 */
export const isTickOnXAxisDomainEdge = (
  tick: TickData,
  drawingArea: DrawingArea,
): boolean => {
  return tick.position !== drawingArea.x;
};

/**
 * Excludes the Y grid line at the X-axis origin (bottom edge)
 * to prevent overlap with the X-axis solid line.
 */
export const isTickOnYAxisDomainEdge = (
  tick: TickData,
  drawingArea: DrawingArea,
): boolean => {
  return tick.position !== drawingArea.y + drawingArea.height;
};

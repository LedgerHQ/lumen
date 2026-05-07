import { scaleBand, scaleLinear, scaleLog } from 'd3-scale';

import type {
  AxisBounds,
  AxisConfigProps,
  CategoricalScale,
  ChartScaleFunction,
  NumericScale,
} from '../types';

/**
 * Creates a numeric scale with `.nice()` applied so the domain
 * extends to clean rounded boundaries (e.g. `[4, 98]` → `[0, 100]`).
 */
export const getNumericScale = ({
  scaleType,
  domain,
  range,
}: {
  scaleType: 'linear' | 'log';
  domain: AxisBounds;
  range: AxisBounds;
}): NumericScale => {
  const scale = scaleType === 'log' ? scaleLog() : scaleLinear();
  return scale
    .domain([domain.min, domain.max])
    .nice()
    .range([range.min, range.max]);
};

export const getCategoricalScale = ({
  domain,
  range,
  padding = 0.1,
}: {
  domain: AxisBounds;
  range: AxisBounds;
  padding?: number;
}): CategoricalScale => {
  const domainArray = Array.from(
    { length: domain.max - domain.min + 1 },
    (_, i) => domain.min + i,
  );
  return scaleBand<number>()
    .domain(domainArray)
    .range([range.min, range.max])
    .paddingInner(padding)
    .paddingOuter(padding / 2);
};

/**
 * Checks if a scale type config value refers to a band (categorical) scale.
 */
export const isBandScaleType = (
  scaleType: AxisConfigProps['scaleType'],
): scaleType is 'band' => scaleType === 'band';

/**
 * Checks if a scale is a categorical scale.
 */
export const isCategoricalScale = (
  scale: ChartScaleFunction,
): scale is CategoricalScale => {
  return 'bandwidth' in scale && typeof scale.bandwidth === 'function';
};

/**
 * Checks if a scale is a numeric scale.
 */
export const isNumericScale = (
  scale: ChartScaleFunction,
): scale is NumericScale => {
  return !isCategoricalScale(scale);
};

/**
 * Returns the pixel coordinate at the center of the given data index on the scale.
 * For band (categorical) scales, centers on the bandwidth.
 * For numeric scales, calls the scale directly.
 */
export const getPointOnScale = (
  dataIndex: number,
  scale: ChartScaleFunction,
): number => {
  if (isCategoricalScale(scale)) {
    return (scale(dataIndex) ?? 0) + scale.bandwidth() / 2;
  }
  return scale(dataIndex) as number;
};

/**
 * Projects a single data-space coordinate pair to pixel-space
 * using the provided x and y scale functions.
 *
 * For categorical (band) scales the point is anchored at the center of the band.
 */
export const projectPoint = (
  dataX: number,
  dataY: number,
  xScale: ChartScaleFunction,
  yScale: ChartScaleFunction,
): { x: number; y: number } => ({
  x: getPointOnScale(dataX, xScale),
  y: getPointOnScale(dataY, yScale),
});

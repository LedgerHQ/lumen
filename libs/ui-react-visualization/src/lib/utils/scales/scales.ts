import { scaleBand, scaleLinear, scaleLog } from 'd3-scale';

import type { AxisBounds, BaseAxisProps } from '../../Components/Axis';
import type {
  CategoricalScale,
  ChartScaleFunction,
  NumericScale,
} from '../types';

/**
 * Creates a numeric scale.
 *
 * When `nice` is `true` (default), the domain is rounded outward to clean
 * boundaries via d3's `.nice()` (e.g. `[4, 98]` → `[0, 100]`). Set `nice` to
 * `false` to keep the domain exactly as provided so data fills the range
 * boundary-to-boundary.
 */
export const getNumericScale = ({
  scaleType,
  domain,
  range,
  nice = true,
}: {
  scaleType: 'linear' | 'log';
  domain: AxisBounds;
  range: AxisBounds;
  nice?: boolean;
}): NumericScale => {
  const scale = scaleType === 'log' ? scaleLog() : scaleLinear();
  scale.domain([domain.min, domain.max]);
  if (nice) {
    scale.nice();
  }
  return scale.range([range.min, range.max]);
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
  scaleType: BaseAxisProps['scaleType'],
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
 * Converts a single data-space value to pixel-space on a given scale.
 * For band scales the result is centered within the band.
 */
export const getPointOnScale = (
  value: number,
  scale: ChartScaleFunction,
): number => {
  if (isCategoricalScale(scale)) {
    return (scale(value) ?? 0) + scale.bandwidth() / 2;
  }
  return scale(value) as number;
};

/**
 * Projects a single data-space coordinate pair into pixel-space.
 * Handles centering for categorical (band) scales.
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

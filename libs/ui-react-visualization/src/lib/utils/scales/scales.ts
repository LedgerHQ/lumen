import { scaleBand, scaleLinear, scaleLog } from 'd3-scale';

import type {
  AxisBounds,
  AxisConfigProps,
  CategoricalScale,
  ChartScaleFunction,
  NumericScale,
} from '../types';

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
  return scale.domain([domain.min, domain.max]).range([range.min, range.max]);
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

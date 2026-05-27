import type { AxisBounds, AxisConfigProps, Series } from '../types';

/**
 * Compute the X domain (index-based) from series data and axis config.
 * For the X axis the domain is typically 0..N-1 where N = longest series length,
 * unless explicit `data` is provided on the axis config.
 */
export const computeXDomain = (
  series: Series[],
  axisConfig?: Partial<AxisConfigProps>,
): AxisBounds => {
  const axisData = axisConfig?.data;

  let autoBounds: AxisBounds;

  if (axisData && axisData.length > 0) {
    if (typeof axisData[0] === 'number') {
      const nums = axisData as number[];
      let min = nums[0];
      let max = nums[0];
      for (let i = 1; i < nums.length; i += 1) {
        const value = nums[i];
        if (value < min) min = value;
        if (value > max) max = value;
      }
      autoBounds = { min, max };
    } else {
      autoBounds = { min: 0, max: axisData.length - 1 };
    }
  } else {
    const maxLen = series.reduce(
      (max, s) => Math.max(max, s.data?.length ?? 0),
      0,
    );
    autoBounds = { min: 0, max: Math.max(0, maxLen - 1) };
  }

  return applyDomainOverride(autoBounds, axisConfig?.domain);
};

/**
 * Compute the Y domain (value-based) from series data and axis config.
 * Scans all non-null values across all series to find min/max.
 */
export const computeYDomain = (
  series: Series[],
  axisConfig?: Partial<AxisConfigProps>,
): AxisBounds => {
  let min = 0;
  let max = 0;
  let hasValue = false;

  for (const s of series) {
    if (!s.data) continue;
    for (const v of s.data) {
      if (v !== null && v !== undefined) {
        if (!hasValue) {
          min = v;
          max = v;
          hasValue = true;
        } else {
          if (v < min) min = v;
          if (v > max) max = v;
        }
      }
    }
  }

  const autoBounds: AxisBounds = hasValue ? { min, max } : { min: 0, max: 1 };

  return applyDomainOverride(autoBounds, axisConfig?.domain);
};

/**
 * Compute the data length (number of discrete positions on the index axis).
 */
export const computeDataLength = (
  series: Series[],
  axisConfig?: Partial<AxisConfigProps>,
): number => {
  if (axisConfig?.data && axisConfig.data.length > 0) {
    return axisConfig.data.length;
  }
  return series.reduce((max, s) => Math.max(max, s.data?.length ?? 0), 0);
};

const applyDomainOverride = (
  autoBounds: AxisBounds,
  domainOverride?: AxisConfigProps['domain'],
): AxisBounds => {
  if (!domainOverride) return autoBounds;

  if (typeof domainOverride === 'function') {
    return domainOverride(autoBounds);
  }

  return {
    min: domainOverride.min ?? autoBounds.min,
    max: domainOverride.max ?? autoBounds.max,
  };
};

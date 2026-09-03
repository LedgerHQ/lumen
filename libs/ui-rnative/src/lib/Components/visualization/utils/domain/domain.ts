import type { AxisBounds, BaseAxisProps } from '../../Axis';
import type { Series } from '../types';

type AxisData = NonNullable<BaseAxisProps['data']>;

/**
 * Compute the X domain (index-based) from series data and axis config.
 * For the X axis the domain is typically 0..N-1 where N = longest series length,
 * unless explicit `data` is provided on the axis config.
 */
export const computeXDomain = (
  series: Series[],
  axisConfig?: Partial<BaseAxisProps>,
): AxisBounds =>
  applyDomainOverride(
    computeXBounds(series, axisConfig?.data),
    axisConfig?.domain,
  );

/**
 * Compute the Y domain (value-based) from series data and axis config.
 * Scans all non-null values across all series to find min/max.
 */
export const computeYDomain = (
  series: Series[],
  axisConfig?: Partial<BaseAxisProps>,
): AxisBounds =>
  applyDomainOverride(computeYBounds(series), axisConfig?.domain);

/**
 * Compute the data length (number of discrete positions on the index axis).
 */
export const computeDataLength = (
  series: Series[],
  axisConfig?: Partial<BaseAxisProps>,
): number => axisConfig?.data?.length || longestSeriesLength(series);

const computeXBounds = (series: Series[], axisData?: AxisData): AxisBounds => {
  if (!axisData?.length) {
    return { min: 0, max: Math.max(0, longestSeriesLength(series) - 1) };
  }

  if (isNumericAxis(axisData)) return extentOf(axisData, { min: 0, max: 0 });

  return { min: 0, max: axisData.length - 1 };
};

const computeYBounds = (series: Series[]): AxisBounds => {
  const values = definedValues(series);

  return extentOf(values, { min: 0, max: 1 });
};

const isNumericAxis = (data: AxisData): data is number[] =>
  typeof data[0] === 'number';

const extentOf = (values: number[], emptyBounds: AxisBounds): AxisBounds => {
  if (values.length === 0) return emptyBounds;

  const initialBounds = { min: values[0], max: values[0] };

  return values.slice(1).reduce<AxisBounds>(
    (bounds, value) => ({
      min: Math.min(bounds.min, value),
      max: Math.max(bounds.max, value),
    }),
    initialBounds,
  );
};

const longestSeriesLength = (series: Series[]): number =>
  series.reduce((max, s) => Math.max(max, s.data?.length ?? 0), 0);

const definedValues = (series: Series[]): number[] =>
  series.flatMap((s) => s.data ?? []).filter((v): v is number => v != null);

const applyDomainOverride = (
  autoBounds: AxisBounds,
  domainOverride?: BaseAxisProps['domain'],
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

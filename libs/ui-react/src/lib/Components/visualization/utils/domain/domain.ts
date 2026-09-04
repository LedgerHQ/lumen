import type { AxisBounds, BaseAxisProps } from '../../Axis';
import type { Series } from '../types';

type AxisData = NonNullable<BaseAxisProps['data']>;

/**
 * Running min/max, mutated in place. Scanning a chart's values allocates
 * nothing beyond this single object — series can hold thousands of points and
 * the scan reruns whenever `series` changes.
 */
type BoundsAccumulator = { min: number; max: number; hasValue: boolean };

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
  const accumulator = createAccumulator();

  for (const { data } of series) {
    if (!data) continue;
    for (const value of data) {
      if (value !== null) accumulate(accumulator, value);
    }
  }

  return sealBounds(accumulator, { min: 0, max: 1 });
};

const isNumericAxis = (data: AxisData): data is number[] =>
  typeof data[0] === 'number';

const extentOf = (values: number[], emptyBounds: AxisBounds): AxisBounds => {
  const accumulator = createAccumulator();

  for (const value of values) accumulate(accumulator, value);

  return sealBounds(accumulator, emptyBounds);
};

const createAccumulator = (): BoundsAccumulator => ({
  min: 0,
  max: 0,
  hasValue: false,
});

/**
 * Non-finite values are skipped rather than folded in. `Math.min(x, NaN)` is
 * NaN, so a single bad point — a division by zero upstream, a failed parse —
 * would otherwise poison the whole domain, and d3 would map every coordinate to
 * NaN: a blank chart with no error anywhere. `Series['data']` is typed
 * `(number | null)[]`, so nothing upstream rules NaN out.
 */
const accumulate = (accumulator: BoundsAccumulator, value: number): void => {
  if (!Number.isFinite(value)) return;

  if (!accumulator.hasValue) {
    accumulator.min = value;
    accumulator.max = value;
    accumulator.hasValue = true;
    return;
  }

  if (value < accumulator.min) accumulator.min = value;
  if (value > accumulator.max) accumulator.max = value;
};

const sealBounds = (
  { min, max, hasValue }: BoundsAccumulator,
  emptyBounds: AxisBounds,
): AxisBounds => (hasValue ? { min, max } : emptyBounds);

const longestSeriesLength = (series: Series[]): number =>
  series.reduce((max, s) => Math.max(max, s.data?.length ?? 0), 0);

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

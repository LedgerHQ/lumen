import {
  getPointOnScale,
  isCategoricalScale,
  isNumericScale,
} from '../../utils/scales/scales';
import type { AxisConfigProps, ChartScaleFunction } from '../../utils/types';
import type { useCartesianChartContext } from '../CartesianChart/context';

const isNumberArray = (arr: string[] | number[]): arr is number[] =>
  typeof arr[0] === 'number';

/**
 * Returns the index of the item whose pixel position is closest to `pixelX`.
 * `getPixelPosition` maps each index to its pixel coordinate (or undefined if
 * the value cannot be projected).
 */
const findClosestIndex = (
  length: number,
  pixelX: number,
  getPixelPosition: (index: number) => number | undefined,
): number => {
  let closestIndex = 0;
  let closestDistance = Infinity;

  for (let i = 0; i < length; i++) {
    const pos = getPixelPosition(i);
    if (pos === undefined) continue;

    const distance = Math.abs(pixelX - pos);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = i;
    }
  }

  return closestIndex;
};

/**
 * Converts a pixel position along the x-axis into the nearest data index.
 *
 * For band (categorical) scales, finds the band whose center is closest to
 * `pixelX`. For numeric scales, uses `scale.invert()` and rounds to the
 * nearest integer, clamped to the valid index range.
 */
export const getDataIndexFromPosition = (
  pixelX: number,
  scale: ChartScaleFunction,
  axisConfig: Partial<AxisConfigProps> | undefined,
  dataLength: number,
): number => {
  if (isCategoricalScale(scale)) {
    const domain = scale.domain();
    const step = scale.step();
    const [rangeStart] = scale.range();
    const offset =
      rangeStart + scale.paddingOuter() * step + scale.bandwidth() / 2;
    const index = Math.round((pixelX - offset) / step);
    return Math.max(0, Math.min(index, domain.length - 1));
  }

  if (isNumericScale(scale)) {
    const axisData = axisConfig?.data;

    if (axisData && axisData.length > 0 && isNumberArray(axisData)) {
      return findClosestIndex(axisData.length, pixelX, (i) =>
        scale(axisData[i]),
      );
    }

    const inverted = scale.invert(pixelX);
    return Math.max(
      0,
      Math.min(Math.round(inverted as number), dataLength - 1),
    );
  }

  return 0;
};

/**
 * Resolves the pixel y-coordinate for a given series data point at a data index.
 * Returns undefined when the value is null/missing or the scale is unavailable.
 */
export const resolvePixelY = (
  dataIndex: number,
  seriesData: (number | null)[] | undefined,
  getYScale: ReturnType<typeof useCartesianChartContext>['getYScale'],
): number | undefined => {
  const yScale = getYScale();
  if (!yScale || !isNumericScale(yScale)) return undefined;
  if (!seriesData) return undefined;

  const value = seriesData[dataIndex];
  if (value === null || value === undefined) return undefined;

  return yScale(value) as number;
};

/**
 * Resolves the pixel x-coordinate for a given data index using the x-scale.
 * When numeric x-axis data is provided, the corresponding axis value is used;
 * otherwise the data index is used as the x input.
 * Returns undefined only when the scale is unavailable.
 */
export const resolvePixelX = (
  dataIndex: number,
  getXScale: ReturnType<typeof useCartesianChartContext>['getXScale'],
  axisConfig?: AxisConfigProps,
): number | undefined => {
  const scale = getXScale();
  if (!scale) return undefined;
  const axisValue = axisConfig?.data?.[dataIndex];
  const xValue = typeof axisValue === 'number' ? axisValue : dataIndex;
  return getPointOnScale(xValue, scale);
};

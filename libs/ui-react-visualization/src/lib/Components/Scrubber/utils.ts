import {
  getPointOnScale,
  isCategoricalScale,
  isNumericScale,
} from '../../utils/scales/scales';
import type { ChartScaleFunction } from '../../utils/types';
import type { BaseAxisProps } from '../Axis';
import type { useCartesianChartContext } from '../CartesianChart/context';

export const BEACON_RADIUS = 5;
export const BEACON_STROKE_WIDTH = 2;
export const LABEL_OFFSET_Y = 12;
export const OVERLAY_OFFSET = 2;
export const OVERLAY_LINE_INSET = 0.5;
export const OVERLAY_OPACITY = 0.8;
export const LINE_GRADIENT_EDGE_OPACITY = 0.1;

export type MagnetEntry = {
  index: number;
  pixelX: number;
};

/**
 * Resolves each magnetic index to its pixel position and returns them sorted
 * by `pixelX` ascending. Indices that cannot be projected are filtered out.
 * The sorted output enables early-exit in {@link applyMagnetization}.
 */
export const buildSortedMagnets = ({
  magneticIndices,
  getPixelForIndex,
}: {
  magneticIndices: ReadonlySet<number>;
  getPixelForIndex: (index: number) => number | undefined;
}): MagnetEntry[] => {
  if (magneticIndices.size === 0) return [];

  const magnets: MagnetEntry[] = [];

  for (const index of magneticIndices) {
    const pixelX = getPixelForIndex(index);
    if (pixelX !== undefined) magnets.push({ index, pixelX });
  }

  magnets.sort((a, b) => a.pixelX - b.pixelX);

  return magnets;
};

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
  axisConfig: Partial<BaseAxisProps> | undefined,
  dataLength: number,
): number => {
  if (isCategoricalScale(scale)) {
    const domain = scale.domain();
    const bandwidth = scale.bandwidth();
    return findClosestIndex(domain.length, pixelX, (i) => {
      const pos = scale(domain[i]);
      return pos === undefined ? undefined : pos + bandwidth / 2;
    });
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
 * Returns undefined when the scale is unavailable or the value cannot be mapped.
 */
export const resolvePixelX = (
  dataIndex: number,
  getXScale: ReturnType<typeof useCartesianChartContext>['getXScale'],
  axisConfig?: BaseAxisProps,
): number | undefined => {
  const scale = getXScale();
  if (!scale) return undefined;
  const axisValue = axisConfig?.data?.[dataIndex];
  const xValue = typeof axisValue === 'number' ? axisValue : dataIndex;
  return getPointOnScale(xValue, scale);
};

/**
 * Binary search for the magnet whose `pixelX` is closest to `pixelX`.
 * Returns -1 when the array is empty. Favors the left neighbor on ties.
 */
export const nearestIndex = (
  sortedMagnets: readonly MagnetEntry[],
  pixelX: number,
): number => {
  if (sortedMagnets.length === 0) return -1;

  let left = 0;
  let right = sortedMagnets.length;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (sortedMagnets[mid].pixelX < pixelX) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  if (left === 0) return 0;
  if (left === sortedMagnets.length) return left - 1;

  const distBefore = pixelX - sortedMagnets[left - 1].pixelX;
  const distAfter = sortedMagnets[left].pixelX - pixelX;

  return distBefore <= distAfter ? left - 1 : left;
};

/**
 * Given a resolved data index and the raw pixel position, checks whether any
 * magnetic point is within `magnetRadius` pixels of `pixelX`. If so, returns
 * the closest magnetic index; otherwise returns the original `resolvedIndex`.
 */
export const applyMagnetization = ({
  resolvedIndex,
  pixelX,
  sortedMagnets,
  magnetRadius,
}: {
  resolvedIndex: number;
  pixelX: number;
  sortedMagnets: readonly MagnetEntry[];
  magnetRadius: number;
}): number => {
  if (magnetRadius <= 0 || sortedMagnets.length === 0) return resolvedIndex;

  const nearest = nearestIndex(sortedMagnets, pixelX);
  if (
    nearest >= 0 &&
    Math.abs(sortedMagnets[nearest].pixelX - pixelX) <= magnetRadius
  ) {
    return sortedMagnets[nearest].index;
  }
  return resolvedIndex;
};

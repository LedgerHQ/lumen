import {
  getPointOnScale,
  isCategoricalScale,
  isNumericScale,
} from '../../utils/scales/scales';
import type { AxisConfigProps, ChartScaleFunction } from '../../utils/types';
import type { useCartesianChartContext } from '../CartesianChart/context';

export { getPointOnScale };

/**
 * Returns the index of the element in `pixelPositions` closest to `targetPixel`.
 * Skips `undefined` entries. Returns `0` when the array is empty.
 */
const findClosestIndex = (
  targetPixel: number,
  pixelPositions: (number | undefined)[],
): number => {
  let closestIndex = 0;
  let closestDistance = Infinity;
  for (let i = 0; i < pixelPositions.length; i++) {
    const pos = pixelPositions[i];
    if (pos !== undefined) {
      const distance = Math.abs(targetPixel - pos);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    }
  }
  return closestIndex;
};

export const BEACON_RADIUS = 5;
export const BEACON_STROKE_WIDTH = 2;
export const LABEL_OFFSET_Y = 12;
export const OVERLAY_OFFSET = 2;

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
    const bandwidth = scale.bandwidth();
    const centers = domain.map((d) => {
      const pos = scale(d);
      return pos !== undefined ? pos + bandwidth / 2 : undefined;
    });
    return findClosestIndex(pixelX, centers);
  }

  if (isNumericScale(scale)) {
    const axisData = axisConfig?.data;

    if (axisData && axisData.length > 0 && typeof axisData[0] === 'number') {
      const positions = axisData.map(
        (d) => scale(d as number) as number | undefined,
      );
      return findClosestIndex(pixelX, positions);
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
 * Returns undefined when the scale is unavailable or the value cannot be mapped.
 */
export const resolvePixelX = (
  dataIndex: number,
  getXScale: ReturnType<typeof useCartesianChartContext>['getXScale'],
): number | undefined => {
  const scale = getXScale();
  if (!scale) return undefined;
  return getPointOnScale(dataIndex, scale);
};

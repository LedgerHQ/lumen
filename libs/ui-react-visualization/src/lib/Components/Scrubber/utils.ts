import { isCategoricalScale, isNumericScale } from '../../utils/scales/scales';
import type { AxisConfigProps, ChartScaleFunction } from '../../utils/types';

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
    let closestIndex = 0;
    let closestDistance = Infinity;

    for (let i = 0; i < domain.length; i++) {
      const pos = scale(domain[i]);
      if (pos !== undefined) {
        const center = pos + bandwidth / 2;
        const distance = Math.abs(pixelX - center);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      }
    }
    return closestIndex;
  }

  if (isNumericScale(scale)) {
    const axisData = axisConfig?.data;

    if (axisData && axisData.length > 0 && typeof axisData[0] === 'number') {
      // Numeric axis data: find the data point whose pixel position is closest
      let closestIndex = 0;
      let closestDistance = Infinity;
      for (let i = 0; i < axisData.length; i++) {
        const pos = scale(axisData[i] as number);
        if (pos !== undefined) {
          const distance = Math.abs(pixelX - (pos as number));
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = i;
          }
        }
      }
      return closestIndex;
    }

    // Continuous scale with no explicit data: invert pixel to data index
    const inverted = scale.invert(pixelX);
    return Math.max(
      0,
      Math.min(Math.round(inverted as number), dataLength - 1),
    );
  }

  return 0;
};

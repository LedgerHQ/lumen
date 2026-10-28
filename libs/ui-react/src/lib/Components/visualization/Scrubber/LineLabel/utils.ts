import type { BaseAxisProps } from '../../Axis';
import { chartConfig } from '../../config';
import { getTickLabel } from '../../utils/ticks/ticks';
import type { DrawingArea } from '../../utils/types';
import type { LineLabelContext } from '../types';

const { lineLabel } = chartConfig;

/**
 * Resolves the x-axis value at `dataIndex` and formats it the same way the
 * axis formats its tick labels.
 */
export const resolveLineLabelContext = (
  dataIndex: number,
  axisConfig: BaseAxisProps | undefined,
): LineLabelContext => {
  const value = axisConfig?.data?.[dataIndex] ?? dataIndex;
  const tick = typeof value === 'number' ? value : dataIndex;

  return {
    dataIndex,
    value,
    label: getTickLabel(tick, axisConfig?.data, axisConfig?.tickLabelFormatter),
  };
};

/**
 * Centers the label on the scrubber line, clamped so it never overflows the
 * drawing area horizontally.
 */
export const computeLineLabelX = (
  pixelX: number,
  width: number,
  drawingArea: DrawingArea,
): number => {
  const centered = pixelX - width / 2;
  const maxX = drawingArea.x + drawingArea.width - width;

  return Math.max(drawingArea.x, Math.min(centered, maxX));
};

/**
 * Top edge of the label, sitting above the drawing area where the line starts.
 */
export const computeLineLabelY = (drawingArea: DrawingArea): number => {
  return drawingArea.y - lineLabel.gap - lineLabel.height;
};

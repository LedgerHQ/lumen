import type { LabelDrawingArea } from './types';

/**
 * Centers the label on the scrubber line, clamped so it never overflows the
 * drawing area horizontally.
 */
export const computeLineLabelX = (
  pixelX: number,
  width: number,
  drawingArea: LabelDrawingArea,
): number => {
  const centered = pixelX - width / 2;
  const maxX = drawingArea.x + drawingArea.width - width;

  return Math.max(drawingArea.x, Math.min(centered, maxX));
};

/**
 * Top edge of the label, sitting `gap` above the drawing area where the line
 * starts.
 */
export const computeLineLabelY = (
  drawingArea: LabelDrawingArea,
  { gap, height }: { gap: number; height: number },
): number => {
  return drawingArea.y - gap - height;
};

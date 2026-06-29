import type { DrawingArea } from '../../../utils/types';
import { PLACEHOLDER_VIEW_HEIGHT, PLACEHOLDER_VIEW_WIDTH } from '../constants';

/**
 * Transform that fits {@link PLACEHOLDER_LINE_PATH} into the drawing area. Pair
 * with `vector-effect: non-scaling-stroke` on the path so the stroke keeps a
 * constant width despite the (potentially non-uniform) scale.
 */
export const buildPlaceholderTransform = (drawingArea: DrawingArea): string => {
  const scaleX = drawingArea.width / PLACEHOLDER_VIEW_WIDTH;
  const scaleY = drawingArea.height / PLACEHOLDER_VIEW_HEIGHT;

  return `translate(${drawingArea.x}, ${drawingArea.y}) scale(${scaleX}, ${scaleY})`;
};

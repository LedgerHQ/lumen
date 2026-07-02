import { chartConfig } from '../../../config';
import type { DrawingArea } from '../../../utils/types';

/**
 * Transform that fits the placeholder line into the drawing area. Pair with
 * `vector-effect: non-scaling-stroke` on the path so the stroke keeps a constant
 * width despite the (potentially non-uniform) scale.
 */
export const buildPlaceholderTransform = (drawingArea: DrawingArea): string => {
  const scaleX =
    drawingArea.width / chartConfig.emptyState.placeholderViewWidth;
  const scaleY =
    drawingArea.height / chartConfig.emptyState.placeholderViewHeight;

  return `translate(${drawingArea.x}, ${drawingArea.y}) scale(${scaleX}, ${scaleY})`;
};

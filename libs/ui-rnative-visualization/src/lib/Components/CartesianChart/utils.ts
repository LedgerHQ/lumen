import type { ChartInset } from '../../utils/types';
import type { CartesianChartProps } from './types';

export const DEFAULT_HEIGHT = 228;

/**
 * Internal buffer added around the drawing area so SVG content (labels, points,
 * ticks) drawn at the edges is not clipped. The SVG canvas is enlarged by this
 * buffer on every side and shifted back by {@link OVERFLOW_OFFSET} so
 * the chart's layout footprint (and the drawing area) stays exactly the
 * consumer-provided width/height.
 */
export const OVERFLOW_BUFFER: ChartInset = {
  top: 25,
  right: 25,
  bottom: 25,
  left: 25,
};
/**
 * Top/left offset applied to the (enlarged) SVG group so its drawing area aligns
 * with the container's top-left. The extra width/height added to the SVG
 * overflows symmetrically on every side via `overflow: visible`.
 *
 * Uses `position: relative` to keep parity with the web implementation, where a
 * negative `margin-top` would collapse through the container instead of
 * offsetting the SVG inside it.
 */
export const OVERFLOW_OFFSET = {
  position: 'relative' as const,
  top: -OVERFLOW_BUFFER.top,
  left: -OVERFLOW_BUFFER.left,
};

export const ZERO_PADDING: ChartInset = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

export const resolveInset = (
  inset: CartesianChartProps['inset'],
): ChartInset => {
  let consumer: ChartInset;
  if (inset === undefined) {
    consumer = ZERO_PADDING;
  } else if (typeof inset === 'number') {
    consumer = { top: inset, right: inset, bottom: inset, left: inset };
  } else {
    consumer = {
      top: inset.top ?? 0,
      right: inset.right ?? 0,
      bottom: inset.bottom ?? 0,
      left: inset.left ?? 0,
    };
  }

  return {
    top: consumer.top + OVERFLOW_BUFFER.top,
    right: consumer.right + OVERFLOW_BUFFER.right,
    bottom: consumer.bottom + OVERFLOW_BUFFER.bottom,
    left: consumer.left + OVERFLOW_BUFFER.left,
  };
};

export const resolveAxisPadding = (
  padding: CartesianChartProps['axisPadding'],
): ChartInset => {
  if (padding === undefined) return ZERO_PADDING;
  return {
    top: padding.top ?? 0,
    right: padding.right ?? 0,
    bottom: padding.bottom ?? 0,
    left: padding.left ?? 0,
  };
};

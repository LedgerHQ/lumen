import type { ChartInset } from '../../utils/types';
import type { CartesianChartProps } from './types';

export const DEFAULT_HEIGHT = 160;

/**
 * Top/left offset applied to the (enlarged) SVG so its drawing area aligns with
 * the container's top-left. The extra width/height added to the SVG overflows
 * symmetrically on every side via `overflow: visible`.
 *
 * Uses `position: relative` rather than negative margins: a negative
 * `margin-top` would collapse through the container (which has no border,
 * padding, or block-formatting context), shifting the whole container instead
 * of offsetting the SVG inside it.
 */
export const OVERFLOW_OFFSET = {
  position: 'relative' as const,
  top: 0,
  left: 0,
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
    top: consumer.top,
    right: consumer.right,
    bottom: consumer.bottom,
    left: consumer.left,
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

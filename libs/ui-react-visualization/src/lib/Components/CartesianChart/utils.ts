import type { ChartInset } from '../../utils/types';
import type { CartesianChartProps } from './types';

export const DEFAULT_HEIGHT = 160;

/**
 * Internal buffer that prevents SVG content (labels, points, ticks) from being
 * clipped at the edge of the container. Compensated by negative margins on the
 * wrapper so the chart's visual footprint stays unchanged.
 */
export const OVERFLOW_BUFFER: ChartInset = {
  top: 30,
  right: 20,
  bottom: 30,
  left: 20,
};
export const OVERFLOW_NEGATIVE_MARGIN = {
  marginTop: -OVERFLOW_BUFFER.top,
  marginRight: -OVERFLOW_BUFFER.right,
  marginBottom: -OVERFLOW_BUFFER.bottom,
  marginLeft: -OVERFLOW_BUFFER.left,
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

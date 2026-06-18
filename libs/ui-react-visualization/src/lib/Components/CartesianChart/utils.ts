import type { ChartInset } from '../../utils/types';
import type { CartesianChartProps } from './types';

export const DEFAULT_HEIGHT = 240;

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

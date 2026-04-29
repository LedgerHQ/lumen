import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChartInset } from '../../utils/types';

import { CartesianChartProvider, useBuildChartContext } from './context';
import type { CartesianChartProps } from './types';

const DEFAULT_HEIGHT = 160;

/**
 * Internal buffer that prevents SVG content (labels, points, ticks) from being
 * clipped at the edge of the container. Compensated by negative margins on the
 * wrapper so the chart's visual footprint stays unchanged.
 */
const OVERFLOW_BUFFER: ChartInset = {
  top: 30,
  right: 20,
  bottom: 30,
  left: 20,
};
const OVERFLOW_NEGATIVE_MARGIN = {
  marginTop: -OVERFLOW_BUFFER.top,
  marginRight: -OVERFLOW_BUFFER.right,
  marginBottom: -OVERFLOW_BUFFER.bottom,
  marginLeft: -OVERFLOW_BUFFER.left,
};
const ZERO_PADDING: ChartInset = { top: 0, right: 0, bottom: 0, left: 0 };

const resolveInset = (inset: CartesianChartProps['inset']): ChartInset => {
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

const resolveAxisPadding = (
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

export function CartesianChart({
  series,
  xAxis,
  yAxis,
  width = '100%',
  height = DEFAULT_HEIGHT,
  inset,
  axisPadding,
  ariaLabel = 'Chart',
  children,
}: CartesianChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [measuredWidth, setMeasuredWidth] = useState<number | undefined>(
    typeof width === 'number' ? width : undefined,
  );

  const needsMeasurement = typeof width !== 'number';

  const handleResize = useCallback((entries: ResizeObserverEntry[]) => {
    const [entry] = entries;
    if (entry) {
      setMeasuredWidth(entry.contentRect.width);
    }
  }, []);

  useEffect(() => {
    if (
      !needsMeasurement ||
      !containerRef.current ||
      typeof ResizeObserver === 'undefined'
    )
      return;

    const observer = new ResizeObserver(handleResize);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [needsMeasurement, handleResize]);

  const resolvedWidth =
    typeof width === 'number' ? width : (measuredWidth ?? 0);

  const resolvedInset = useMemo(() => resolveInset(inset), [inset]);
  const resolvedAxisPadding = useMemo(
    () => resolveAxisPadding(axisPadding),
    [axisPadding],
  );

  const contextValue = useBuildChartContext({
    series,
    xAxis,
    yAxis,
    width: resolvedWidth,
    height,
    inset: resolvedInset,
    axisPadding: resolvedAxisPadding,
  });

  const svgContent = (
    <svg
      data-testid='chart-svg'
      width={resolvedWidth}
      height={height}
      role='img'
      aria-label={ariaLabel || 'Chart'}
      style={{ display: 'block', overflow: 'visible' }}
    >
      <CartesianChartProvider value={contextValue}>
        {children}
      </CartesianChartProvider>
    </svg>
  );

  if (needsMeasurement) {
    return (
      <div
        ref={containerRef}
        data-testid='chart-container'
        style={{
          width,
          height,
          ...OVERFLOW_NEGATIVE_MARGIN,
        }}
      >
        {measuredWidth !== undefined && svgContent}
      </div>
    );
  }

  return (
    <div
      data-testid='chart-container'
      style={{
        width: resolvedWidth,
        height,
        ...OVERFLOW_NEGATIVE_MARGIN,
      }}
    >
      {svgContent}
    </div>
  );
}

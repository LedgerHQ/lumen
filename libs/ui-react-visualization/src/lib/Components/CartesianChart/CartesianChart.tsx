import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { CartesianChartProvider, useBuildChartContext } from './context';
import type { CartesianChartProps } from './types';
import {
  DEFAULT_HEIGHT,
  OVERFLOW_NEGATIVE_MARGIN,
  resolveAxisPadding,
  resolveInset,
} from './utils';

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

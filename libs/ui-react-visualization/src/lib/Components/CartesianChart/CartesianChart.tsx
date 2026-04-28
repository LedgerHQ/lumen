import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChartInset } from '../../utils/types';

import { CartesianChartProvider, useBuildChartContext } from './context';
import type { CartesianChartProps } from './types';

const DEFAULT_HEIGHT = 160;
const DEFAULT_INSET: ChartInset = {
  top: 30,
  right: 20,
  bottom: 30,
  left: 20,
};
const ZERO_PADDING: ChartInset = { top: 0, right: 0, bottom: 0, left: 0 };

const resolveInset = (inset: CartesianChartProps['inset']): ChartInset => {
  if (inset === undefined) return DEFAULT_INSET;
  if (typeof inset === 'number') {
    return {
      top: inset + DEFAULT_INSET.top,
      right: inset + DEFAULT_INSET.right,
      bottom: inset + DEFAULT_INSET.bottom,
      left: inset + DEFAULT_INSET.left,
    };
  }
  return {
    top: (inset.top ?? 0) + DEFAULT_INSET.top,
    right: (inset.right ?? 0) + DEFAULT_INSET.right,
    bottom: (inset.bottom ?? 0) + DEFAULT_INSET.bottom,
    left: (inset.left ?? 0) + DEFAULT_INSET.left,
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
          margin: `${-DEFAULT_INSET.top}px ${-DEFAULT_INSET.right}px`,
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
        margin: `${-DEFAULT_INSET.top}px ${-DEFAULT_INSET.right}px`,
      }}
    >
      {svgContent}
    </div>
  );
}

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { ScrubberProvider } from '../Scrubber/ScrubberProvider';
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
  enableScrubbing = false,
  onScrubberPositionChange,
  children,
}: CartesianChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
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
      ref={svgRef}
      data-testid='chart-svg'
      width={resolvedWidth}
      height={height}
      role='img'
      aria-label={ariaLabel || 'Chart'}
      tabIndex={enableScrubbing ? 0 : undefined}
      style={{
        display: 'block',
        overflow: 'visible',
        outline: enableScrubbing ? 'none' : undefined,
      }}
    >
      <CartesianChartProvider value={contextValue}>
        {enableScrubbing ? (
          <ScrubberProvider
            svgRef={svgRef}
            enableScrubbing={enableScrubbing}
            onScrubberPositionChange={onScrubberPositionChange}
          >
            {children}
          </ScrubberProvider>
        ) : (
          children
        )}
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

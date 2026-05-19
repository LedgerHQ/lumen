import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { ScrubberProvider } from '../Scrubber/ScrubberProvider';
import { CartesianChartProvider, useBuildChartContext } from './context';
import { RevealClipDefs } from './RevealClip';
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
  animate = true,
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

  return (
    <div
      ref={needsMeasurement ? containerRef : undefined}
      data-testid='chart-container'
      style={{
        width: needsMeasurement ? width : resolvedWidth,
        height,
        ...OVERFLOW_NEGATIVE_MARGIN,
      }}
    >
      {resolvedWidth > 0 && (
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
            <ScrubberProvider
              svgRef={svgRef}
              enableScrubbing={enableScrubbing}
              onScrubberPositionChange={onScrubberPositionChange}
            >
              <RevealClipDefs
                drawingArea={contextValue.drawingArea}
                series={series}
                animate={animate}
              >
                {children}
              </RevealClipDefs>
            </ScrubberProvider>
          </CartesianChartProvider>
        </svg>
      )}
    </div>
  );
}

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { MagneticPointsProvider } from '../Point/pointContext';
import { ScrubberProvider } from '../Scrubber/ScrubberProvider';
import { CartesianChartProvider, useBuildChartContext } from './context';
import { RevealClipDefs } from './RevealClip';
import type { CartesianChartProps } from './types';
import {
  DEFAULT_HEIGHT,
  OVERFLOW_BUFFER,
  OVERFLOW_OFFSET,
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
  ariaBusy = false,
  overlay: htmlOverlay,
  enableScrubbing = false,
  onScrubberPositionChange,
  animate = true,
  magnetRadius,
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

  const svgWidth =
    resolvedWidth > 0
      ? resolvedWidth + OVERFLOW_BUFFER.left + OVERFLOW_BUFFER.right
      : 0;
  const svgHeight = height + OVERFLOW_BUFFER.top + OVERFLOW_BUFFER.bottom;

  const resolvedInset = useMemo(() => resolveInset(inset), [inset]);
  const resolvedAxisPadding = useMemo(
    () => resolveAxisPadding(axisPadding),
    [axisPadding],
  );

  const contextValue = useBuildChartContext({
    series,
    xAxis,
    yAxis,
    width: svgWidth,
    height: svgHeight,
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
        overflow: 'visible',
        position: 'relative',
      }}
    >
      {resolvedWidth > 0 && (
        <>
          <svg
            ref={svgRef}
            data-testid='chart-svg'
            width={svgWidth}
            height={svgHeight}
            role='img'
            aria-label={ariaLabel || 'Chart'}
            aria-busy={ariaBusy || undefined}
            tabIndex={enableScrubbing ? 0 : undefined}
            style={{
              display: 'block',
              overflow: 'visible',
              outline: enableScrubbing ? 'none' : undefined,
              ...OVERFLOW_OFFSET,
            }}
          >
            <CartesianChartProvider value={contextValue}>
              <MagneticPointsProvider>
                <ScrubberProvider
                  svgRef={svgRef}
                  enableScrubbing={enableScrubbing}
                  onScrubberPositionChange={onScrubberPositionChange}
                  magnetRadius={magnetRadius}
                >
                  <RevealClipDefs
                    drawingArea={contextValue.drawingArea}
                    series={series}
                    animate={animate}
                  >
                    {children}
                  </RevealClipDefs>
                </ScrubberProvider>
              </MagneticPointsProvider>
            </CartesianChartProvider>
          </svg>
          {htmlOverlay}
        </>
      )}
    </div>
  );
}

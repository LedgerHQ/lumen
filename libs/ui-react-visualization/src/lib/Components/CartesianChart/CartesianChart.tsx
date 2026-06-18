import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { MagneticPointsProvider } from '../Point/pointContext';
import { ScrubberProvider } from '../Scrubber/ScrubberProvider';
import { CartesianChartProvider, useBuildChartContext } from './context';
import { RevealAnimationProvider } from './RevealAnimation';
import type { CartesianChartProps } from './types';
import { DEFAULT_HEIGHT, resolveAxisPadding, resolveInset } from './utils';

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
  const svgWidth = resolvedWidth > 0 ? resolvedWidth : 0;

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
            height={height}
            role='img'
            aria-label={ariaLabel || 'Chart'}
            aria-busy={ariaBusy || undefined}
            tabIndex={enableScrubbing ? 0 : undefined}
            style={{
              display: 'block',
              overflow: 'visible',
              position: 'relative',
              outline: enableScrubbing ? 'none' : undefined,
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
                  <RevealAnimationProvider
                    drawingArea={contextValue.drawingArea}
                    series={series}
                    animate={animate}
                  >
                    {children}
                  </RevealAnimationProvider>
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

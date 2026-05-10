import { cssVar } from '@ledgerhq/lumen-design-core';
import { useId, useMemo } from 'react';

import { useCartesianChartContext } from '../CartesianChart/context';
import { useScrubberContext } from './context';
import type { ScrubberProps } from './types';
import {
  BEACON_RADIUS,
  BEACON_STROKE_WIDTH,
  LABEL_OFFSET_Y,
  OVERLAY_LINE_INSET,
  OVERLAY_OFFSET,
  OVERLAY_OPACITY,
  LINE_GRADIENT_EDGE_OPACITY,
  resolvePixelX,
  resolvePixelY,
} from './utils';

/**
 * Renders the scrubber visuals: vertical reference line, future-data overlay
 * rect, per-series beacon dots, and an optional formatted label above the line.
 *
 * Must be used as a child of `LineChart` (or `CartesianChart`) with
 * `enableScrubbing` enabled. Renders nothing when no scrubber position is active.
 *
 * @example
 * ```tsx
 * <LineChart series={data} enableScrubbing>
 *   <Scrubber label={(i) => data[i].date} />
 * </LineChart>
 * ```
 */
export function Scrubber({
  label,
  hideLine = false,
  hideOverlay = false,
  showBeacons = false,
}: Readonly<ScrubberProps>) {
  const lineGradientId = useId();
  const { scrubberPosition } = useScrubberContext();
  const { getXScale, getYScale, drawingArea, series, seriesMap } =
    useCartesianChartContext();

  const pixelX = useMemo(() => {
    if (scrubberPosition === undefined) return undefined;
    return resolvePixelX(scrubberPosition, getXScale);
  }, [scrubberPosition, getXScale]);

  const beacons = useMemo(() => {
    if (scrubberPosition === undefined || !showBeacons) return [];
    return series
      .map((s) => {
        const seriesData = seriesMap.get(s.id)?.data;
        const pixelY = resolvePixelY(scrubberPosition, seriesData, getYScale);
        if (pixelY === undefined) return null;
        return { id: s.id, stroke: s.stroke, pixelY };
      })
      .filter(
        (b): b is { id: string; stroke: string; pixelY: number } => b !== null,
      );
  }, [scrubberPosition, showBeacons, series, seriesMap, getYScale]);

  const resolvedLabel = useMemo(() => {
    if (scrubberPosition === undefined || !label) return undefined;
    return label(scrubberPosition);
  }, [scrubberPosition, label]);

  if (scrubberPosition === undefined || pixelX === undefined) {
    return null;
  }

  const {
    x: drawX,
    y: drawY,
    width: drawWidth,
    height: drawHeight,
  } = drawingArea;

  const overlayX = pixelX + OVERLAY_LINE_INSET;
  const overlayY = drawY - OVERLAY_OFFSET;
  const overlayWidth = Math.max(
    0,
    drawX + drawWidth - pixelX - OVERLAY_LINE_INSET + OVERLAY_OFFSET,
  );
  const overlayHeight = drawHeight + OVERLAY_OFFSET * 2;

  return (
    <g data-testid='scrubber'>
      {!hideLine && (
        <>
          <defs>
            <linearGradient
              id={lineGradientId}
              gradientUnits='userSpaceOnUse'
              x1={pixelX}
              y1={drawY}
              x2={pixelX}
              y2={drawY + drawHeight}
            >
              <stop
                offset='0%'
                stopColor={cssVar('var(--border-base)')}
                stopOpacity={LINE_GRADIENT_EDGE_OPACITY}
              />
              <stop offset='20%' stopColor={cssVar('var(--border-base)')} />
              <stop offset='80%' stopColor={cssVar('var(--border-base)')} />
              <stop
                offset='100%'
                stopColor={cssVar('var(--border-base)')}
                stopOpacity={LINE_GRADIENT_EDGE_OPACITY}
              />
            </linearGradient>
          </defs>
          <line
            data-testid='scrubber-line'
            x1={pixelX}
            y1={drawY}
            x2={pixelX}
            y2={drawY + drawHeight}
            stroke={`url(#${lineGradientId})`}
            strokeWidth={cssVar('var(--stroke-1)')}
          />
        </>
      )}

      {!hideOverlay && (
        <rect
          data-testid='scrubber-overlay'
          x={overlayX}
          y={overlayY}
          width={overlayWidth}
          height={overlayHeight}
          fill={cssVar('var(--background-base)')}
          opacity={OVERLAY_OPACITY}
        />
      )}

      {resolvedLabel !== undefined && (
        <text
          data-testid='scrubber-label'
          x={pixelX}
          y={drawY - LABEL_OFFSET_Y}
          textAnchor='middle'
          style={{
            fill: cssVar('var(--text-base)'),
            fontSize: cssVar('var(--font-style-body-4-size)'),
            fontWeight: cssVar('var(--font-style-body-4-weight-medium)'),
            fontFamily: cssVar('var(--font-family-font)'),
          }}
        >
          {resolvedLabel}
        </text>
      )}

      {showBeacons &&
        beacons.map((beacon) => (
          <circle
            key={beacon.id}
            data-testid={`scrubber-beacon-${beacon.id}`}
            cx={pixelX}
            cy={beacon.pixelY}
            r={BEACON_RADIUS}
            fill={beacon.stroke}
            stroke={cssVar('var(--background-canvas)')}
            strokeWidth={BEACON_STROKE_WIDTH}
          />
        ))}
    </g>
  );
}

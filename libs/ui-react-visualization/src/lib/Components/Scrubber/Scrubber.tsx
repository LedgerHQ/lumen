import { cssVar } from '@ledgerhq/lumen-design-core';
import { useId, useMemo } from 'react';

import { getPointOnScale, isNumericScale } from '../../utils/scales/scales';
import { useCartesianChartContext } from '../CartesianChart/context';
import { useScrubberContext } from './context';
import type { ScrubberProps } from './types';

const BEACON_RADIUS = 5;
const BEACON_STROKE_WIDTH = 2;
const LABEL_OFFSET_Y = 12;

/**
 * Resolves the pixel y-coordinate for a given series data point at a data index.
 * Returns undefined when the value is null/missing or the scale is unavailable.
 */
function resolvePixelY(
  dataIndex: number,
  seriesData: (number | null)[] | undefined,
  getYScale: ReturnType<typeof useCartesianChartContext>['getYScale'],
): number | undefined {
  const yScale = getYScale();
  if (!yScale || !isNumericScale(yScale)) return undefined;
  if (!seriesData) return undefined;

  const value = seriesData[dataIndex];
  if (value === null || value === undefined) return undefined;

  return yScale(value) as number;
}

/**
 * Resolves the pixel x-coordinate for a given data index using the x-scale.
 * Returns undefined when the scale is unavailable or the value cannot be mapped.
 */
function resolvePixelX(
  dataIndex: number,
  getXScale: ReturnType<typeof useCartesianChartContext>['getXScale'],
): number | undefined {
  const scale = getXScale();
  if (!scale) return undefined;
  return getPointOnScale(dataIndex, scale);
}

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
  hideBeacons = false,
}: ScrubberProps) {
  const lineGradientId = useId();
  const { scrubberPosition } = useScrubberContext();
  const { getXScale, getYScale, drawingArea, series, seriesMap } =
    useCartesianChartContext();

  const pixelX = useMemo(() => {
    if (scrubberPosition === undefined) return undefined;
    return resolvePixelX(scrubberPosition, getXScale);
  }, [scrubberPosition, getXScale]);

  const beacons = useMemo(() => {
    if (scrubberPosition === undefined || hideBeacons) return [];
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
  }, [scrubberPosition, hideBeacons, series, seriesMap, getYScale]);

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
                stopColor={cssVar('var(--border-muted)')}
                stopOpacity={0}
              />
              <stop offset='30%' stopColor={cssVar('var(--border-muted)')} />
              <stop offset='70%' stopColor={cssVar('var(--border-muted)')} />
              <stop
                offset='100%'
                stopColor={cssVar('var(--border-muted)')}
                stopOpacity={0}
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
            strokeWidth={1}
          />
        </>
      )}

      {!hideOverlay && (
        <rect
          data-testid='scrubber-overlay'
          x={pixelX}
          y={drawY - BEACON_RADIUS}
          width={Math.max(0, drawX + drawWidth - (pixelX - BEACON_RADIUS))}
          height={drawHeight + BEACON_RADIUS}
          fill={cssVar('var(--background-canvas)')}
          opacity={0.7}
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

      {!hideBeacons &&
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

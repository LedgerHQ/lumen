import { useId, useMemo } from 'react';

import { chartConfig } from '../../config';
import { useCartesianChartContext } from '../CartesianChart/context';

import { useScrubberContext } from './context';
import { DefaultScrubberTooltip } from './DefaultScrubberTooltip/DefaultScrubberTooltip';
import type { ScrubberProps } from './types';
import { resolvePixelX, resolvePixelY } from './utils';

const { color, strokeWidth, scrubber } = chartConfig;

/**
 * Renders the scrubber visuals: vertical reference line, future-data overlay
 * rect, per-series beacon dots, optional label above the line, and an optional
 * tooltip when {@link ScrubberProps.tooltip} is set, using {@link DefaultScrubberTooltip}.
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
 *
 * @example Tooltip
 * ```tsx
 * <Scrubber
 *   tooltip={(i) => ({
 *     title: `${counts[i]} Transactions`,
 *     items: [{ label: 'Index', value: String(i) }],
 *     minWidth: 160,
 *   })}
 * />
 * ```
 */
export function Scrubber({
  hideLine = false,
  hideOverlay = false,
  showBeacons = false,
  tooltip,
}: Readonly<ScrubberProps>) {
  const lineGradientId = useId();
  const { scrubberPosition } = useScrubberContext();
  const {
    getXScale,
    getXAxisConfig,
    getYScale,
    drawingArea,
    series,
    seriesMap,
  } = useCartesianChartContext();

  const pixelX = useMemo(() => {
    if (scrubberPosition === undefined) return undefined;
    return resolvePixelX(scrubberPosition, getXScale, getXAxisConfig());
  }, [scrubberPosition, getXScale, getXAxisConfig]);

  const beacons = useMemo(() => {
    if (scrubberPosition === undefined || !showBeacons) return [];
    return series
      .map((s) => {
        const seriesData = seriesMap.get(s.id)?.data;
        const pixelY = resolvePixelY(scrubberPosition, seriesData, getYScale);
        if (pixelY === undefined) return null;
        return {
          id: s.id,
          stroke: s.stroke || color.stroke,
          pixelY,
        };
      })
      .filter(
        (b): b is { id: string; stroke: string; pixelY: number } => b !== null,
      );
  }, [scrubberPosition, showBeacons, series, seriesMap, getYScale]);

  const tooltipPayload = useMemo(() => {
    if (scrubberPosition === undefined || !tooltip) {
      return undefined;
    }

    const content = tooltip(scrubberPosition);

    if (content.items.length === 0) return undefined;

    const resolvedTitle =
      typeof content.title === 'function'
        ? content.title(scrubberPosition)
        : content.title;

    return {
      items: content.items,
      resolvedTitle,
      offset: content.offset,
      minWidth: content.minWidth,
    };
  }, [scrubberPosition, tooltip]);

  if (scrubberPosition === undefined || pixelX === undefined) {
    return null;
  }

  const {
    x: drawX,
    y: drawY,
    width: drawWidth,
    height: drawHeight,
  } = drawingArea;

  const overlayX = pixelX + scrubber.overlayLineInset;
  const overlayY = drawY - scrubber.overlayOffset;
  const overlayWidth = Math.max(
    0,
    drawX +
      drawWidth -
      pixelX -
      scrubber.overlayLineInset +
      scrubber.overlayOffset,
  );
  const overlayHeight = drawHeight + scrubber.overlayOffset * 2;

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
                stopColor={scrubber.lineColor}
                stopOpacity={scrubber.lineGradientEdgeOpacity}
              />
              <stop offset='20%' stopColor={scrubber.lineColor} />
              <stop offset='80%' stopColor={scrubber.lineColor} />
              <stop
                offset='100%'
                stopColor={scrubber.lineColor}
                stopOpacity={scrubber.lineGradientEdgeOpacity}
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
            strokeWidth={strokeWidth.hairline}
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
          fill={scrubber.overlayColor}
          opacity={scrubber.overlayOpacity}
        />
      )}

      {showBeacons &&
        beacons.map((beacon) => (
          <circle
            key={beacon.id}
            data-testid={`scrubber-beacon-${beacon.id}`}
            cx={pixelX}
            cy={beacon.pixelY}
            r={scrubber.beaconRadius}
            fill={beacon.stroke}
            stroke={color.markOutline}
            strokeWidth={scrubber.beaconStrokeWidth}
          />
        ))}
      {tooltipPayload !== undefined && (
        <DefaultScrubberTooltip
          pixelX={pixelX}
          drawingArea={drawingArea}
          title={tooltipPayload.resolvedTitle}
          items={tooltipPayload.items}
          offset={tooltipPayload.offset}
          minWidth={tooltipPayload.minWidth}
        />
      )}
    </g>
  );
}

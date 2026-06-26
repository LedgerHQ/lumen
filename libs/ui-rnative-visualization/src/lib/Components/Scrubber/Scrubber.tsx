import { useTheme } from '@ledgerhq/lumen-ui-rnative';
import { useId, useMemo } from 'react';
import {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Rect,
  Stop,
} from 'react-native-svg';

import { useCartesianChartContext } from '../CartesianChart/context';
import {
  BEACON_RADIUS,
  BEACON_STROKE_WIDTH,
  LINE_GRADIENT_EDGE_OPACITY,
  OVERLAY_LINE_INSET,
  OVERLAY_OFFSET,
  OVERLAY_OPACITY,
} from './constants';
import { useScrubberContext } from './context';
import { DefaultScrubberTooltip } from './DefaultScrubberTooltip/DefaultScrubberTooltip';
import type { ScrubberProps } from './types';
import { resolvePixelX, resolvePixelY } from './utils';

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
  const { theme } = useTheme();
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
          stroke: s.stroke ?? theme.colors.border.muted,
          pixelY,
        };
      })
      .filter(
        (b): b is { id: string; stroke: string; pixelY: number } => b !== null,
      );
  }, [
    scrubberPosition,
    showBeacons,
    series,
    seriesMap,
    getYScale,
    theme.colors.border.muted,
  ]);

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

  const overlayX = pixelX + OVERLAY_LINE_INSET;
  const overlayY = drawY - OVERLAY_OFFSET;
  const overlayWidth = Math.max(
    0,
    drawX + drawWidth - pixelX - OVERLAY_LINE_INSET + OVERLAY_OFFSET,
  );
  const overlayHeight = drawHeight + OVERLAY_OFFSET * 2;

  const borderMutedColor = theme.colors.border.base;
  const backgroundBaseColor = theme.colors.bg.base;
  const bgCanvasColor = theme.colors.bg.canvas;

  return (
    <G testID='scrubber'>
      {!hideLine && (
        <>
          <Defs>
            <LinearGradient
              id={lineGradientId}
              gradientUnits='userSpaceOnUse'
              x1={pixelX}
              y1={drawY}
              x2={pixelX}
              y2={drawY + drawHeight}
            >
              <Stop
                offset='0%'
                stopColor={borderMutedColor}
                stopOpacity={LINE_GRADIENT_EDGE_OPACITY}
              />
              <Stop offset='20%' stopColor={borderMutedColor} stopOpacity={1} />
              <Stop offset='80%' stopColor={borderMutedColor} stopOpacity={1} />
              <Stop
                offset='100%'
                stopColor={borderMutedColor}
                stopOpacity={LINE_GRADIENT_EDGE_OPACITY}
              />
            </LinearGradient>
          </Defs>
          <Line
            testID='scrubber-line'
            x1={pixelX}
            y1={drawY}
            x2={pixelX}
            y2={drawY + drawHeight}
            stroke={`url(#${lineGradientId})`}
            strokeWidth={OVERLAY_LINE_INSET}
          />
        </>
      )}

      {!hideOverlay && (
        <Rect
          testID='scrubber-overlay'
          x={overlayX}
          y={overlayY}
          width={overlayWidth}
          height={overlayHeight}
          fill={backgroundBaseColor}
          opacity={OVERLAY_OPACITY}
        />
      )}

      {showBeacons &&
        beacons.map((beacon) => (
          <Circle
            key={beacon.id}
            testID={`scrubber-beacon-${beacon.id}`}
            cx={pixelX}
            cy={beacon.pixelY}
            r={BEACON_RADIUS}
            fill={beacon.stroke}
            stroke={bgCanvasColor}
            strokeWidth={BEACON_STROKE_WIDTH}
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
    </G>
  );
}

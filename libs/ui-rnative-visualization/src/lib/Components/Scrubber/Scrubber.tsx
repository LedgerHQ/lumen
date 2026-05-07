import { useTheme } from '@ledgerhq/lumen-ui-rnative';
import { useMemo } from 'react';
import {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

import { useCartesianChartContext } from '../CartesianChart/context';
import { useScrubberContext } from './context';
import type { ScrubberProps } from './types';
import {
  BEACON_RADIUS,
  BEACON_STROKE_WIDTH,
  LABEL_OFFSET_Y,
  OVERLAY_OFFSET,
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
  const { theme } = useTheme();
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

  const lineGradientId = `scrubber-line-gradient-${scrubberPosition}`;
  const borderMutedColor = theme.colors.border.base;
  const backgroundBaseColor = theme.colors.bg.base;
  const textBaseColor = theme.colors.text.base;
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
                stopOpacity={0.1}
              />
              <Stop offset='20%' stopColor={borderMutedColor} stopOpacity={1} />
              <Stop offset='80%' stopColor={borderMutedColor} stopOpacity={1} />
              <Stop
                offset='100%'
                stopColor={borderMutedColor}
                stopOpacity={0.1}
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
            strokeWidth={0.5}
          />
        </>
      )}

      {!hideOverlay && (
        <Rect
          testID='scrubber-overlay'
          x={pixelX + 0.5}
          y={drawY - OVERLAY_OFFSET}
          width={Math.max(0, drawX + drawWidth - pixelX - 0.5 + OVERLAY_OFFSET)}
          height={drawHeight + OVERLAY_OFFSET * 2}
          fill={backgroundBaseColor}
          opacity={0.8}
        />
      )}

      {resolvedLabel !== undefined && (
        <SvgText
          testID='scrubber-label'
          x={pixelX}
          y={drawY - LABEL_OFFSET_Y}
          textAnchor='middle'
          fill={textBaseColor}
          fontSize={theme.typographies.body4.fontSize}
          fontWeight={theme.typographies.body4.fontWeight}
          fontFamily={theme.fontFamilies.sans}
        >
          {resolvedLabel}
        </SvgText>
      )}

      {beacons.map((beacon) => (
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
    </G>
  );
}

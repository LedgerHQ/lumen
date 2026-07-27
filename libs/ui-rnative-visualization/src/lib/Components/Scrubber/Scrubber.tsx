import { useId } from 'react';
import {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Rect,
  Stop,
} from 'react-native-svg';

import { chartConfig } from '../../config';
import { useChartTokens } from '../../theme';
import { DefaultScrubberTooltip } from './DefaultScrubberTooltip/DefaultScrubberTooltip';
import type { ScrubberProps } from './types';
import { useScrubberGeometry } from './useScrubberGeometry';

type ScrubberLineProps = {
  pixelX: number;
  top: number;
  bottom: number;
};

function ScrubberLine({ pixelX, top, bottom }: Readonly<ScrubberLineProps>) {
  const gradientId = useId();
  const tokens = useChartTokens();
  const lineColor = tokens.color.scrubberLine;

  return (
    <>
      <Defs>
        <LinearGradient
          id={gradientId}
          gradientUnits='userSpaceOnUse'
          x1={pixelX}
          y1={top}
          x2={pixelX}
          y2={bottom}
        >
          <Stop
            offset='0%'
            stopColor={lineColor}
            stopOpacity={chartConfig.scrubber.lineGradientEdgeOpacity}
          />
          <Stop offset='20%' stopColor={lineColor} stopOpacity={1} />
          <Stop offset='80%' stopColor={lineColor} stopOpacity={1} />
          <Stop
            offset='100%'
            stopColor={lineColor}
            stopOpacity={chartConfig.scrubber.lineGradientEdgeOpacity}
          />
        </LinearGradient>
      </Defs>
      <Line
        testID='scrubber-line'
        x1={pixelX}
        y1={top}
        x2={pixelX}
        y2={bottom}
        stroke={`url(#${gradientId})`}
        strokeWidth={chartConfig.scrubber.overlayLineInset}
      />
    </>
  );
}

/**
 * Renders the scrubber visuals: vertical reference line, future-data overlay
 * rect, per-series beacon dots, and an optional tooltip when
 * {@link ScrubberProps.tooltip} is set, using {@link DefaultScrubberTooltip}.
 *
 * Must be used as a child of `LineChart` (or `CartesianChart`) with
 * `enableScrubbing` enabled. Renders nothing when no scrubber position is active.
 *
 * @example
 * ```tsx
 * <LineChart series={data} enableScrubbing>
 *   <Scrubber showBeacons />
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
  const tokens = useChartTokens();
  const geometry = useScrubberGeometry({ showBeacons, tooltip });

  if (!geometry) {
    return null;
  }

  const { pixelX, drawingArea, beacons, overlay, tooltipPayload } = geometry;

  return (
    <G testID='scrubber'>
      {!hideLine && (
        <ScrubberLine
          pixelX={pixelX}
          top={drawingArea.y}
          bottom={drawingArea.y + drawingArea.height}
        />
      )}

      {!hideOverlay && (
        <Rect
          testID='scrubber-overlay'
          x={overlay.x}
          y={overlay.y}
          width={overlay.width}
          height={overlay.height}
          fill={tokens.color.scrubberOverlay}
          opacity={chartConfig.scrubber.overlayOpacity}
        />
      )}

      {showBeacons &&
        beacons.map((beacon) => (
          <Circle
            key={beacon.id}
            testID={`scrubber-beacon-${beacon.id}`}
            cx={pixelX}
            cy={beacon.pixelY}
            r={chartConfig.scrubber.beaconRadius}
            fill={beacon.stroke}
            stroke={tokens.color.markOutline}
            strokeWidth={tokens.stroke.line}
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

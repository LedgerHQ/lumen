import { useTheme } from '@ledgerhq/lumen-ui-rnative';
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

import {
  BEACON_RADIUS,
  BEACON_STROKE_WIDTH,
  LINE_GRADIENT_EDGE_OPACITY,
  OVERLAY_LINE_INSET,
  OVERLAY_OPACITY,
} from './constants';
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
  const { theme } = useTheme();
  const lineColor = theme.colors.border.base;

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
            stopOpacity={LINE_GRADIENT_EDGE_OPACITY}
          />
          <Stop offset='20%' stopColor={lineColor} stopOpacity={1} />
          <Stop offset='80%' stopColor={lineColor} stopOpacity={1} />
          <Stop
            offset='100%'
            stopColor={lineColor}
            stopOpacity={LINE_GRADIENT_EDGE_OPACITY}
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
        strokeWidth={OVERLAY_LINE_INSET}
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
  const { theme } = useTheme();
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
          fill={theme.colors.bg.base}
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
            stroke={theme.colors.bg.canvas}
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

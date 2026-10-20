import { useId } from 'react';

import { chartConfig } from '../config';

import { ScrubberBeaconLabels } from './BeaconLabel/BeaconLabel';
import { DefaultScrubberTooltip } from './DefaultScrubberTooltip/DefaultScrubberTooltip';
import type { ScrubberProps } from './types';
import { useScrubberGeometry } from './useScrubberGeometry';

const { color, strokeWidth, scrubber } = chartConfig;

type ScrubberLineProps = {
  pixelX: number;
  top: number;
  bottom: number;
};

function ScrubberLine({ pixelX, top, bottom }: Readonly<ScrubberLineProps>) {
  const gradientId = useId();

  return (
    <>
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits='userSpaceOnUse'
          x1={pixelX}
          y1={top}
          x2={pixelX}
          y2={bottom}
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
        y1={top}
        x2={pixelX}
        y2={bottom}
        stroke={`url(#${gradientId})`}
        strokeWidth={strokeWidth.hairline}
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
 * @example Beacon labels
 * ```tsx
 * <Scrubber showBeaconLabel />
 * <Scrubber
 *   showBeaconLabel
 *   beaconLabel={(ctx) => <BeaconLabel title={ctx.series.label ?? ctx.series.id} value={ctx.value} />}
 * />
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
  showBeaconLabel = false,
  beaconLabel,
  tooltip,
}: Readonly<ScrubberProps>) {
  const drawBeacons = showBeacons || showBeaconLabel;
  const geometry = useScrubberGeometry({ showBeacons: drawBeacons, tooltip });

  if (!geometry) {
    return null;
  }

  const { pixelX, drawingArea, beacons, overlay, tooltipPayload } = geometry;

  return (
    <g data-testid='scrubber'>
      {!hideLine && (
        <ScrubberLine
          pixelX={pixelX}
          top={drawingArea.y}
          bottom={drawingArea.y + drawingArea.height}
        />
      )}

      {!hideOverlay && (
        <rect
          data-testid='scrubber-overlay'
          x={overlay.x}
          y={overlay.y}
          width={overlay.width}
          height={overlay.height}
          fill={scrubber.overlayColor}
          opacity={scrubber.overlayOpacity}
        />
      )}

      {drawBeacons &&
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
      {showBeaconLabel && (
        <ScrubberBeaconLabels
          pixelX={pixelX}
          drawingArea={drawingArea}
          beacons={beacons}
          renderLabel={beaconLabel}
        />
      )}
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

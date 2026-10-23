import { Fragment, useId } from 'react';

import { usePointReveal } from '../CartesianChart/RevealAnimation';
import { chartConfig } from '../config';

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

type BeaconPulseProps = {
  cx: number;
  cy: number;
  fill: string;
};

function BeaconPulse({ cx, cy, fill }: Readonly<BeaconPulseProps>) {
  const animationName = `beacon-pulse-${useId().replaceAll(':', '')}`;

  return (
    <>
      <style>
        {`@keyframes ${animationName} { from { opacity: ${scrubber.beaconPulseOpacity}; transform: scale(1); } to { opacity: 0; transform: scale(${scrubber.beaconPulseScale}); } } ` +
          `@media (prefers-reduced-motion: reduce) { @keyframes ${animationName} { from, to { opacity: 0; } } }`}
      </style>
      <circle
        data-testid='scrubber-pulse'
        cx={cx}
        cy={cy}
        r={scrubber.beaconRadius}
        fill={fill}
        style={{
          transformBox: 'fill-box',
          transformOrigin: 'center',
          animation: `${animationName} ${scrubber.beaconPulseDurationInSeconds}s ${scrubber.beaconPulseEasing} infinite`,
        }}
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
  idlePulse = false,
  tooltip,
}: Readonly<ScrubberProps>) {
  const geometry = useScrubberGeometry({ showBeacons, tooltip });
  const revealStyle = usePointReveal();

  if (!geometry) {
    return null;
  }

  const { beacons, scrubbing } = geometry;

  return (
    <g data-testid='scrubber'>
      {scrubbing && !hideLine && (
        <ScrubberLine
          pixelX={scrubbing.pixelX}
          top={scrubbing.drawingArea.y}
          bottom={scrubbing.drawingArea.y + scrubbing.drawingArea.height}
        />
      )}

      {scrubbing && !hideOverlay && (
        <rect
          data-testid='scrubber-overlay'
          x={scrubbing.overlay.x}
          y={scrubbing.overlay.y}
          width={scrubbing.overlay.width}
          height={scrubbing.overlay.height}
          fill={scrubber.overlayColor}
          opacity={scrubber.overlayOpacity}
        />
      )}

      {beacons.length > 0 && (
        <g style={revealStyle}>
          {beacons.map((beacon) => (
            <Fragment key={beacon.id}>
              {!scrubbing && idlePulse && (
                <BeaconPulse
                  cx={beacon.pixelX}
                  cy={beacon.pixelY}
                  fill={beacon.stroke}
                />
              )}
              <circle
                data-testid={`scrubber-beacon-${beacon.id}`}
                cx={beacon.pixelX}
                cy={beacon.pixelY}
                r={scrubber.beaconRadius}
                fill={beacon.stroke}
                stroke={color.markOutline}
                strokeWidth={scrubber.beaconStrokeWidth}
              />
            </Fragment>
          ))}
        </g>
      )}
      {scrubbing?.tooltipPayload !== undefined && (
        <DefaultScrubberTooltip
          pixelX={scrubbing.pixelX}
          drawingArea={scrubbing.drawingArea}
          title={scrubbing.tooltipPayload.resolvedTitle}
          items={scrubbing.tooltipPayload.items}
          offset={scrubbing.tooltipPayload.offset}
          minWidth={scrubbing.tooltipPayload.minWidth}
        />
      )}
    </g>
  );
}

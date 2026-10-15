import { Fragment, useEffect, useId } from 'react';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedProps,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Rect,
  Stop,
} from 'react-native-svg';

import { chartConfig, useChartTokens } from '../config';
import { DefaultScrubberTooltip } from './DefaultScrubberTooltip/DefaultScrubberTooltip';
import type { ScrubberProps } from './types';
import { useScrubberGeometry } from './useScrubberGeometry';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

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
        strokeWidth={tokens.stroke.hairline}
      />
    </>
  );
}

function BeaconPulse({
  cx,
  cy,
  fill,
}: {
  cx: number;
  cy: number;
  fill: string;
}) {
  const progress = useSharedValue(0);
  const reducedMotion = useReducedMotion();
  const { beaconRadius, beaconPulseScale, beaconPulseDurationInMs } =
    chartConfig.scrubber;

  useEffect(() => {
    if (!reducedMotion) {
      progress.value = withRepeat(
        withTiming(1, {
          duration: beaconPulseDurationInMs,
          easing: Easing.out(Easing.ease),
        }),
        -1,
        false,
      );
    }
    return () => cancelAnimation(progress);
  }, [reducedMotion, beaconPulseDurationInMs, progress]);

  const animatedProps = useAnimatedProps(() => ({
    r: beaconRadius * (1 + (beaconPulseScale - 1) * progress.value),
    opacity: 0.4 * (1 - progress.value),
  }));

  if (reducedMotion) {
    return null;
  }

  return (
    <AnimatedCircle
      testID='scrubber-pulse'
      cx={cx}
      cy={cy}
      r={beaconRadius}
      fill={fill}
      animatedProps={animatedProps}
    />
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
  const tokens = useChartTokens();
  const geometry = useScrubberGeometry({ showBeacons, tooltip });

  if (!geometry) {
    return null;
  }

  const { beacons, scrubbing } = geometry;

  return (
    <G testID='scrubber'>
      {scrubbing && !hideLine && (
        <ScrubberLine
          pixelX={scrubbing.pixelX}
          top={scrubbing.drawingArea.y}
          bottom={scrubbing.drawingArea.y + scrubbing.drawingArea.height}
        />
      )}

      {scrubbing && !hideOverlay && (
        <Rect
          testID='scrubber-overlay'
          x={scrubbing.overlay.x}
          y={scrubbing.overlay.y}
          width={scrubbing.overlay.width}
          height={scrubbing.overlay.height}
          fill={tokens.color.scrubberOverlay}
          opacity={chartConfig.scrubber.overlayOpacity}
        />
      )}

      {beacons.map((beacon) => (
        <Fragment key={beacon.id}>
          {!scrubbing && idlePulse && (
            <BeaconPulse
              cx={beacon.pixelX}
              cy={beacon.pixelY}
              fill={beacon.stroke}
            />
          )}
          <Circle
            testID={`scrubber-beacon-${beacon.id}`}
            cx={beacon.pixelX}
            cy={beacon.pixelY}
            r={chartConfig.scrubber.beaconRadius}
            fill={beacon.stroke}
            stroke={tokens.color.markOutline}
            strokeWidth={tokens.stroke.line}
          />
        </Fragment>
      ))}

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
    </G>
  );
}

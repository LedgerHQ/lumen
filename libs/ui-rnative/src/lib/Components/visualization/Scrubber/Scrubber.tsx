import { Fragment, useEffect, useId } from 'react';
import Animated, {
  cancelAnimation,
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

import { useRevealFadeProps } from '../CartesianChart/RevealAnimation';
import { chartConfig, useChartTokens } from '../config';
import { ScrubberBeaconLabels } from './BeaconLabel/BeaconLabel';
import { DefaultScrubberTooltip } from './DefaultScrubberTooltip/DefaultScrubberTooltip';
import type { ScrubberProps } from './types';
import { useScrubberGeometry } from './useScrubberGeometry';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);

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

type BeaconPulseProps = {
  cx: number;
  cy: number;
  fill: string;
};

function BeaconPulse({ cx, cy, fill }: Readonly<BeaconPulseProps>) {
  const progress = useSharedValue(0);
  const reducedMotion = useReducedMotion();
  const {
    beaconRadius,
    beaconPulseScale,
    beaconPulseOpacity,
    beaconPulseDurationInMs,
    beaconPulseEasing,
  } = chartConfig.scrubber;

  useEffect(() => {
    if (!reducedMotion) {
      progress.value = withRepeat(
        withTiming(1, {
          duration: beaconPulseDurationInMs,
          easing: beaconPulseEasing,
        }),
        -1,
        false,
      );
    }
    return () => cancelAnimation(progress);
  }, [reducedMotion, beaconPulseDurationInMs, beaconPulseEasing, progress]);

  const animatedProps = useAnimatedProps(() => ({
    r: beaconRadius * (1 + (beaconPulseScale - 1) * progress.value),
    opacity: beaconPulseOpacity * (1 - progress.value),
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
 * rect, per-series beacon dots, optional beacon labels, and an optional tooltip
 * when {@link ScrubberProps.tooltip} is set, using {@link DefaultScrubberTooltip}.
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
 *   beaconLabel={({ series, value }) => <DefaultBeaconLabel label={`${series.label}: $${value}`} />}
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
  idlePulse = false,
  tooltip,
}: Readonly<ScrubberProps>) {
  const tokens = useChartTokens();
  const geometry = useScrubberGeometry({
    showBeacons: showBeacons || showBeaconLabel,
    tooltip,
  });
  const fadeProps = useRevealFadeProps();

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

      {beacons.length > 0 && (
        <AnimatedG animatedProps={fadeProps}>
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
        </AnimatedG>
      )}

      {scrubbing && showBeaconLabel && (
        <ScrubberBeaconLabels
          pixelX={scrubbing.pixelX}
          drawingArea={scrubbing.drawingArea}
          beacons={beacons}
          renderLabel={beaconLabel}
        />
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
    </G>
  );
}

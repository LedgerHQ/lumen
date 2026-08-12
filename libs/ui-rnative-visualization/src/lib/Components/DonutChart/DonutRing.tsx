import { useEffect, useMemo, useRef } from 'react';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { G, Path, Svg } from 'react-native-svg';

import {
  DONUT_INTERACTION,
  useChartTokens,
  type DonutGeometry,
} from '../../config';
import { getDonutViewBox } from './constants';
import {
  useDonutLoadingAnimation,
  useDonutLoadingSegmentProps,
} from './hooks/useDonutLoadingAnimation';
import { RevealAnimation } from './RevealAnimation';
import {
  buildPlaceholderSegments,
  type DonutPlaceholderSegment,
  type DonutRingSegment,
} from './utils';

const AnimatedPath = Animated.createAnimatedComponent(Path);

type RingSegmentProps = {
  segment: DonutRingSegment;
  defaultColor: string;
  activeId: string | null;
};

const RingSegment = ({ segment, defaultColor, activeId }: RingSegmentProps) => {
  const isActive = activeId === segment.id;
  const opacity = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    const targetOpacity =
      !segment.activeEnabled || activeId == null || isActive
        ? 1
        : DONUT_INTERACTION.dimOpacity;
    const { x, y } =
      isActive && segment.activeEnabled
        ? segment.activeTranslate
        : { x: 0, y: 0 };

    opacity.value = withTiming(targetOpacity, {
      duration: DONUT_INTERACTION.opacityDurationMs,
    });
    translateX.value = withTiming(x, {
      duration: DONUT_INTERACTION.popDurationMs,
      easing: DONUT_INTERACTION.popEasing,
    });
    translateY.value = withTiming(y, {
      duration: DONUT_INTERACTION.popDurationMs,
      easing: DONUT_INTERACTION.popEasing,
    });
  }, [
    activeId,
    isActive,
    opacity,
    segment.activeEnabled,
    segment.activeTranslate,
    translateX,
    translateY,
  ]);

  const animatedProps = useAnimatedProps(() => ({
    opacity: opacity.value,
    transform: `translate(${translateX.value}, ${translateY.value})`,
  }));

  return (
    <AnimatedPath
      testID='donut-segment'
      id={segment.id}
      d={segment.path}
      fill={segment.color ?? defaultColor}
      accessible
      accessibilityLabel={isActive ? `${segment.id}, selected` : segment.id}
      animatedProps={animatedProps}
    />
  );
};

const EmptyRing = ({
  geometry,
  color,
}: {
  geometry: DonutGeometry;
  color: string;
}) => {
  const segments = useMemo(
    () => buildPlaceholderSegments(geometry),
    [geometry],
  );

  return (
    <G testID='donut-empty'>
      {segments.map((segment) => (
        <Path
          key={segment.id}
          testID='donut-placeholder'
          d={segment.path}
          fill={color}
        />
      ))}
    </G>
  );
};

const LoadingSegment = ({
  segment,
  color,
  progress,
}: {
  segment: DonutPlaceholderSegment;
  color: string;
  progress: SharedValue<number>;
}) => {
  const animatedProps = useDonutLoadingSegmentProps(progress, segment.midAngle);

  return (
    <AnimatedPath
      testID='donut-placeholder'
      d={segment.path}
      fill={color}
      animatedProps={animatedProps}
    />
  );
};

const LoadingRing = ({
  geometry,
  color,
}: {
  geometry: DonutGeometry;
  color: string;
}) => {
  const segments = useMemo(
    () => buildPlaceholderSegments(geometry),
    [geometry],
  );
  const progress = useDonutLoadingAnimation();

  return (
    <G testID='donut-loading'>
      {segments.map((segment) => (
        <LoadingSegment
          key={segment.id}
          segment={segment}
          color={color}
          progress={progress}
        />
      ))}
    </G>
  );
};

function useRevealKey(loading: boolean): number {
  const keyRef = useRef(0);
  const prevRef = useRef(loading);
  if (prevRef.current && !loading) {
    keyRef.current += 1;
  }
  prevRef.current = loading;
  return keyRef.current;
}

type DonutRingProps = {
  segments: DonutRingSegment[];
  geometry: DonutGeometry;
  accessibilityLabel?: string;
  activeId: string | null;
  loading?: boolean;
};

export const DonutRing = ({
  segments,
  geometry,
  accessibilityLabel,
  activeId,
  loading = false,
}: DonutRingProps) => {
  const tokens = useChartTokens();
  const { box } = geometry;
  const center = box / 2;
  const hasSegments = segments.length > 0;
  const revealKey = useRevealKey(loading);

  return (
    <Svg
      testID='donut-ring'
      width={box}
      height={box}
      viewBox={getDonutViewBox(geometry)}
      accessibilityRole='image'
      accessibilityLabel={accessibilityLabel}
      accessibilityState={loading ? { busy: true } : undefined}
    >
      <RevealAnimation
        R={center}
        activeOffset={geometry.activeOffset}
        revealTrigger={revealKey}
      >
        {loading ? (
          <LoadingRing geometry={geometry} color={tokens.color.surface} />
        ) : hasSegments ? (
          segments.map((segment) => (
            <RingSegment
              key={segment.id}
              segment={segment}
              activeId={activeId}
              defaultColor={tokens.color.markFill}
            />
          ))
        ) : (
          <EmptyRing geometry={geometry} color={tokens.color.surface} />
        )}
      </RevealAnimation>
    </Svg>
  );
};

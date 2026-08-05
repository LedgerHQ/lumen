import { useEffect } from 'react';
import Animated, {
  useAnimatedProps,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ClipPath, Defs, G, Path, Svg } from 'react-native-svg';

import {
  chartConfig,
  DONUT_INTERACTION,
  useChartTokens,
  type DonutGeometry,
} from '../../config';
import { getDonutViewBox } from './constants';
import { buildEmptyRingPath, type DonutArc } from './utils';

const AnimatedPath = Animated.createAnimatedComponent(Path);

type RingSegmentProps = {
  segment: DonutArc;
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
}) => (
  <Path testID='donut-empty' d={buildEmptyRingPath(geometry)} fill={color} />
);

type DonutRingProps = {
  arcs: DonutArc[];
  geometry: DonutGeometry;
  accessibilityLabel?: string;
  activeId: string | null;
};

export const DonutRing = ({
  arcs,
  geometry,
  accessibilityLabel,
  activeId,
}: DonutRingProps) => {
  const tokens = useChartTokens();
  const { box } = geometry;
  const R = box / 2;
  const hasSegments = arcs.length > 0;

  const isReducedMotion = useReducedMotion();
  const revealProgress = useSharedValue(isReducedMotion ? 1 : 0);

  useEffect(() => {
    if (isReducedMotion) {
      return;
    }
    revealProgress.value = withTiming(1, {
      duration: chartConfig.donut.reveal.durationMs,
    });
  }, [isReducedMotion, revealProgress]);

  const clipPathProps = useAnimatedProps(() => {
    // full circle, don't clip anything
    if (revealProgress.value >= 1) {
      return { d: `M0,-${R} A${R},${R} 0 1 1 -0.001,-${R} Z` };
    }
    const angle = revealProgress.value * 2 * Math.PI; // convert 0-1 to radians (0-2pi)
    const x = R * Math.sin(angle);
    const y = -R * Math.cos(angle); // -R because of 12 o'clock

    // large-arc-flag, so SVG draws the outer arc instead of inner at >0.5 progress (>180 deg)
    const largeArc = revealProgress.value > 0.5 ? 1 : 0;
    return { d: `M0,0 L0,-${R} A${R},${R} 0 ${largeArc} 1 ${x},${y} Z` };
  });

  return (
    <Svg
      testID='donut-ring'
      width={box}
      height={box}
      viewBox={getDonutViewBox(geometry)}
      accessibilityRole='image'
      accessibilityLabel={accessibilityLabel}
    >
      <Defs>
        <ClipPath id='donut-reveal-clip'>
          <AnimatedPath animatedProps={clipPathProps} />
        </ClipPath>
      </Defs>
      <G transform={`translate(${R}, ${R})`} clipPath='url(#donut-reveal-clip)'>
        {hasSegments ? (
          arcs.map((segment) => (
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
      </G>
    </Svg>
  );
};

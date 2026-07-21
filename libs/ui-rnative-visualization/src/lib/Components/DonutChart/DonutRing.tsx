import { useTheme } from '@ledgerhq/lumen-ui-rnative';
import { useEffect } from 'react';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { G, Path, Svg } from 'react-native-svg';

import {
  DONUT_INTERACTION,
  getDonutViewBox,
  type DonutGeometry,
} from './constants';
import { buildEmptyRingPath, type DonutArc } from './utils';

const AnimatedPath = Animated.createAnimatedComponent(Path);

type RingSegmentProps = {
  segment: DonutArc;
  defaultColor: string;
  activeId: string | null;
  onSegmentPress: (id: string) => void;
};

const RingSegment = ({
  segment,
  defaultColor,
  activeId,
  onSegmentPress,
}: RingSegmentProps) => {
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
    <G onPress={() => onSegmentPress(segment.id)}>
      <AnimatedPath
        testID='donut-segment'
        id={segment.id}
        d={segment.path}
        fill={segment.color ?? defaultColor}
        accessible
        accessibilityLabel={isActive ? `${segment.id}, selected` : segment.id}
        animatedProps={animatedProps}
      />
    </G>
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
  onSegmentPress: (id: string) => void;
};

// Internal, not exported. Arc paths are origin-centered, so the group is translated to the viewBox center.
export const DonutRing = ({
  arcs,
  geometry,
  accessibilityLabel,
  activeId,
  onSegmentPress,
}: DonutRingProps) => {
  const { theme } = useTheme();
  const { box } = geometry;
  const center = box / 2;
  const hasSegments = arcs.length > 0;

  return (
    <Svg
      testID='donut-ring'
      width={box}
      height={box}
      viewBox={getDonutViewBox(geometry)}
      accessibilityRole='image'
      accessibilityLabel={accessibilityLabel}
    >
      <G transform={`translate(${center}, ${center})`}>
        {hasSegments ? (
          arcs.map((segment) => (
            <RingSegment
              key={segment.id}
              segment={segment}
              defaultColor={theme.colors.bg.mutedStrong}
              activeId={activeId}
              onSegmentPress={onSegmentPress}
            />
          ))
        ) : (
          <EmptyRing geometry={geometry} color={theme.colors.bg.muted} />
        )}
      </G>
    </Svg>
  );
};

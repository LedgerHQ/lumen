import { useEffect, useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { DONUT_CENTER } from './constants';
import type { DonutActiveSegment } from './types';

type DonutChartAnimatedCenterProps = {
  activeSegment: DonutActiveSegment | null;
  contentWidth: number;
  renderResting: () => ReactNode;
  renderActive: (segment: DonutActiveSegment) => ReactNode;
};

export const DonutChartAnimatedCenter = ({
  activeSegment,
  contentWidth,
  renderResting,
  renderActive,
}: DonutChartAnimatedCenterProps) => {
  const { progress, isActive, shown, hasEverActivated } =
    useCenterTransition(activeSegment);
  const { restingStyle, activeStyle } = useCenterTransitionStyles(progress);

  return (
    <View style={[styles.container, { width: contentWidth }]}>
      <Animated.View
        accessibilityElementsHidden={isActive}
        importantForAccessibility={isActive ? 'no-hide-descendants' : 'auto'}
        pointerEvents={isActive ? 'none' : 'auto'}
        style={[
          hasEverActivated ? styles.overlay : styles.primary,
          restingStyle,
        ]}
      >
        {renderResting()}
      </Animated.View>
      {shown && (
        <Animated.View
          accessibilityElementsHidden={!isActive}
          importantForAccessibility={isActive ? 'auto' : 'no-hide-descendants'}
          pointerEvents={isActive ? 'auto' : 'none'}
          style={[styles.primary, activeStyle]}
        >
          {renderActive(shown)}
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/**
 * Handles the transition of the center content when the active segment changes.
 */
const useCenterTransition = (activeSegment: DonutActiveSegment | null) => {
  const [lastActiveSegment, setLastActiveSegment] =
    useState<DonutActiveSegment | null>(null);

  const progress = useSharedValue(activeSegment === null ? 0 : 1);

  useEffect(() => {
    if (activeSegment) {
      setLastActiveSegment(activeSegment);
    }
    progress.value = withTiming(activeSegment === null ? 0 : 1, {
      duration: DONUT_CENTER.transitionDurationMs,
    });
  }, [activeSegment, progress]);

  const shown = activeSegment ?? lastActiveSegment;

  return {
    progress,
    isActive: activeSegment != null,
    shown,
    hasEverActivated: shown != null,
  };
};

/**
 * Handles the styles of the center content when the active segment changes.
 */
const useCenterTransitionStyles = (progress: SharedValue<number>) => {
  const restingStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [
      { translateY: -progress.value * DONUT_CENTER.transitionSlideDistance },
    ],
  }));

  const activeStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      {
        translateY: (1 - progress.value) * DONUT_CENTER.transitionSlideDistance,
      },
    ],
  }));

  return { restingStyle, activeStyle };
};

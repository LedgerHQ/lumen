import { useEffect, useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { DONUT_CENTER } from './constants';
import type { DonutSegment } from './types';

type ActiveSegment = DonutSegment & { percent: number };

type DonutChartAnimatedCenterProps = {
  activeSegment: ActiveSegment | null;
  contentWidth: number;
  renderResting: () => ReactNode;
  renderActive: (segment: ActiveSegment) => ReactNode;
};

const { transitionDurationMs, transitionSlideDistance } = DONUT_CENTER;

export const DonutChartAnimatedCenter = ({
  activeSegment,
  contentWidth,
  renderResting,
  renderActive,
}: DonutChartAnimatedCenterProps) => {
  const [lastActiveSegment, setLastActiveSegment] =
    useState<ActiveSegment | null>(null);

  const progress = useSharedValue(activeSegment === null ? 0 : 1);

  useEffect(() => {
    if (activeSegment) {
      setLastActiveSegment(activeSegment);
    }
    progress.value = withTiming(activeSegment === null ? 0 : 1, {
      duration: transitionDurationMs,
    });
  }, [activeSegment, progress]);

  const isActive = activeSegment != null;
  const shown = activeSegment ?? lastActiveSegment;
  const sizeContent = shown ? renderActive(shown) : renderResting();

  const restingStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [{ translateY: -progress.value * transitionSlideDistance }],
  }));

  const activeStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * transitionSlideDistance }],
  }));

  return (
    <View style={[styles.container, { width: contentWidth }]}>
      <View
        style={styles.sizeAnchor}
        pointerEvents='none'
        importantForAccessibility='no-hide-descendants'
        accessibilityElementsHidden
      >
        {sizeContent}
      </View>
      <Animated.View
        accessibilityElementsHidden={isActive}
        importantForAccessibility={isActive ? 'no-hide-descendants' : 'auto'}
        pointerEvents={isActive ? 'none' : 'auto'}
        style={[styles.overlay, restingStyle]}
      >
        {renderResting()}
      </Animated.View>
      {shown && (
        <Animated.View
          accessibilityElementsHidden={!isActive}
          importantForAccessibility={isActive ? 'auto' : 'no-hide-descendants'}
          pointerEvents={isActive ? 'auto' : 'none'}
          style={[styles.overlay, activeStyle]}
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
  sizeAnchor: {
    opacity: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

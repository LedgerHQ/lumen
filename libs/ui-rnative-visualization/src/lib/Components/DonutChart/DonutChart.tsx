import { useControllableState } from '@ledgerhq/lumen-ui-rnative';
import { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { DONUT_GEOMETRY, toRingLocalPoint } from './constants';
import { DonutRing } from './DonutRing';
import type { DonutChartProps } from './types';
import { buildArcs, findSegmentIdAtPoint } from './utils';

export function DonutChart({
  series,
  size = 'md',
  accessibilityLabel = 'Donut chart',
  activeId: activeIdProp,
  defaultActiveId = null,
  onActiveIdChange,
}: Readonly<DonutChartProps>) {
  const geometry = DONUT_GEOMETRY[size];

  const [activeId, setActiveId] = useControllableState({
    prop: activeIdProp,
    defaultProp: defaultActiveId,
    onChange: onActiveIdChange,
  });

  const arcs = useMemo(() => buildArcs(series, geometry), [series, geometry]);

  const handleSegmentPress = useCallback(
    (id: string) => {
      setActiveId((current) => (current === id ? null : id));
    },
    [setActiveId],
  );

  // Resolves a tap to a segment via geometry instead of a per-segment onPress,
  // since touch handlers on SVG/Reanimated nodes are unreliable on Android
  // (react-native-svg#1321, reanimated#2995).
  const handleTap = useCallback(
    (point: { x: number; y: number }) => {
      const localPoint = toRingLocalPoint(point, geometry);
      const hitId = findSegmentIdAtPoint(arcs, localPoint, geometry);
      if (hitId) {
        handleSegmentPress(hitId);
      }
    },
    [arcs, geometry, handleSegmentPress],
  );

  const tap = useMemo(
    () =>
      Gesture.Tap().onEnd((e, success) => {
        'worklet';
        if (success) {
          scheduleOnRN(handleTap, { x: e.x, y: e.y });
        }
      }),
    [handleTap],
  );

  return (
    <View
      testID='donut-chart'
      style={{ width: geometry.box, height: geometry.box }}
    >
      <DonutRing
        arcs={arcs}
        geometry={geometry}
        accessibilityLabel={accessibilityLabel}
        activeId={activeId}
      />
      <GestureDetector gesture={tap}>
        <Animated.View
          testID='donut-gesture-overlay'
          style={StyleSheet.absoluteFill}
        />
      </GestureDetector>
    </View>
  );
}

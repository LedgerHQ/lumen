import { useControllableState } from '@ledgerhq/lumen-ui-rnative';
import { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';

import { DONUT_GEOMETRY, toRingLocalPoint } from './constants';
import { DonutChartAnimatedCenter } from './DonutChartAnimatedCenter';
import { DonutRing } from './DonutRing';
import { DonutSizeProvider } from './donutSizeContext';
import type { DonutChartProps } from './types';
import {
  buildArcs,
  findSegmentIdAtPoint,
  getCenterMaxWidth,
  getSegmentPercents,
} from './utils';

export function DonutChart({
  series,
  size = 'md',
  accessibilityLabel = 'Donut chart',
  activeId: activeIdProp,
  defaultActiveId = null,
  onActiveIdChange,
  renderCenter,
  renderCenterActive,
}: Readonly<DonutChartProps>) {
  const geometry = DONUT_GEOMETRY[size];

  const [activeId, setActiveId] = useControllableState({
    prop: activeIdProp,
    defaultProp: defaultActiveId,
    onChange: onActiveIdChange,
  });

  const arcs = useMemo(() => buildArcs(series, geometry), [series, geometry]);

  const activeSegment = useMemo(() => {
    const index = series.findIndex((segment) => segment.id === activeId);
    if (activeId == null || index === -1) {
      return null;
    }
    return { ...series[index], percent: getSegmentPercents(series)[index] };
  }, [series, activeId]);

  const handleSegmentPress = useCallback(
    (id: string) => {
      setActiveId((prev) => (prev === id ? null : id));
    },
    [setActiveId],
  );

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

  const hasCenter = renderCenter != null || renderCenterActive != null;
  const useAnimatedCenter = renderCenterActive != null;

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
        <View testID='donut-gesture-overlay' style={StyleSheet.absoluteFill} />
      </GestureDetector>
      {hasCenter && (
        <View
          testID='donut-center'
          pointerEvents='box-none'
          style={[
            StyleSheet.absoluteFill,
            { alignItems: 'center', justifyContent: 'center' },
          ]}
        >
          <DonutSizeProvider value={{ size }}>
            {useAnimatedCenter ? (
              <DonutChartAnimatedCenter
                activeSegment={activeSegment}
                contentWidth={getCenterMaxWidth(geometry)}
                renderResting={() =>
                  renderCenter?.({ series, activeSegment: null }) ?? null
                }
                renderActive={(segment) =>
                  renderCenterActive({ activeSegment: segment })
                }
              />
            ) : (
              renderCenter?.({ activeSegment, series })
            )}
          </DonutSizeProvider>
        </View>
      )}
    </View>
  );
}

import { useControllableState } from '@ledgerhq/lumen-ui-rnative';
import { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';
import { chartConfig, DONUT_GEOMETRY } from '../../config';
import { toRingLocalPoint } from './constants';
import { DonutChartAnimatedCenter } from './DonutChartAnimatedCenter';
import { DonutRing } from './DonutRing';
import { DonutSizeProvider } from './donutSizeContext';
import type { DonutChartProps } from './types';
import {
  buildRingSegments,
  findSegmentIdAtPoint,
  formatPercentLabel,
  getCenterMaxWidth,
  getSegmentPercents,
} from './utils';

export function DonutChart({
  series,
  size = 'md',
  accessibilityLabel = 'Donut chart',
  loading = false,
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

  const segments = useMemo(
    () => buildRingSegments(series, geometry),
    [series, geometry],
  );

  const activeSegment = useMemo(() => {
    const index = series.findIndex((segment) => segment.id === activeId);
    if (activeId == null || index === -1) {
      return null;
    }
    const percent = getSegmentPercents(series)[index];
    return {
      ...series[index],
      percent,
      percentLabel: formatPercentLabel(percent),
    };
  }, [series, activeId]);

  const handleSegmentPress = useCallback(
    (id: string) => {
      setActiveId((prev) => (prev === id ? null : id));
    },
    [setActiveId],
  );

  const handleTap = useCallback(
    (point: { x: number; y: number }) => {
      if (loading) {
        return;
      }
      const localPoint = toRingLocalPoint(point, geometry);
      const hitId = findSegmentIdAtPoint(segments, localPoint, geometry);
      if (hitId) {
        handleSegmentPress(hitId);
      }
    },
    [segments, geometry, handleSegmentPress, loading],
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

  const renderRestingCenter = useCallback(
    () => renderCenter?.({ series, activeSegment: null }) ?? null,
    [renderCenter, series],
  );

  const renderActiveCenter = useCallback(
    (segment: NonNullable<typeof activeSegment>) =>
      renderCenterActive?.({ activeSegment: segment }) ?? null,
    [renderCenterActive],
  );

  return (
    <View
      testID='donut-chart'
      style={{ width: geometry.box, height: geometry.box }}
    >
      <DonutRing
        segments={segments}
        geometry={geometry}
        accessibilityLabel={
          loading ? chartConfig.donut.loading.ariaLabel : accessibilityLabel
        }
        activeId={activeId}
        loading={loading}
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
                renderResting={renderRestingCenter}
                renderActive={renderActiveCenter}
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

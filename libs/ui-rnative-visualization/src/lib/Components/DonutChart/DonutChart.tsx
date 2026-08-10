import { getContrastSafeColor } from '@ledgerhq/lumen-design-core';
import { useControllableState, useTheme } from '@ledgerhq/lumen-ui-rnative';
import { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';
import { DONUT_GEOMETRY } from '../../config';
import { toRingLocalPoint } from './constants';
import { DonutChartAnimatedCenter } from './DonutChartAnimatedCenter';
import { DonutRing } from './DonutRing';
import { DonutSizeProvider } from './donutSizeContext';
import type { DonutChartProps } from './types';
import {
  buildArcs,
  findSegmentIdAtPoint,
  formatPercentLabel,
  getCenterMaxWidth,
  getSegmentPercents,
} from './utils';

export function DonutChart({
  series: seriesProp,
  size = 'md',
  accessibilityLabel = 'Donut chart',
  activeId: activeIdProp,
  defaultActiveId = null,
  onActiveIdChange,
  renderCenter,
  renderCenterActive,
  ensureColorContrast = false,
}: Readonly<DonutChartProps>) {
  const geometry = DONUT_GEOMETRY[size];
  const { theme } = useTheme();

  const [activeId, setActiveId] = useControllableState({
    prop: activeIdProp,
    defaultProp: defaultActiveId,
    onChange: onActiveIdChange,
  });

  const series = useMemo(
    () =>
      seriesProp.map((s) => ({
        ...s,
        ...(s.color &&
          ensureColorContrast && {
            color: getContrastSafeColor(s.color, theme.colors.bg.surface),
          }),
      })),
    [seriesProp, ensureColorContrast, theme.colors.bg.surface],
  );

  const arcs = useMemo(() => buildArcs(series, geometry), [series, geometry]);

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

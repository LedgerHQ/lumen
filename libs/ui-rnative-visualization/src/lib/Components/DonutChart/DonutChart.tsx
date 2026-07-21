import { useCallback, useMemo } from 'react';
import { View } from 'react-native';

import { useControllableState } from '../../utils/useControllableState';
import { DONUT_GEOMETRY } from './constants';
import { DonutRing } from './DonutRing';
import type { DonutChartProps } from './types';
import { buildArcs } from './utils';

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
        onSegmentPress={handleSegmentPress}
      />
    </View>
  );
}

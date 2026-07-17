import { useMemo } from 'react';
import { View } from 'react-native';

import { DONUT_GEOMETRY } from './constants';
import { DonutRing } from './DonutRing';
import type { DonutChartProps } from './types';
import { buildArcs } from './utils';

/** A ring of part-to-whole segments. */
export function DonutChart({
  series,
  size = 'md',
  ariaLabel = 'Donut chart',
}: Readonly<DonutChartProps>) {
  const geometry = DONUT_GEOMETRY[size];

  const arcs = useMemo(() => buildArcs(series, geometry), [series, geometry]);

  return (
    <View
      testID='donut-chart'
      style={{ width: geometry.box, height: geometry.box }}
    >
      <DonutRing arcs={arcs} geometry={geometry} ariaLabel={ariaLabel} />
    </View>
  );
}

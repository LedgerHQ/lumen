import { useMemo } from 'react';

import { DonutRing } from './DonutRing';
import type { DonutChartProps } from './types';
import { buildArcs, DONUT_GEOMETRY } from './utils';

/** A ring of part-to-whole segments. */
export function DonutChart({
  series,
  size = 'md',
  ariaLabel = 'Donut chart',
}: Readonly<DonutChartProps>) {
  const geometry = DONUT_GEOMETRY[size];

  const arcs = useMemo(() => buildArcs(series, geometry), [series, geometry]);

  return (
    <div
      data-testid='donut-chart'
      style={{
        position: 'relative',
        width: geometry.box,
        height: geometry.box,
      }}
    >
      <DonutRing arcs={arcs} geometry={geometry} ariaLabel={ariaLabel} />
    </div>
  );
}

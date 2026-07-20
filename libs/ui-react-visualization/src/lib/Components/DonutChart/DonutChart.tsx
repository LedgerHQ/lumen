import { useMemo } from 'react';

import { useControllableState } from '../../utils/useControllableState';
import { DonutRing } from './DonutRing';
import type { DonutChartProps } from './types';
import { buildArcs, DONUT_GEOMETRY } from './utils';

export function DonutChart({
  series,
  size = 'md',
  ariaLabel = 'Donut chart',
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

  return (
    <div
      role='presentation'
      data-testid='donut-chart'
      style={{
        position: 'relative',
        width: geometry.box,
        height: geometry.box,
      }}
      onMouseLeave={() => setActiveId(null)}
    >
      <DonutRing
        arcs={arcs}
        geometry={geometry}
        ariaLabel={ariaLabel}
        activeId={activeId}
        onSegmentEnter={setActiveId}
      />
    </div>
  );
}

import { useControllableState } from '@ledgerhq/lumen-ui-react';
import { useMemo, type FocusEvent } from 'react';

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

  const resetActiveId = (): void => {
    if (activeId !== null) {
      setActiveId(null);
    }
  };

  const handleRingBlur = (event: FocusEvent<HTMLDivElement>): void => {
    const { relatedTarget } = event;
    const focusLeftRing =
      !(relatedTarget instanceof Node) ||
      !event.currentTarget.contains(relatedTarget);
    if (focusLeftRing) {
      resetActiveId();
    }
  };

  return (
    <div
      role='presentation'
      data-testid='donut-chart'
      style={{
        position: 'relative',
        width: geometry.box,
        height: geometry.box,
      }}
      onMouseLeave={resetActiveId}
      onBlur={handleRingBlur}
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

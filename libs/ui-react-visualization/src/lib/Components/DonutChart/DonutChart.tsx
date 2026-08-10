import { getContrastSafeColor } from '@ledgerhq/lumen-design-core';
import { useControllableState, useTheme } from '@ledgerhq/lumen-ui-react';
import { useMemo, type FocusEvent } from 'react';

import { DonutChartAnimatedCenter } from './DonutChartAnimatedCenter';
import { DonutRing } from './DonutRing';
import { DonutSizeProvider } from './donutSizeContext';
import type { DonutChartProps } from './types';
import {
  buildArcs,
  DONUT_GEOMETRY,
  formatPercentLabel,
  getSegmentPercents,
} from './utils';

export function DonutChart({
  series: seriesProp,
  size = 'md',
  ariaLabel = 'Donut chart',
  activeId: activeIdProp,
  defaultActiveId = null,
  onActiveIdChange,
  renderCenter,
  renderCenterActive,
  ensureColorContrast = false,
}: Readonly<DonutChartProps>) {
  const geometry = DONUT_GEOMETRY[size];
  const { colorScheme } = useTheme();

  const series = useMemo(
    () =>
      seriesProp.map((s) => ({
        ...s,
        ...(s.color &&
          ensureColorContrast && {
            color: getContrastSafeColor(
              s.color,
              getComputedStyle(document.documentElement)
                .getPropertyValue('--background-canvas')
                .trim() || (colorScheme === 'dark' ? '#151515' : '#f7f7f7'),
            ),
          }),
      })),
    [seriesProp, ensureColorContrast, colorScheme],
  );

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
    const percent = getSegmentPercents(series)[index];
    return {
      ...series[index],
      percent,
      percentLabel: formatPercentLabel(percent),
    };
  }, [series, activeId]);

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

  const hasCenter = renderCenter != null || renderCenterActive != null;
  const useAnimatedCenter = renderCenterActive != null;

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
      {hasCenter && (
        <div
          data-testid='donut-center'
          className='pointer-events-none absolute inset-0 flex items-center justify-center'
        >
          <DonutSizeProvider value={{ size }}>
            {useAnimatedCenter ? (
              <DonutChartAnimatedCenter
                activeSegment={activeSegment}
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
        </div>
      )}
    </div>
  );
}

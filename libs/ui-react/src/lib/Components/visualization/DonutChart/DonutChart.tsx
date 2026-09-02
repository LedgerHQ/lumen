import { useMemo, type FocusEvent } from 'react';
import { useControllableState } from '../../../../utils/useControllableState';

import { chartConfig } from '../config';
import { DonutChartAnimatedCenter } from './DonutChartAnimatedCenter';
import { DonutRing } from './DonutRing';
import { DonutSizeProvider } from './donutSizeContext';
import { useContrastSafeSeries } from './hooks/useContrastSafeSeries';
import type { DonutChartProps } from './types';
import {
  buildRingSegments,
  DONUT_GEOMETRY,
  formatPercentLabel,
  getSegmentPercents,
} from './utils';

export function DonutChart({
  series: seriesProp,
  size = 'md',
  ariaLabel = 'Donut chart',
  loading = false,
  activeId: activeIdProp,
  defaultActiveId = null,
  onActiveIdChange,
  renderCenter,
  renderCenterActive,
  enableColorContrast = false,
}: DonutChartProps) {
  const geometry = DONUT_GEOMETRY[size];

  const series = useContrastSafeSeries(seriesProp, enableColorContrast);

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
        segments={segments}
        geometry={geometry}
        ariaLabel={loading ? chartConfig.donut.loading.ariaLabel : ariaLabel}
        activeId={activeId}
        loading={loading}
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

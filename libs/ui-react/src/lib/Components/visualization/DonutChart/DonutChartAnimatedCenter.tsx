import { useEffect, useMemo, useState, type ReactNode } from 'react';

import { chartConfig } from '../config';
import type { DonutActiveSegment } from './types';

type DonutChartAnimatedCenterProps = {
  activeSegment: DonutActiveSegment | null;
  renderResting: () => ReactNode;
  renderActive: (segment: DonutActiveSegment) => ReactNode;
};

const { centerTextTransition } = chartConfig.donut.hover;
const SLIDE_PX = 8;

export const DonutChartAnimatedCenter = ({
  activeSegment,
  renderResting,
  renderActive,
}: DonutChartAnimatedCenterProps) => {
  const [lastActiveSegment, setLastActiveSegment] =
    useState<DonutActiveSegment | null>(null);

  useEffect(() => {
    if (activeSegment) {
      setLastActiveSegment(activeSegment);
    }
  }, [activeSegment]);

  const isActive = activeSegment != null;
  const shown = activeSegment ?? lastActiveSegment;

  const restingStyle = useMemo(
    () => ({
      transition: centerTextTransition,
      opacity: isActive ? 0 : 1,
      transform: `translateY(${isActive ? -SLIDE_PX : 0}px)`,
    }),
    [isActive],
  );

  const activeStyle = useMemo(
    () => ({
      transition: centerTextTransition,
      opacity: isActive ? 1 : 0,
      transform: `translateY(${isActive ? 0 : SLIDE_PX}px)`,
    }),
    [isActive],
  );

  return (
    <div className='pointer-events-auto grid'>
      <div
        data-visible={!isActive}
        aria-hidden={isActive}
        style={{
          gridArea: '1 / 1',
          pointerEvents: isActive ? 'none' : 'auto',
          ...restingStyle,
        }}
        className='flex items-center justify-center'
      >
        {renderResting()}
      </div>
      {shown && (
        <div
          data-visible={isActive}
          aria-hidden={!isActive}
          style={{
            gridArea: '1 / 1',
            pointerEvents: isActive ? 'auto' : 'none',
            ...activeStyle,
          }}
          className='flex items-center justify-center'
        >
          {renderActive(shown)}
        </div>
      )}
    </div>
  );
};

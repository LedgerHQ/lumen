import { useEffect, useState, type ReactNode } from 'react';

import { chartConfig } from '../../config';
import type { DonutSegment } from './types';

type ActiveSegment = DonutSegment & { percent: number };

type DonutChartAnimatedCenterProps = {
  activeSegment: ActiveSegment | null;
  renderResting: () => ReactNode;
  renderActive: (segment: ActiveSegment) => ReactNode;
};

const { centerTextTransition } = chartConfig.donut.hover;
const SLIDE_PX = 8;

export const DonutChartAnimatedCenter = ({
  activeSegment,
  renderResting,
  renderActive,
}: DonutChartAnimatedCenterProps) => {
  const [lastActiveSegment, setLastActiveSegment] =
    useState<ActiveSegment | null>(null);

  useEffect(() => {
    if (activeSegment) {
      setLastActiveSegment(activeSegment);
    }
  }, [activeSegment]);

  const isActive = activeSegment != null;
  const shown = activeSegment ?? lastActiveSegment;

  const restingStyle = {
    transition: centerTextTransition,
    opacity: isActive ? 0 : 1,
    transform: `translateY(${isActive ? -SLIDE_PX : 0}px)`,
  };

  const activeStyle = {
    transition: centerTextTransition,
    opacity: isActive ? 1 : 0,
    transform: `translateY(${isActive ? 0 : SLIDE_PX}px)`,
  };

  return (
    <div className='pointer-events-auto grid'>
      <div
        data-visible={!isActive}
        style={{ gridArea: '1 / 1', ...restingStyle }}
        className='flex items-center justify-center'
      >
        {renderResting()}
      </div>
      {shown && (
        <div
          data-visible={isActive}
          style={{ gridArea: '1 / 1', ...activeStyle }}
          className='flex flex-col items-center justify-center'
        >
          {renderActive(shown)}
        </div>
      )}
    </div>
  );
};

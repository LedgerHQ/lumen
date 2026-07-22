import { useCallback } from 'react';
import { chartConfig } from '../../config';

import type { DonutArc, DonutGeometry } from './types';
import { buildEmptyRingPath } from './utils';

const { hover } = chartConfig.donut;

type RingSegmentProps = {
  segment: DonutArc;
  activeId: string | null;
  onSegmentEnter: (id: string) => void;
};

const RingSegment = ({
  segment,
  activeId,
  onSegmentEnter,
}: RingSegmentProps) => {
  const isActive = activeId === segment.id;
  const opacity =
    !segment.hoverEnabled || activeId == null || isActive
      ? 1
      : hover.dimOpacity;
  const { x, y } = isActive ? segment.hoverTranslate : { x: 0, y: 0 };

  const handleSegmentEnter = useCallback(() => {
    onSegmentEnter(segment.id);
  }, [segment.id, onSegmentEnter]);

  return (
    <path
      data-testid='donut-segment'
      data-segment-id={segment.id}
      d={segment.path}
      fill={segment.color}
      role='button'
      aria-label={isActive ? `${segment.id}, selected` : segment.id}
      tabIndex={0}
      className='outline-none focus-visible:outline-2 focus-visible:outline-focus'
      onMouseEnter={handleSegmentEnter}
      onFocus={handleSegmentEnter}
      style={{
        cursor: 'pointer',
        opacity,
        transform: `translate(${x}px, ${y}px)`,
        transition: segment.hoverEnabled
          ? `${hover.opacityTransition}, ${hover.popTransition}`
          : undefined,
      }}
    />
  );
};

const EmptyRing = ({ geometry }: { geometry: DonutGeometry }) => (
  <path
    data-testid='donut-empty'
    d={buildEmptyRingPath(geometry)}
    fill={chartConfig.donut.emptyRingColor}
  />
);

type DonutRingProps = {
  arcs: DonutArc[];
  geometry: DonutGeometry;
  ariaLabel?: string;
  activeId: string | null;
  onSegmentEnter: (id: string) => void;
};

// Internal, not exported. Arc paths are origin-centered, so the group is translated to the viewBox center.
export const DonutRing = ({
  arcs,
  geometry,
  ariaLabel,
  activeId,
  onSegmentEnter,
}: DonutRingProps) => {
  const { box } = geometry;
  const center = box / 2;
  const hasSegments = arcs.length > 0;

  return (
    <svg
      data-testid='donut-ring'
      width={box}
      height={box}
      viewBox={`0 0 ${box} ${box}`}
      role={hasSegments ? 'group' : 'img'}
      aria-label={ariaLabel}
      style={{ display: 'block', overflow: 'visible' }}
    >
      <g transform={`translate(${center}, ${center})`}>
        {hasSegments ? (
          arcs.map((segment) => (
            <RingSegment
              key={segment.id}
              segment={segment}
              activeId={activeId}
              onSegmentEnter={onSegmentEnter}
            />
          ))
        ) : (
          <EmptyRing geometry={geometry} />
        )}
      </g>
    </svg>
  );
};

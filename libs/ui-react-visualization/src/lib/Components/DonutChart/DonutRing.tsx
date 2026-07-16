import { chartConfig } from '../../config';

import { buildEmptyRingPath, type DonutArc, type DonutGeometry } from './utils';

const RingSegment = ({ segment }: { segment: DonutArc }) => (
  <path
    data-testid='donut-segment'
    data-segment-id={segment.id}
    d={segment.path}
    fill={segment.color}
  />
);

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
};

// Internal, not exported. Arc paths are origin-centered, so the group is translated to the viewBox center.
export const DonutRing = ({ arcs, geometry, ariaLabel }: DonutRingProps) => {
  const { box } = geometry;
  const center = box / 2;
  const hasSegments = arcs.length > 0;

  return (
    <svg
      data-testid='donut-ring'
      width={box}
      height={box}
      viewBox={`0 0 ${box} ${box}`}
      role='img'
      aria-label={ariaLabel}
      style={{ display: 'block', overflow: 'visible' }}
    >
      <g transform={`translate(${center}, ${center})`}>
        {hasSegments ? (
          arcs.map((segment) => (
            <RingSegment key={segment.id} segment={segment} />
          ))
        ) : (
          <EmptyRing geometry={geometry} />
        )}
      </g>
    </svg>
  );
};

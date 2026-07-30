import { useCallback } from 'react';
import { chartConfig } from '../../config';

import { useDonutLoadingAnimation } from './hooks/useDonutLoadingAnimation';
import type { DonutArc, DonutGeometry } from './types';
import { buildPlaceholderArcs, getDonutViewBox } from './utils';

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

const EmptyRing = ({ geometry }: { geometry: DonutGeometry }) => {
  const arcs = buildPlaceholderArcs(geometry);

  return (
    <g data-testid='donut-empty'>
      {arcs.map((segment) => (
        <path
          key={segment.id}
          d={segment.path}
          fill={chartConfig.donut.emptyRingColor}
        />
      ))}
    </g>
  );
};

const LoadingRing = ({ geometry }: { geometry: DonutGeometry }) => {
  const arcs = buildPlaceholderArcs(geometry);
  const { animationStyle, keyframe, getSegmentDelay } =
    useDonutLoadingAnimation();

  return (
    <>
      <style>{keyframe}</style>
      <g data-testid='donut-loading'>
        {arcs.map((segment) => (
          <path
            key={segment.id}
            d={segment.path}
            fill={chartConfig.donut.emptyRingColor}
            style={{
              animation: animationStyle,
              animationDelay: getSegmentDelay(segment.midAngle),
            }}
          />
        ))}
      </g>
    </>
  );
};

type DonutRingProps = {
  arcs: DonutArc[];
  geometry: DonutGeometry;
  ariaLabel?: string;
  activeId: string | null;
  loading?: boolean;
  onSegmentEnter: (id: string) => void;
};

// Internal, not exported. Arc paths are origin-centered, so the group is translated to the viewBox center.
export const DonutRing = ({
  arcs,
  geometry,
  ariaLabel,
  activeId,
  loading = false,
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
      viewBox={getDonutViewBox(geometry)}
      role={loading || !hasSegments ? 'img' : 'group'}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      style={{ display: 'block', overflow: 'visible' }}
    >
      <g transform={`translate(${center}, ${center})`}>
        {loading ? (
          <LoadingRing geometry={geometry} />
        ) : hasSegments ? (
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

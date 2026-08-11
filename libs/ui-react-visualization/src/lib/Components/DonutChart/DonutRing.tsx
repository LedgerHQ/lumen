import { useCallback, useMemo } from 'react';
import { chartConfig } from '../../config';

import { useDonutLoadingAnimation } from './hooks/useDonutLoadingAnimation';
import { RevealAnimation } from './RevealAnimation';
import type { DonutGeometry, DonutRingSegment } from './types';
import { buildPlaceholderSegments, getDonutViewBox } from './utils';

const { hover } = chartConfig.donut;

type RingSegmentProps = {
  segment: DonutRingSegment;
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
  const segments = useMemo(
    () => buildPlaceholderSegments(geometry),
    [geometry],
  );

  return (
    <g data-testid='donut-empty'>
      {segments.map((segment) => (
        <path
          key={segment.id}
          data-testid='donut-placeholder'
          d={segment.path}
          fill={chartConfig.donut.emptyRingColor}
        />
      ))}
    </g>
  );
};

const LoadingRing = ({ geometry }: { geometry: DonutGeometry }) => {
  const segments = useMemo(
    () => buildPlaceholderSegments(geometry),
    [geometry],
  );
  const { animationStyle, keyframe, getSegmentDelay } =
    useDonutLoadingAnimation();

  return (
    <>
      <style>{keyframe}</style>
      <g data-testid='donut-loading'>
        {segments.map((segment) => (
          <path
            key={segment.id}
            data-testid='donut-placeholder'
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
  segments: DonutRingSegment[];
  geometry: DonutGeometry;
  ariaLabel?: string;
  activeId: string | null;
  loading?: boolean;
  onSegmentEnter: (id: string) => void;
};

// Internal, not exported. Segment paths are origin-centered, so the group is translated to the viewBox center.
export const DonutRing = ({
  segments,
  geometry,
  ariaLabel,
  activeId,
  loading = false,
  onSegmentEnter,
}: DonutRingProps) => {
  const { box } = geometry;
  const center = box / 2;
  const hasSegments = segments.length > 0;

  return (
    <RevealAnimation>
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
            segments.map((segment) => (
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
    </RevealAnimation>
  );
};

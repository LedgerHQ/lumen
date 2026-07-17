import { useTheme } from '@ledgerhq/lumen-ui-rnative';
import { Path, Svg } from 'react-native-svg';

import type { DonutGeometry } from './constants';
import { buildEmptyRingPath, type DonutArc } from './utils';

const RingSegment = ({
  segment,
  defaultColor,
}: {
  segment: DonutArc;
  defaultColor: string;
}) => (
  <Path
    testID='donut-segment'
    d={segment.path}
    fill={segment.color ?? defaultColor}
  />
);

const EmptyRing = ({
  geometry,
  color,
}: {
  geometry: DonutGeometry;
  color: string;
}) => (
  <Path testID='donut-empty' d={buildEmptyRingPath(geometry)} fill={color} />
);

type DonutRingProps = {
  arcs: DonutArc[];
  geometry: DonutGeometry;
  ariaLabel?: string;
};

// Internal, not exported. Arc paths are origin-centered; the viewBox is sized to
// the ring's outer diameter so the ring is never clipped when it exceeds `box`.
export const DonutRing = ({ arcs, geometry, ariaLabel }: DonutRingProps) => {
  const { theme } = useTheme();
  const { box, outerRadius } = geometry;
  const extent = outerRadius * 2;
  const hasSegments = arcs.length > 0;

  return (
    <Svg
      testID='donut-ring'
      width={box}
      height={box}
      viewBox={`${-outerRadius} ${-outerRadius} ${extent} ${extent}`}
      accessibilityRole='image'
      accessibilityLabel={ariaLabel}
    >
      {hasSegments ? (
        arcs.map((segment) => (
          <RingSegment
            key={segment.id}
            segment={segment}
            defaultColor={theme.colors.bg.mutedStrong}
          />
        ))
      ) : (
        <EmptyRing geometry={geometry} color={theme.colors.bg.muted} />
      )}
    </Svg>
  );
};

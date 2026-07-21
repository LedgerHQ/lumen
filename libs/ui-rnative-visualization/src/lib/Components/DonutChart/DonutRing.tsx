import { useTheme } from '@ledgerhq/lumen-ui-rnative';
import { G, Path, Svg } from 'react-native-svg';

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
    id={segment.id}
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
  accessibilityLabel?: string;
};

// Internal, not exported. Arc paths are origin-centered, so the group is translated to the viewBox center.
export const DonutRing = ({
  arcs,
  geometry,
  accessibilityLabel,
}: DonutRingProps) => {
  const { theme } = useTheme();
  const { box } = geometry;
  const center = box / 2;
  const hasSegments = arcs.length > 0;

  return (
    <Svg
      testID='donut-ring'
      width={box}
      height={box}
      viewBox={`0 0 ${box} ${box}`}
      accessibilityRole='image'
      accessibilityLabel={accessibilityLabel}
    >
      <G transform={`translate(${center}, ${center})`}>
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
      </G>
    </Svg>
  );
};

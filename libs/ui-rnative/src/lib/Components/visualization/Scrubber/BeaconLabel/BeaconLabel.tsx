import {
  computeBeaconLabelX,
  computeBeaconLabelYs,
} from '@ledgerhq/lumen-utils-shared';
import { G, Rect, Text as SvgText, TSpan } from 'react-native-svg';

import { chartConfig, useChartTokens } from '../../config';
import type { DrawingArea } from '../../utils/types';
import { PositionedLabel } from '../PositionedLabel/PositionedLabel';
import { useLayoutWidth } from '../PositionedLabel/useLayoutWidth';
import type { DefaultBeaconLabelProps, ScrubberProps } from '../types';
import type { Beacon } from '../useScrubberGeometry';

const { beaconLabel, scrubber } = chartConfig;

/**
 * Default beacon label: a pill sized to its content, drawn from its top-left
 * corner. Pass a `label` for text, or `children` for any SVG inside the pill.
 */
export function DefaultBeaconLabel({
  label,
  children,
  background,
  color,
}: Readonly<DefaultBeaconLabelProps>) {
  const tokens = useChartTokens();
  const [contentWidth, onContentLayout] = useLayoutWidth();

  return (
    <G>
      <Rect
        width={contentWidth + beaconLabel.paddingX * 2}
        height={beaconLabel.height}
        rx={tokens.radius.xs}
        fill={background ?? tokens.color.surface}
      />
      <G
        onLayout={onContentLayout}
        x={beaconLabel.paddingX}
        fill={color ?? tokens.color.text}
      >
        {children ?? (
          <SvgText
            y={beaconLabel.height / 2}
            alignmentBaseline='central'
            fontSize={tokens.font.bodySize}
            fontFamily={tokens.font.family}
            fontWeight={tokens.font.bodyWeightMedium}
          >
            {typeof label === 'number' ? String(label) : label}
          </SvgText>
        )}
      </G>
    </G>
  );
}

function SeriesLabel({ beacon }: Readonly<{ beacon: Beacon }>) {
  const tokens = useChartTokens();

  return (
    <DefaultBeaconLabel
      label={
        <TSpan>
          <TSpan fill={tokens.color.textMuted}>
            {String(beacon.series.label ?? beacon.series.id)}
          </TSpan>
          <TSpan dx={beaconLabel.contentGap}>{String(beacon.value)}</TSpan>
        </TSpan>
      }
    />
  );
}

type ScrubberBeaconLabelsProps = {
  pixelX: number;
  drawingArea: DrawingArea;
  beacons: Beacon[];
  renderLabel: ScrubberProps['beaconLabel'];
};

export function ScrubberBeaconLabels({
  pixelX,
  drawingArea,
  beacons,
  renderLabel,
}: Readonly<ScrubberBeaconLabelsProps>) {
  const sorted = [...beacons].sort((a, b) => a.pixelY - b.pixelY);
  const ys = computeBeaconLabelYs(
    sorted.map((b) => b.pixelY),
    drawingArea,
    beaconLabel,
  );

  return sorted.map((beacon, i) => (
    <PositionedLabel
      key={beacon.id}
      testID={`scrubber-beacon-label-${beacon.id}`}
      placeX={(width) =>
        computeBeaconLabelX(
          pixelX,
          width,
          drawingArea,
          scrubber.beaconRadius + beaconLabel.gap,
        )
      }
      y={ys[i]}
    >
      {renderLabel ? (
        renderLabel({ series: beacon.series, value: beacon.value })
      ) : (
        <SeriesLabel beacon={beacon} />
      )}
    </PositionedLabel>
  ));
}

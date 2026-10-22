import type { ReactNode } from 'react';
import { G, Rect, Text as SvgText, TSpan } from 'react-native-svg';

import { chartConfig, useChartTokens } from '../../config';
import type { DrawingArea } from '../../utils/types';
import type { BeaconLabelProps, ScrubberProps, SvgBBoxElement } from '../types';
import type { Beacon } from '../useScrubberGeometry';
import {
  computeBeaconLabelX,
  computeBeaconLabelYs,
  useMeasuredWidth,
} from './utils';

const { beaconLabel } = chartConfig;

/**
 * Default beacon label: a pill with a muted title and an emphasized value.
 * Draws from its top-left corner, like any custom `beaconLabel` content.
 */
export function BeaconLabel({ title, value }: Readonly<BeaconLabelProps>) {
  const tokens = useChartTokens();
  const [textRef, textWidth] = useMeasuredWidth();

  return (
    <G>
      <Rect
        width={textWidth + beaconLabel.paddingX * 2}
        height={beaconLabel.height}
        rx={tokens.radius.xs}
        fill={tokens.color.surface}
      />
      <SvgText
        ref={(el) => {
          textRef.current = el as unknown as SvgBBoxElement | null;
        }}
        x={beaconLabel.paddingX}
        y={beaconLabel.height / 2}
        alignmentBaseline='central'
        fontSize={tokens.font.bodySize}
        fontFamily={tokens.font.family}
      >
        <TSpan
          fill={tokens.color.textMuted}
          fontWeight={tokens.font.bodyWeightMedium}
        >
          {String(title)}
        </TSpan>
        <TSpan
          dx={beaconLabel.contentGap}
          fill={tokens.color.text}
          fontWeight={tokens.font.bodyWeightSemiBold}
        >
          {String(value)}
        </TSpan>
      </SvgText>
    </G>
  );
}

type ScrubberBeaconLabelsProps = {
  pixelX: number;
  drawingArea: DrawingArea;
  beacons: Beacon[];
  renderLabel?: ScrubberProps['beaconLabel'];
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
  );

  return sorted.map((beacon, i) => (
    <PositionedLabel
      key={beacon.id}
      testID={`scrubber-beacon-label-${beacon.id}`}
      pixelX={pixelX}
      y={ys[i]}
      drawingArea={drawingArea}
    >
      {renderLabel ? (
        renderLabel(beacon)
      ) : (
        <BeaconLabel
          title={beacon.series.label ?? beacon.series.id}
          value={beacon.value}
        />
      )}
    </PositionedLabel>
  ));
}

type PositionedLabelProps = {
  testID: string;
  pixelX: number;
  y: number;
  drawingArea: DrawingArea;
  children: ReactNode;
};

function PositionedLabel({
  testID,
  pixelX,
  y,
  drawingArea,
  children,
}: Readonly<PositionedLabelProps>) {
  const [ref, width] = useMeasuredWidth();
  const x = computeBeaconLabelX(pixelX, width, drawingArea);

  return (
    <G
      ref={(el) => {
        ref.current = el as unknown as SvgBBoxElement | null;
      }}
      testID={testID}
      x={x}
      y={y}
      opacity={width === 0 ? 0 : 1}
      pointerEvents='none'
    >
      {children}
    </G>
  );
}

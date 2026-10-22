import { useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { G, Rect, Text as SvgText, TSpan } from 'react-native-svg';

import { chartConfig, useChartTokens } from '../../config';
import type { DrawingArea } from '../../utils/types';
import type { BeaconLabelProps, ScrubberProps } from '../types';
import type { Beacon } from '../useScrubberGeometry';
import { computeBeaconLabelX, computeBeaconLabelYs } from './utils';

const { beaconLabel } = chartConfig;

const useLayoutWidth = (): [number, (event: LayoutChangeEvent) => void] => {
  const [width, setWidth] = useState(0);
  const onLayout = useCallback(
    (event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width),
    [],
  );
  return [width, onLayout];
};

/**
 * Default beacon label: a pill with a muted title and an emphasized value.
 * Draws from its top-left corner, like any custom `beaconLabel` content.
 */
export function BeaconLabel({ title, value }: Readonly<BeaconLabelProps>) {
  const tokens = useChartTokens();
  const [textWidth, onTextLayout] = useLayoutWidth();

  return (
    <G>
      <Rect
        width={textWidth + beaconLabel.paddingX * 2}
        height={beaconLabel.height}
        rx={tokens.radius.xs}
        fill={tokens.color.surface}
      />
      <SvgText
        onLayout={onTextLayout}
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
          fontWeight={tokens.font.bodyWeightMedium}
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
        renderLabel({ series: beacon.series, value: beacon.value })
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
  const [width, onLayout] = useLayoutWidth();
  const x = computeBeaconLabelX(pixelX, width, drawingArea);

  return (
    <G
      testID={testID}
      onLayout={onLayout}
      x={x}
      y={y}
      opacity={width === 0 ? 0 : 1}
      pointerEvents='none'
    >
      {children}
    </G>
  );
}

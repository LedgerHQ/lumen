import type { ReactNode } from 'react';
import { useLayoutEffect, useRef, useState } from 'react';

import { chartConfig } from '../../config';
import type { DrawingArea } from '../../utils/types';
import { safeGetBBoxWidth } from '../DefaultScrubberTooltip/utils';
import type { BeaconLabelProps, ScrubberProps } from '../types';
import type { Beacon } from '../useScrubberGeometry';
import { computeBeaconLabelX, computeBeaconLabelYs } from './utils';

const { beaconLabel, font } = chartConfig;

export function BeaconLabel({ title, value }: Readonly<BeaconLabelProps>) {
  const textRef = useRef<SVGTextElement>(null);
  const [textWidth, setTextWidth] = useState(0);

  useLayoutEffect(() => {
    setTextWidth(safeGetBBoxWidth(textRef.current));
  }, [title, value]);

  return (
    <g>
      <rect
        width={textWidth + beaconLabel.paddingX * 2}
        height={beaconLabel.height}
        fill={beaconLabel.background}
        style={{ rx: beaconLabel.borderRadius }}
      />
      <text
        ref={textRef}
        x={beaconLabel.paddingX}
        y={beaconLabel.height / 2}
        dominantBaseline='middle'
        style={{ fontSize: font.bodySize, fontFamily: font.family }}
      >
        <tspan fill={beaconLabel.titleColor} fontWeight={font.bodyWeightMedium}>
          {title}
        </tspan>
        <tspan
          dx={beaconLabel.contentGap}
          fill={beaconLabel.valueColor}
          fontWeight={font.bodyWeightSemiBold}
        >
          {value}
        </tspan>
      </text>
    </g>
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
      testId={`scrubber-beacon-label-${beacon.id}`}
      value={beacon.value}
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
  testId: string;
  value: number;
  pixelX: number;
  y: number;
  drawingArea: DrawingArea;
  children: ReactNode;
};

function PositionedLabel({
  testId,
  value,
  pixelX,
  y,
  drawingArea,
  children,
}: Readonly<PositionedLabelProps>) {
  const ref = useRef<SVGGElement>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    setWidth(safeGetBBoxWidth(ref.current));
  }, [testId, value]);

  const x = computeBeaconLabelX(pixelX, width, drawingArea);

  return (
    <g
      ref={ref}
      data-testid={testId}
      transform={`translate(${x} ${y})`}
      pointerEvents='none'
    >
      {children}
    </g>
  );
}

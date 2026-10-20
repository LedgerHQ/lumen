import type { ReactNode } from 'react';
import { useLayoutEffect, useRef, useState } from 'react';

import { chartConfig } from '../../config';
import type { DrawingArea } from '../../utils/types';
import { safeGetBBoxWidth } from '../DefaultScrubberTooltip/utils';
import type { BeaconLabelProps, ScrubberProps } from '../types';
import type { Beacon } from '../useScrubberGeometry';

const { beaconLabel, font, scrubber } = chartConfig;

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
  renderLabel?: ScrubberProps['beaconLabel'];
};

export function ScrubberBeaconLabels({
  pixelX,
  drawingArea,
  beacons,
  renderLabel,
}: Readonly<ScrubberBeaconLabelsProps>) {
  const { height, rowGap } = beaconLabel;
  const sorted = [...beacons].sort((a, b) => a.pixelY - b.pixelY);
  const ys = sorted.map((b) => b.pixelY - height / 2);

  for (let i = 1; i < ys.length; i++) {
    ys[i] = Math.max(ys[i], ys[i - 1] + height + rowGap);
  }

  let limit = drawingArea.y + drawingArea.height - height;
  for (let i = ys.length - 1; i >= 0; i--) {
    ys[i] = Math.min(ys[i], limit);
    limit = ys[i] - height - rowGap;
  }

  return sorted.map((beacon, i) => (
    <PositionedLabel
      key={beacon.id}
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
  pixelX: number;
  y: number;
  drawingArea: DrawingArea;
  children: ReactNode;
};

function PositionedLabel({
  pixelX,
  y,
  drawingArea,
  children,
}: Readonly<PositionedLabelProps>) {
  const ref = useRef<SVGGElement>(null);
  const [width, setWidth] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    setWidth(safeGetBBoxWidth(ref.current));
  });

  const offset = scrubber.beaconRadius + beaconLabel.gap;
  const fitsRight =
    pixelX + offset + width <= drawingArea.x + drawingArea.width;
  const x = fitsRight ? pixelX + offset : pixelX - offset - width;

  return (
    <g ref={ref} transform={`translate(${x} ${y})`} pointerEvents='none'>
      {children}
    </g>
  );
}

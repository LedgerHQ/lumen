import type { ReactNode } from 'react';
import { useLayoutEffect, useRef, useState } from 'react';

import { chartConfig } from '../../config';
import type { DrawingArea } from '../../utils/types';
import { safeGetBBoxWidth } from '../DefaultScrubberTooltip/utils';
import type { DefaultBeaconLabelProps, ScrubberProps } from '../types';
import type { Beacon } from '../useScrubberGeometry';
import { computeBeaconLabelX, computeBeaconLabelYs } from './utils';

const { beaconLabel, font } = chartConfig;

/**
 * Default beacon label: a pill sized to its `label`, drawn from its top-left
 * corner.
 */
export function DefaultBeaconLabel({
  label,
  background = beaconLabel.background,
  color = beaconLabel.valueColor,
}: Readonly<DefaultBeaconLabelProps>) {
  const textRef = useRef<SVGTextElement>(null);
  const [textWidth, setTextWidth] = useState(0);

  useLayoutEffect(() => {
    setTextWidth(safeGetBBoxWidth(textRef.current));
  }, [label]);

  return (
    <g>
      <rect
        width={textWidth + beaconLabel.paddingX * 2}
        height={beaconLabel.height}
        fill={background}
        style={{ rx: beaconLabel.borderRadius }}
      />
      <text
        ref={textRef}
        x={beaconLabel.paddingX}
        y={beaconLabel.height / 2}
        dominantBaseline='middle'
        fill={color}
        fontWeight={font.bodyWeightMedium}
        style={{ fontSize: font.bodySize, fontFamily: font.family }}
      >
        {label}
      </text>
    </g>
  );
}

const seriesLabel = (beacon: Beacon): DefaultBeaconLabelProps['label'] => (
  <tspan>
    <tspan fill={beaconLabel.titleColor}>
      {beacon.series.label ?? beacon.series.id}
    </tspan>
    <tspan dx={beaconLabel.contentGap}>{beacon.value}</tspan>
  </tspan>
);

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
        <DefaultBeaconLabel label={seriesLabel(beacon)} />
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

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element || typeof ResizeObserver === 'undefined') {
      return;
    }
    const observer = new ResizeObserver(() => {
      setWidth(safeGetBBoxWidth(element));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

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

import type { ReactNode } from 'react';
import { useLayoutEffect, useRef, useState } from 'react';

import { chartConfig } from '../../config';
import type { DrawingArea } from '../../utils/types';
import { safeGetBBoxWidth } from '../DefaultScrubberTooltip/utils';
import type {
  DefaultBeaconLabelProps,
  ScrubberProps,
  SvgTextContent,
} from '../types';
import type { Beacon } from '../useScrubberGeometry';
import { computeBeaconLabelX, computeBeaconLabelYs } from './utils';

const { beaconLabel, font } = chartConfig;

/**
 * Default beacon label: a pill sized to its content, drawn from its top-left
 * corner. Pass a `label` for text, or `children` for any SVG inside the pill.
 */
export function DefaultBeaconLabel({
  label,
  children,
  background = beaconLabel.background,
  color = beaconLabel.valueColor,
}: Readonly<DefaultBeaconLabelProps>) {
  const contentRef = useRef<SVGGElement>(null);
  const [contentWidth, setContentWidth] = useState(0);

  useLayoutEffect(() => {
    setContentWidth(safeGetBBoxWidth(contentRef.current));
  }, [label, children]);

  return (
    <g>
      <rect
        width={contentWidth + beaconLabel.paddingX * 2}
        height={beaconLabel.height}
        fill={background}
        style={{ rx: beaconLabel.borderRadius }}
      />
      <g
        ref={contentRef}
        transform={`translate(${beaconLabel.paddingX} 0)`}
        fill={color}
      >
        {children ?? (
          <text
            y={beaconLabel.height / 2}
            dominantBaseline='central'
            fontWeight={font.bodyWeightMedium}
            style={{ fontSize: font.bodySize, fontFamily: font.family }}
          >
            {label}
          </text>
        )}
      </g>
    </g>
  );
}

const seriesLabel = (beacon: Beacon): SvgTextContent => (
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
      measureKey={beacon.value}
      placeX={(width) => computeBeaconLabelX(pixelX, width, drawingArea)}
      y={ys[i]}
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
  measureKey: number;
  placeX: (width: number) => number;
  y: number;
  children: ReactNode;
};

export function PositionedLabel({
  testId,
  measureKey,
  placeX,
  y,
  children,
}: Readonly<PositionedLabelProps>) {
  const ref = useRef<SVGGElement>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    setWidth(safeGetBBoxWidth(ref.current));
  }, [testId, measureKey]);

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

  const x = placeX(width);

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

import { useMemo, useRef } from 'react';
import type { ReactNode } from 'react';
import { G, Rect, Text as SvgText, TSpan } from 'react-native-svg';

import { chartConfig, useChartTokens } from '../../config';
import type { DrawingArea } from '../../utils/types';
import type { BeaconLabelProps, ScrubberProps, SvgBBoxElement } from '../types';
import type { Beacon } from '../useScrubberGeometry';
import { TextMeasurer } from './TextMeasurer';
import {
  computeBeaconLabelX,
  computeBeaconLabelYs,
  useMeasuredWidth,
  useTextWidth,
  type TextFont,
} from './utils';

const { beaconLabel } = chartConfig;

const useLabelFonts = (): { title: TextFont; value: TextFont } => {
  const { font } = useChartTokens();
  return useMemo(() => {
    const title = {
      family: font.family,
      size: font.bodySize,
      weight: font.bodyWeightMedium,
    };
    return { title, value: { ...title, weight: font.bodyWeightSemiBold } };
  }, [font]);
};

const usePillWidth = (title: string, value: string): number => {
  const fonts = useLabelFonts();
  const titleWidth = useTextWidth(title, fonts.title);
  const valueWidth = useTextWidth(value, fonts.value);
  const width = useRef(0);
  if (titleWidth !== undefined && valueWidth !== undefined) {
    width.current =
      titleWidth +
      beaconLabel.contentGap +
      valueWidth +
      beaconLabel.paddingX * 2;
  }
  return width.current;
};

/**
 * Default beacon label: a pill with a muted title and an emphasized value.
 * Draws from its top-left corner, like any custom `beaconLabel` content.
 */
export function BeaconLabel({ title, value }: Readonly<BeaconLabelProps>) {
  const tokens = useChartTokens();
  const fonts = useLabelFonts();
  const titleText = String(title);
  const valueText = String(value);
  const width = usePillWidth(titleText, valueText);

  return (
    <G>
      <Rect
        width={width}
        height={beaconLabel.height}
        rx={tokens.radius.xs}
        fill={tokens.color.surface}
      />
      <SvgText
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
          {titleText}
        </TSpan>
        <TSpan
          dx={beaconLabel.contentGap}
          fill={tokens.color.text}
          fontWeight={tokens.font.bodyWeightSemiBold}
        >
          {valueText}
        </TSpan>
      </SvgText>
      <TextMeasurer text={titleText} font={fonts.title} />
      <TextMeasurer text={valueText} font={fonts.value} />
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

  return sorted.map((beacon, i) => {
    const props = {
      testID: `scrubber-beacon-label-${beacon.id}`,
      pixelX,
      y: ys[i],
      drawingArea,
    };
    return renderLabel ? (
      <PositionedLabel key={beacon.id} {...props}>
        {renderLabel(beacon)}
      </PositionedLabel>
    ) : (
      <DefaultLabel
        key={beacon.id}
        {...props}
        title={String(beacon.series.label ?? beacon.series.id)}
        value={String(beacon.value)}
      />
    );
  });
}

type PositionedLabelProps = {
  testID: string;
  pixelX: number;
  y: number;
  drawingArea: DrawingArea;
  width?: number;
  children: ReactNode;
};

function PositionedLabel({
  testID,
  pixelX,
  y,
  drawingArea,
  width,
  children,
}: Readonly<PositionedLabelProps>) {
  const [ref, measuredWidth] = useMeasuredWidth(
    width === undefined ? testID : null,
  );
  const resolvedWidth = width ?? measuredWidth;

  return (
    <G
      ref={(el) => {
        ref.current = el as unknown as SvgBBoxElement | null;
      }}
      testID={testID}
      x={computeBeaconLabelX(pixelX, resolvedWidth, drawingArea)}
      y={y}
      opacity={resolvedWidth === 0 ? 0 : 1}
      pointerEvents='none'
    >
      {children}
    </G>
  );
}

type DefaultLabelProps = Omit<PositionedLabelProps, 'width' | 'children'> & {
  title: string;
  value: string;
};

function DefaultLabel({ title, value, ...props }: Readonly<DefaultLabelProps>) {
  const width = usePillWidth(title, value);

  return (
    <PositionedLabel {...props} width={width}>
      <BeaconLabel title={title} value={value} />
    </PositionedLabel>
  );
}

import {
  computeLineLabelX,
  computeLineLabelY,
} from '@ledgerhq/lumen-utils-shared';
import { G, Text as SvgText } from 'react-native-svg';

import { useCartesianChartContext } from '../../CartesianChart/context';
import { chartConfig, useChartTokens } from '../../config';
import type { DrawingArea } from '../../utils/types';
import { PositionedLabel } from '../PositionedLabel/PositionedLabel';
import type { DefaultLineLabelProps, ScrubberProps } from '../types';
import { resolveLineLabelContext } from './utils';

const { lineLabel } = chartConfig;

/**
 * Default line label: the x-axis value as muted text, drawn from its top-left
 * corner. Pass a `label` for text, or `children` for any SVG in its place.
 */
export function DefaultLineLabel({
  label,
  children,
  color,
}: Readonly<DefaultLineLabelProps>) {
  const tokens = useChartTokens();

  return (
    <G fill={color ?? tokens.color.textMuted}>
      {children ?? (
        <SvgText
          y={lineLabel.height / 2}
          alignmentBaseline='central'
          fontSize={tokens.font.labelSize}
          fontFamily={tokens.font.family}
        >
          {typeof label === 'number' ? String(label) : label}
        </SvgText>
      )}
    </G>
  );
}

type ScrubberLineLabelProps = {
  dataIndex: number;
  pixelX: number;
  drawingArea: DrawingArea;
  renderLabel: ScrubberProps['lineLabel'];
};

export function ScrubberLineLabel({
  dataIndex,
  pixelX,
  drawingArea,
  renderLabel,
}: Readonly<ScrubberLineLabelProps>) {
  const { getXAxisConfig } = useCartesianChartContext();
  const context = resolveLineLabelContext(dataIndex, getXAxisConfig());

  return (
    <PositionedLabel
      testID='scrubber-line-label'
      placeX={(width) => computeLineLabelX(pixelX, width, drawingArea)}
      y={computeLineLabelY(drawingArea, lineLabel)}
    >
      {renderLabel ? (
        renderLabel(context)
      ) : (
        <DefaultLineLabel label={context.label} />
      )}
    </PositionedLabel>
  );
}

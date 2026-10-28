import { useCartesianChartContext } from '../../CartesianChart/context';
import { chartConfig } from '../../config';
import type { DrawingArea } from '../../utils/types';
import { PositionedLabel } from '../BeaconLabel/BeaconLabel';
import type { DefaultLineLabelProps, ScrubberProps } from '../types';
import {
  computeLineLabelX,
  computeLineLabelY,
  resolveLineLabelContext,
} from './utils';

const { color, font, lineLabel } = chartConfig;

/**
 * Default line label: the x-axis value as muted text, drawn from its top-left
 * corner. Pass a `label` for text, or `children` for any SVG in its place.
 */
export function DefaultLineLabel({
  label,
  children,
  color: fill = color.textMuted,
}: Readonly<DefaultLineLabelProps>) {
  return (
    <g fill={fill}>
      {children ?? (
        <text
          y={lineLabel.height / 2}
          dominantBaseline='central'
          style={{ fontSize: font.labelSize, fontFamily: font.family }}
        >
          {label}
        </text>
      )}
    </g>
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
      testId='scrubber-line-label'
      measureKey={dataIndex}
      placeX={(width) => computeLineLabelX(pixelX, width, drawingArea)}
      y={computeLineLabelY(drawingArea)}
    >
      {renderLabel ? (
        renderLabel(context)
      ) : (
        <DefaultLineLabel label={context.label} />
      )}
    </PositionedLabel>
  );
}

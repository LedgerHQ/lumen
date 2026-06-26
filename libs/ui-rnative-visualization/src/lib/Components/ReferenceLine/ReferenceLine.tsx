import { useTheme } from '@ledgerhq/lumen-ui-rnative';
import { G, Line as SvgLine, Text as SvgText } from 'react-native-svg';

import { useCartesianChartContext } from '../CartesianChart/context';

import {
  REFERENCE_LINE_DASH_ARRAY,
  REFERENCE_LINE_STROKE_WIDTH,
} from './constants';
import type { ReferenceLineProps } from './types';
import {
  computeHorizontalLabelCoordinates,
  computeVerticalLabelCoordinates,
  dominantBaselineToDy,
  resolvePixel,
} from './utils';

export function ReferenceLine({
  label,
  labelDx = 0,
  labelDy = 0,
  labelHorizontalAlignment,
  labelVerticalAlignment,
  labelPosition = 'end',
  stroke,
  lineStyle = 'dashed',
  ...props
}: Readonly<ReferenceLineProps>) {
  const { getXScale, getYScale, getXAxisConfig, getYAxisConfig, drawingArea } =
    useCartesianChartContext();
  const { theme } = useTheme();

  const resolvedStroke = stroke ?? theme.colors.border.muted;
  const dashArray =
    lineStyle === 'dashed' ? REFERENCE_LINE_DASH_ARRAY : undefined;
  const fontSize = theme.typographies.body4.fontSize;

  if (props.dataY !== undefined) {
    const yPixel = resolvePixel({
      dataValue: props.dataY,
      scale: getYScale(),
      axis: 'y',
      drawingArea,
      axisConfig: getYAxisConfig(),
    });
    if (yPixel === undefined) return null;

    const labelCoords = label
      ? computeHorizontalLabelCoordinates({
          pixel: yPixel,
          labelPosition,
          drawingArea,
          dx: labelDx,
          dy: labelDy,
          horizontalAlignment: labelHorizontalAlignment,
          verticalAlignment: labelVerticalAlignment,
        })
      : null;
    const baselineDy = labelCoords
      ? dominantBaselineToDy(labelCoords.dominantBaseline, fontSize)
      : 0;

    return (
      <G testID='reference-line'>
        <SvgLine
          testID='reference-line-line'
          x1={drawingArea.x}
          y1={yPixel}
          x2={drawingArea.x + drawingArea.width}
          y2={yPixel}
          stroke={resolvedStroke}
          strokeWidth={REFERENCE_LINE_STROKE_WIDTH}
          strokeDasharray={dashArray}
          strokeLinecap='round'
        />
        {labelCoords && (
          <SvgText
            testID='reference-line-label'
            x={labelCoords.x}
            y={labelCoords.y}
            dy={baselineDy}
            textAnchor={labelCoords.textAnchor}
            fill={theme.colors.text.muted}
            fontSize={fontSize}
            fontWeight={theme.typographies.body4.fontWeight}
            fontFamily={theme.fontFamilies.sans}
          >
            {label}
          </SvgText>
        )}
      </G>
    );
  }

  if (props.dataX !== undefined) {
    const xPixel = resolvePixel({
      dataValue: props.dataX,
      scale: getXScale(),
      axis: 'x',
      drawingArea,
      axisConfig: getXAxisConfig(),
    });
    if (xPixel === undefined) return null;

    const labelCoords = label
      ? computeVerticalLabelCoordinates({
          pixel: xPixel,
          labelPosition,
          drawingArea,
          dx: labelDx,
          dy: labelDy,
          horizontalAlignment: labelHorizontalAlignment,
          verticalAlignment: labelVerticalAlignment,
        })
      : null;
    const baselineDy = labelCoords
      ? dominantBaselineToDy(labelCoords.dominantBaseline, fontSize)
      : 0;

    return (
      <G testID='reference-line'>
        <SvgLine
          testID='reference-line-line'
          x1={xPixel}
          y1={drawingArea.y}
          x2={xPixel}
          y2={drawingArea.y + drawingArea.height}
          stroke={resolvedStroke}
          strokeWidth={REFERENCE_LINE_STROKE_WIDTH}
          strokeDasharray={dashArray}
          strokeLinecap='round'
        />
        {labelCoords && (
          <SvgText
            testID='reference-line-label'
            x={labelCoords.x}
            y={labelCoords.y}
            dy={baselineDy}
            textAnchor={labelCoords.textAnchor}
            fill={theme.colors.text.muted}
            fontSize={fontSize}
            fontWeight={theme.typographies.body4.fontWeight}
            fontFamily={theme.fontFamilies.sans}
          >
            {label}
          </SvgText>
        )}
      </G>
    );
  }

  return null;
}

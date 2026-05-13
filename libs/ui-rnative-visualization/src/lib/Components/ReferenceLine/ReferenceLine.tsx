import { useTheme } from '@ledgerhq/lumen-ui-rnative';
import { G, Line as SvgLine, Text as SvgText } from 'react-native-svg';

import { useCartesianChartContext } from '../CartesianChart/context';

import { DASH_ARRAY, STROKE_WIDTH } from './constants';
import type { ReferenceLineProps } from './types';
import {
  computeHorizontalLabelCoordinates,
  computeVerticalLabelCoordinates,
  resolvePixel,
} from './utils';

export function ReferenceLine({
  label,
  labelDx = 0,
  labelDy = 0,
  labelHorizontalAlignment,
  labelVerticalAlignment,
  stroke,
  lineStyle = 'dashed',
  opacity = 1,
  ...props
}: Readonly<ReferenceLineProps>) {
  const { getXScale, getYScale, drawingArea } = useCartesianChartContext();
  const { theme } = useTheme();

  const resolvedStroke = stroke ?? theme.colors.border.muted;
  const dashArray = lineStyle === 'dashed' ? DASH_ARRAY : undefined;

  if (props.dataY !== undefined) {
    const yPixel = resolvePixel(props.dataY, getYScale(), 'y', drawingArea);
    if (yPixel === undefined) return null;

    const labelCoords = label
      ? computeHorizontalLabelCoordinates(
          yPixel,
          props.labelPosition ?? 'right',
          drawingArea,
          labelDx,
          labelDy,
          labelHorizontalAlignment,
          labelVerticalAlignment,
        )
      : null;

    return (
      <G testID='reference-line'>
        <SvgLine
          testID='reference-line-line'
          x1={drawingArea.x}
          y1={yPixel}
          x2={drawingArea.x + drawingArea.width}
          y2={yPixel}
          stroke={resolvedStroke}
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={dashArray}
          strokeLinecap='round'
          opacity={opacity}
        />
        {labelCoords && (
          <SvgText
            testID='reference-line-label'
            x={labelCoords.x}
            y={labelCoords.y}
            textAnchor={labelCoords.textAnchor}
            // @ts-expect-error valid SVG attr, missing from react-native-svg types
            dominantBaseline={labelCoords.dominantBaseline}
            fill={theme.colors.text.muted}
            fontSize={theme.typographies.body4.fontSize}
            fontWeight={theme.typographies.body4.fontWeight}
            fontFamily={theme.fontFamilies.sans}
            opacity={opacity}
          >
            {label}
          </SvgText>
        )}
      </G>
    );
  }

  if (props.dataX !== undefined) {
    const xPixel = resolvePixel(props.dataX, getXScale(), 'x', drawingArea);
    if (xPixel === undefined) return null;

    const labelCoords = label
      ? computeVerticalLabelCoordinates(
          xPixel,
          props.labelPosition ?? 'top',
          drawingArea,
          labelDx,
          labelDy,
          labelHorizontalAlignment,
          labelVerticalAlignment,
        )
      : null;

    return (
      <G testID='reference-line'>
        <SvgLine
          testID='reference-line-line'
          x1={xPixel}
          y1={drawingArea.y}
          x2={xPixel}
          y2={drawingArea.y + drawingArea.height}
          stroke={resolvedStroke}
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={dashArray}
          strokeLinecap='round'
          opacity={opacity}
        />
        {labelCoords && (
          <SvgText
            testID='reference-line-label'
            x={labelCoords.x}
            y={labelCoords.y}
            textAnchor={labelCoords.textAnchor}
            // @ts-expect-error valid SVG attr, missing from react-native-svg types
            dominantBaseline={labelCoords.dominantBaseline}
            fill={theme.colors.text.muted}
            fontSize={theme.typographies.body4.fontSize}
            fontWeight={theme.typographies.body4.fontWeight}
            fontFamily={theme.fontFamilies.sans}
            opacity={opacity}
          >
            {label}
          </SvgText>
        )}
      </G>
    );
  }

  return null;
}

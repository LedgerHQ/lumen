import { useTheme } from '@ledgerhq/lumen-ui-rnative';
import { useMemo } from 'react';
import { Circle, G, Polygon, Text as SvgText } from 'react-native-svg';

import { projectPoint } from '../../utils/scales/scales';
import { useCartesianChartContext } from '../CartesianChart/context';

import type { PointProps } from './types';
import {
  buildArrowPoints,
  computeLabelY,
  DEFAULT_SIZE,
  isWithinBounds,
  resolveLabel,
  STROKE_WIDTH,
} from './utils';

export const Point = ({
  dataX,
  dataY,
  color,
  label,
  labelComponent,
  labelPosition = 'top',
  hidePoint = false,
  showLabelArrow = true,
  size = DEFAULT_SIZE,
  onPress,
}: Readonly<PointProps>) => {
  const { getXScale, getYScale, drawingArea } = useCartesianChartContext();
  const { theme } = useTheme();

  const xScale = getXScale();
  const yScale = getYScale();

  const radius = size / 2;
  const fill = color ?? theme.colors.bg.mutedStrong;
  const stroke = theme.colors.bg.canvas;
  const textColor = theme.colors.text.base;

  const pixel = useMemo(() => {
    if (!xScale || !yScale) return undefined;
    return projectPoint(dataX, dataY, xScale, yScale);
  }, [dataX, dataY, xScale, yScale]);

  if (!pixel || !isWithinBounds(pixel.x, pixel.y, drawingArea)) {
    return null;
  }

  const resolvedLabel = resolveLabel(label, dataX);
  const hasLabel = labelComponent != null || resolvedLabel != null;
  const renderArrow = showLabelArrow && hasLabel;
  const labelY = computeLabelY(pixel.y, radius, labelPosition, renderArrow);

  return (
    <G testID='point-group' onPress={onPress}>
      {!hidePoint && (
        <Circle
          testID='point-circle'
          cx={pixel.x}
          cy={pixel.y}
          r={radius}
          fill={fill}
          stroke={stroke}
          strokeWidth={STROKE_WIDTH}
        />
      )}
      {renderArrow && (
        <Polygon
          testID='point-arrow'
          points={buildArrowPoints(pixel.x, pixel.y, radius, labelPosition)}
          fill={textColor}
        />
      )}
      {labelComponent && (
        <G
          testID='point-label-wrapper'
          transform={`translate(${pixel.x}, ${labelY})`}
        >
          {labelComponent}
        </G>
      )}
      {!labelComponent && resolvedLabel != null && (
        <SvgText
          testID='point-label'
          x={pixel.x}
          y={labelY}
          textAnchor='middle'
          fill={textColor}
          fontSize={theme.typographies.body4.fontSize}
          fontWeight={theme.typographies.body4.fontWeight}
          fontFamily={theme.fontFamilies.sans}
        >
          {resolvedLabel}
        </SvgText>
      )}
    </G>
  );
};

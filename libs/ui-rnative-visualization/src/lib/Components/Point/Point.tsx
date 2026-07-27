import { memo } from 'react';
import Animated from 'react-native-reanimated';
import { Circle, G, Polygon, Text as SvgText } from 'react-native-svg';

import { chartConfig } from '../../config';
import { useChartTokens } from '../../theme';
import type {
  PointArrowProps,
  PointLabelProps,
  PointMarkerProps,
  PointProps,
} from './types';

import { usePointGeometry } from './usePointGeometry';
import { buildArrowPoints, computeLabelGeometry, resolveLabel } from './utils';

const AnimatedG = Animated.createAnimatedComponent(G);

export function PointLabel({
  textAnchor = 'middle',
  ...props
}: Readonly<PointLabelProps>) {
  const tokens = useChartTokens();

  return (
    <SvgText
      textAnchor={textAnchor}
      fill={tokens.color.text}
      fontSize={chartConfig.point.labelFontSize}
      fontWeight={tokens.font.labelWeight}
      fontFamily={tokens.font.family}
      {...props}
    />
  );
}

function PointMarker({ x, y, size, color }: Readonly<PointMarkerProps>) {
  const tokens = useChartTokens();
  const radius = size / 2;
  const fill = color ?? tokens.color.markFill;

  return (
    <Circle
      testID='point-circle'
      cx={x}
      cy={y}
      r={radius}
      fill={fill}
      stroke={tokens.color.markOutline}
      strokeWidth={tokens.stroke.line}
    />
  );
}

function PointArrow({ x, y, size, position }: Readonly<PointArrowProps>) {
  const tokens = useChartTokens();

  return (
    <Polygon
      testID='point-arrow'
      points={buildArrowPoints(x, y, size / 2, position)}
      fill={tokens.color.text}
    />
  );
}

export const Point = memo(function Point({
  dataX,
  dataY,
  color,
  label,
  LabelComponent,
  labelPosition = 'top',
  hidePoint = false,
  showLabelArrow = true,
  size = chartConfig.point.defaultSize,
  onPress,
  magnetic = false,
  labelAlignment = 'auto',
}: Readonly<PointProps>) {
  const { pixel, drawingArea, fadeProps, isVisible } = usePointGeometry({
    dataX,
    dataY,
    magnetic,
  });

  if (!isVisible || !pixel) {
    return null;
  }

  const labelText = resolveLabel(label, dataX);
  const isLabelVisible = labelText !== undefined;
  const labelGeometry = isLabelVisible
    ? computeLabelGeometry({
        text: labelText,
        pixelX: pixel.x,
        pixelY: pixel.y,
        size,
        labelPosition,
        showLabelArrow,
        area: drawingArea,
        alignment: labelAlignment,
      })
    : null;

  const Label = LabelComponent ?? PointLabel;

  return (
    <AnimatedG testID='point-group' onPress={onPress} animatedProps={fadeProps}>
      {!hidePoint && (
        <PointMarker x={pixel.x} y={pixel.y} size={size} color={color} />
      )}
      {isLabelVisible && showLabelArrow && (
        <PointArrow
          x={pixel.x}
          y={pixel.y}
          size={size}
          position={labelPosition}
        />
      )}
      {labelText != null && labelGeometry && (
        <Label
          x={labelGeometry.x}
          y={labelGeometry.y}
          textAnchor={labelGeometry.textAnchor}
        >
          {labelText}
        </Label>
      )}
    </AnimatedG>
  );
});

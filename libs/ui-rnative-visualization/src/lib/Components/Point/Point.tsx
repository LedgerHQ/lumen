import { useTheme } from '@ledgerhq/lumen-ui-rnative';
import Animated from 'react-native-reanimated';
import { Circle, G, Polygon, Text as SvgText } from 'react-native-svg';

import { DEFAULT_SIZE, STROKE_WIDTH } from './constants';
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
  const { theme } = useTheme();

  return (
    <SvgText
      textAnchor={textAnchor}
      fill={theme.colors.text.base}
      fontSize={theme.typographies.body4.fontSize}
      fontWeight={theme.typographies.body4.fontWeight}
      fontFamily={theme.fontFamilies.sans}
      {...props}
    />
  );
}

function PointMarker({ x, y, size, color }: Readonly<PointMarkerProps>) {
  const { theme } = useTheme();
  const radius = size / 2;
  const fill = color ?? theme.colors.bg.mutedStrong;

  return (
    <Circle
      testID='point-circle'
      cx={x}
      cy={y}
      r={radius}
      fill={fill}
      stroke={theme.colors.bg.canvas}
      strokeWidth={STROKE_WIDTH}
    />
  );
}

function PointArrow({ x, y, size, position }: Readonly<PointArrowProps>) {
  const { theme } = useTheme();

  return (
    <Polygon
      testID='point-arrow'
      points={buildArrowPoints(x, y, size / 2, position)}
      fill={theme.colors.text.base}
    />
  );
}

export function Point({
  dataX,
  dataY,
  color,
  label,
  LabelComponent,
  labelPosition = 'top',
  hidePoint = false,
  showLabelArrow = true,
  size = DEFAULT_SIZE,
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
      {labelGeometry?.renderArrow && (
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
}

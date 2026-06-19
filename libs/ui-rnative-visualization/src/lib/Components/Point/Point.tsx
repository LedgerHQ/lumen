import { useTheme } from '@ledgerhq/lumen-ui-rnative';
import { useMemo } from 'react';
import Animated from 'react-native-reanimated';
import { Circle, G, Polygon, Text as SvgText } from 'react-native-svg';

import { projectPoint } from '../../utils/scales/scales';
import { useCartesianChartContext } from '../CartesianChart/context';
import { useRevealFadeProps } from '../CartesianChart/RevealAnimation';
import { DEFAULT_SIZE, STROKE_WIDTH } from './constants';
import { useMagneticPointsContext } from './pointContext';

import type { PointLabelProps, PointProps } from './types';
import {
  buildArrowPoints,
  computeLabelY,
  isWithinBounds,
  resolveLabel,
  useMagneticRegistration,
} from './utils';

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
}: Readonly<PointProps>) {
  const { getXScale, getYScale, getXAxisConfig, drawingArea } =
    useCartesianChartContext();
  const fadeProps = useRevealFadeProps();
  const magneticContext = useMagneticPointsContext();

  useMagneticRegistration(magnetic, dataX, getXAxisConfig, magneticContext);
  const { theme } = useTheme();

  const xScale = getXScale();
  const yScale = getYScale();

  const radius = size / 2;
  const fill = color ?? theme.colors.bg.mutedStrong;

  const pixel = useMemo(() => {
    if (!xScale || !yScale) return undefined;
    return projectPoint(dataX, dataY, xScale, yScale);
  }, [dataX, dataY, xScale, yScale]);

  if (!pixel || !isWithinBounds(pixel.x, pixel.y, drawingArea)) {
    return null;
  }

  const resolvedLabel = resolveLabel(label, dataX);
  const hasLabel = resolvedLabel !== undefined;
  const renderArrow = showLabelArrow && hasLabel;
  const labelY = computeLabelY(pixel.y, radius, labelPosition, renderArrow);

  const Label = LabelComponent ?? PointLabel;

  return (
    <AnimatedG testID='point-group' onPress={onPress} animatedProps={fadeProps}>
      {!hidePoint && (
        <Circle
          testID='point-circle'
          cx={pixel.x}
          cy={pixel.y}
          r={radius}
          fill={fill}
          stroke={theme.colors.bg.canvas}
          strokeWidth={STROKE_WIDTH}
        />
      )}
      {renderArrow && (
        <Polygon
          testID='point-arrow'
          points={buildArrowPoints(pixel.x, pixel.y, radius, labelPosition)}
          fill={theme.colors.text.base}
        />
      )}
      {resolvedLabel !== undefined && (
        <Label x={pixel.x} y={labelY}>
          {resolvedLabel}
        </Label>
      )}
    </AnimatedG>
  );
}

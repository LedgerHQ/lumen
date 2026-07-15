import { memo } from 'react';

import { chartConfig } from '../../config';
import type {
  PointArrowProps,
  PointLabelProps,
  PointMarkerProps,
  PointProps,
} from './types';

import { usePointGeometry } from './usePointGeometry';
import { buildArrowPoints, computeLabelGeometry, resolveLabel } from './utils';

export function PointLabel({
  style,
  textAnchor = 'middle',
  dominantBaseline = 'auto',
  ...props
}: Readonly<PointLabelProps>) {
  return (
    <text
      textAnchor={textAnchor}
      dominantBaseline={dominantBaseline}
      style={{
        fill: chartConfig.color.text,
        fontSize: chartConfig.point.labelFontSize,
        fontWeight: chartConfig.font.labelWeightMedium,
        fontFamily: chartConfig.font.family,
        ...style,
      }}
      {...props}
    />
  );
}

function PointMarker({ x, y, size, color }: Readonly<PointMarkerProps>) {
  const radius = size / 2;
  const fill = color ?? chartConfig.point.defaultColor;

  return (
    <circle
      data-testid='point-circle'
      cx={x}
      cy={y}
      r={radius}
      style={{
        fill,
        stroke: chartConfig.color.markOutline,
      }}
      strokeWidth={chartConfig.point.strokeWidth}
    />
  );
}

function PointArrow({ x, y, size, position }: Readonly<PointArrowProps>) {
  return (
    <polygon
      data-testid='point-arrow'
      points={buildArrowPoints(x, y, size / 2, position)}
      style={{ fill: chartConfig.color.text }}
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
  onClick,
  magnetic = false,
  labelAlignment = 'auto',
}: Readonly<PointProps>) {
  const { pixel, drawingArea, revealStyle, isVisible } = usePointGeometry({
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
    <g
      data-testid='point-group'
      onClick={onClick}
      style={{
        ...revealStyle,
        ...(onClick ? { cursor: 'pointer' } : undefined),
      }}
    >
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
    </g>
  );
});

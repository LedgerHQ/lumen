import { cssVar } from '@ledgerhq/lumen-design-core';

import { DEFAULT_SIZE, LABEL_FONT_SIZE, STROKE_WIDTH } from './constants';
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
        fill: cssVar('var(--text-base)'),
        fontSize: LABEL_FONT_SIZE,
        fontWeight: cssVar('var(--font-style-body-4-weight-medium)'),
        fontFamily: cssVar('var(--font-family-font)'),
        ...style,
      }}
      {...props}
    />
  );
}

function PointMarker({ x, y, size, color }: Readonly<PointMarkerProps>) {
  const radius = size / 2;
  const fill = color ?? cssVar('var(--background-muted-strong)');

  return (
    <circle
      data-testid='point-circle'
      cx={x}
      cy={y}
      r={radius}
      style={{
        fill,
        stroke: cssVar('var(--background-canvas)'),
      }}
      strokeWidth={STROKE_WIDTH}
    />
  );
}

function PointArrow({ x, y, size, position }: Readonly<PointArrowProps>) {
  return (
    <polygon
      data-testid='point-arrow'
      points={buildArrowPoints(x, y, size / 2, position)}
      style={{ fill: cssVar('var(--text-base)') }}
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
}

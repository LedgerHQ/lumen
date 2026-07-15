import { chartConfig } from '../../config';

import type { ReferenceLineProps } from './types';
import { useReferenceLineGeometry } from './useReferenceLineGeometry';

const { color, font, referenceLine } = chartConfig;

const labelStyle = {
  fill: color.textMuted,
  fontSize: font.labelSize,
  fontWeight: font.labelWeightMedium,
  fontFamily: font.family,
};

export function ReferenceLine(props: Readonly<ReferenceLineProps>) {
  const geometry = useReferenceLineGeometry(props);

  const { label, stroke = color.stroke, lineStyle = 'dashed' } = props;
  const dashArray =
    lineStyle === 'dashed' ? referenceLine.dashArray : undefined;

  if (!geometry) return null;

  const { linePoints, labelCoords } = geometry;

  return (
    <g data-testid='reference-line'>
      <line
        data-testid='reference-line-line'
        {...linePoints}
        stroke={stroke}
        strokeWidth={referenceLine.strokeWidth}
        strokeDasharray={dashArray}
        strokeLinecap='round'
      />
      {labelCoords && (
        <text
          data-testid='reference-line-label'
          x={labelCoords.x}
          y={labelCoords.y}
          textAnchor={labelCoords.textAnchor}
          dominantBaseline={labelCoords.dominantBaseline}
          style={labelStyle}
        >
          {label}
        </text>
      )}
    </g>
  );
}

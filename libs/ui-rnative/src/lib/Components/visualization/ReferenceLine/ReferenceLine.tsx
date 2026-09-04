import { G, Line as SvgLine, Text as SvgText } from 'react-native-svg';

import { chartConfig, useChartTokens } from '../config';
import type { ReferenceLineProps } from './types';
import { useReferenceLineGeometry } from './useReferenceLineGeometry';
import { dominantBaselineToDy } from './utils';

export function ReferenceLine(props: Readonly<ReferenceLineProps>) {
  const tokens = useChartTokens();
  const geometry = useReferenceLineGeometry(props);

  const { label, stroke, lineStyle = 'dashed' } = props;
  const resolvedStroke = stroke ?? tokens.color.stroke;
  const dashArray =
    lineStyle === 'dashed' ? chartConfig.referenceLine.dashArray : undefined;
  const fontSize = tokens.font.labelSize;

  if (!geometry) return null;

  const { linePoints, labelCoords } = geometry;
  const baselineDy = labelCoords
    ? dominantBaselineToDy(labelCoords.dominantBaseline, fontSize)
    : 0;

  return (
    <G testID='reference-line'>
      <SvgLine
        testID='reference-line-line'
        {...linePoints}
        stroke={resolvedStroke}
        strokeWidth={tokens.stroke.line}
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
          fill={tokens.color.textMuted}
          fontSize={fontSize}
          fontWeight={tokens.font.labelWeightMedium}
          fontFamily={tokens.font.family}
        >
          {label}
        </SvgText>
      )}
    </G>
  );
}

import { useTheme } from '@ledgerhq/lumen-ui-rnative';
import { G, Line as SvgLine, Text as SvgText } from 'react-native-svg';

import {
  REFERENCE_LINE_DASH_ARRAY,
  REFERENCE_LINE_STROKE_WIDTH,
} from './constants';
import type { ReferenceLineProps } from './types';
import { useReferenceLineGeometry } from './useReferenceLineGeometry';
import { dominantBaselineToDy } from './utils';

export function ReferenceLine(props: Readonly<ReferenceLineProps>) {
  const { theme } = useTheme();
  const geometry = useReferenceLineGeometry(props);

  const { label, stroke, lineStyle = 'dashed' } = props;
  const resolvedStroke = stroke ?? theme.colors.border.muted;
  const dashArray =
    lineStyle === 'dashed' ? REFERENCE_LINE_DASH_ARRAY : undefined;
  const fontSize = theme.typographies.body4.fontSize;

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

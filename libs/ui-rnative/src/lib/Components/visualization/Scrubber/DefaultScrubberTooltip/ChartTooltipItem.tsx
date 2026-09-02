import { memo } from 'react';
import { G, Text as SvgText } from 'react-native-svg';

import { chartConfig, useChartTokens } from '../../config';
import type { ChartTooltipItemProps } from '../types';

/**
 * Memoized so it only re-renders when one of its primitive props actually
 * changes. Combined with the stable per-index ref callbacks built in
 * `DefaultScrubberTooltip`, this keeps the row out of the per-scrub-frame
 * reconciliation path when its label / value / position have not changed.
 */
export const ChartTooltipItem = memo(function ChartTooltipItem({
  label,
  value,
  x = 0,
  y = 0,
  width,
  labelRef,
  valueRef,
}: Readonly<ChartTooltipItemProps>) {
  const tokens = useChartTokens();

  return (
    <G>
      <SvgText
        ref={labelRef}
        x={x + chartConfig.tooltip.paddingX}
        y={y}
        textAnchor='start'
        alignmentBaseline='central'
        fill={tokens.color.textMuted}
        fontSize={tokens.font.bodySize}
        fontFamily={tokens.font.family}
      >
        {String(label)}
      </SvgText>
      <SvgText
        ref={valueRef}
        x={x + width - chartConfig.tooltip.paddingX}
        y={y}
        textAnchor='end'
        alignmentBaseline='central'
        fill={tokens.color.text}
        fontSize={tokens.font.bodySize}
        fontWeight={tokens.font.bodyWeightSemiBold}
        fontFamily={tokens.font.family}
      >
        {String(value)}
      </SvgText>
    </G>
  );
});

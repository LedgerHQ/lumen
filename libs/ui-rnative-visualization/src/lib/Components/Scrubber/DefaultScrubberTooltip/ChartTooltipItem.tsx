import { useTheme } from '@ledgerhq/lumen-ui-rnative';
import { memo } from 'react';
import { G, Text as SvgText } from 'react-native-svg';

import type { ChartTooltipItemProps } from '../types';
import { PADDING_X } from './constants';

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
  const { theme } = useTheme();

  return (
    <G>
      <SvgText
        ref={labelRef}
        x={x + PADDING_X}
        y={y}
        textAnchor='start'
        alignmentBaseline='central'
        fill={theme.colors.text.muted}
        fontSize={theme.typographies.body4.fontSize}
        fontFamily={theme.fontFamilies.sans}
      >
        {String(label)}
      </SvgText>
      <SvgText
        ref={valueRef}
        x={x + width - PADDING_X}
        y={y}
        textAnchor='end'
        alignmentBaseline='central'
        fill={theme.colors.text.base}
        fontSize={theme.typographies.body4.fontSize}
        fontWeight={theme.typographies.body4.fontWeight}
        fontFamily={theme.fontFamilies.sans}
      >
        {String(value)}
      </SvgText>
    </G>
  );
});

import { useTheme } from '@ledgerhq/lumen-ui-rnative';
import { G, Text as SvgText } from 'react-native-svg';

import type { ChartTooltipItemProps } from '../types';
import { PADDING_X } from './constants';

export function ChartTooltipItem({
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
}

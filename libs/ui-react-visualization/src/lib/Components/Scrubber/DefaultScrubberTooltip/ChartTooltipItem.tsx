import { cssVar } from '@ledgerhq/lumen-design-core';

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
  return (
    <g>
      <text
        ref={labelRef}
        x={x + PADDING_X}
        y={y}
        dominantBaseline='middle'
        style={{
          fontSize: cssVar('var(--font-style-body-4-size)'),
          fontFamily: cssVar('var(--font-family-font)'),
          fill: cssVar('var(--text-muted)'),
        }}
      >
        {label}
      </text>
      <text
        ref={valueRef}
        x={x + width - PADDING_X}
        y={y}
        dominantBaseline='middle'
        textAnchor='end'
        style={{
          fontSize: cssVar('var(--font-style-body-4-size)'),
          fontFamily: cssVar('var(--font-family-font)'),
          fill: cssVar('var(--text-base)'),
          fontWeight: cssVar('var(--font-style-body-4-weight-medium)'),
        }}
      >
        {value}
      </text>
    </g>
  );
}

import { cssVar } from '@ledgerhq/lumen-design-core';

import { PADDING_X } from './constants';
import type { ChartTooltipItemProps } from './types';

export function ChartTooltipItem({
  title,
  value,
  x = 0,
  y = 0,
  width,
}: Readonly<ChartTooltipItemProps>) {
  return (
    <g>
      <text
        x={x + PADDING_X}
        y={y}
        dominantBaseline='middle'
        style={{
          fontSize: cssVar('var(--font-style-body-4-size)'),
          fontFamily: cssVar('var(--font-family-font)'),
          fill: cssVar('var(--text-muted)'),
        }}
      >
        {title}
      </text>
      <text
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

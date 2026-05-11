import { cssVar } from '@ledgerhq/lumen-design-core';

import type { ChartTooltipItemProps } from './types';

const PADDING_X = 8;

const BASE_TEXT_STYLE = {
  fontSize: cssVar('var(--font-style-body-4-size)'),
  fontFamily: cssVar('var(--font-family-font)'),
} as const;

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
          ...BASE_TEXT_STYLE,
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
          ...BASE_TEXT_STYLE,
          fill: cssVar('var(--text-base)'),
          fontWeight: cssVar('var(--font-style-body-4-weight-medium)'),
        }}
      >
        {value}
      </text>
    </g>
  );
}

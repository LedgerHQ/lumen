import { cssVar } from '@ledgerhq/lumen-design-core';
import { memo } from 'react';

import type { ChartTooltipItemProps } from '../types';
import { PADDING_X } from './constants';

const LABEL_STYLE = {
  fontSize: cssVar('var(--font-style-body-3-size)'),
  fontFamily: cssVar('var(--font-family-font)'),
  fill: cssVar('var(--text-muted)'),
};

const VALUE_STYLE = {
  fontSize: cssVar('var(--font-style-body-3-size)'),
  fontFamily: cssVar('var(--font-family-font)'),
  fill: cssVar('var(--text-base)'),
  fontWeight: cssVar('var(--font-style-body-3-weight-semi-bold)'),
};

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
  return (
    <g>
      <text
        ref={labelRef}
        x={x + PADDING_X}
        y={y}
        dominantBaseline='middle'
        style={LABEL_STYLE}
      >
        {label}
      </text>
      <text
        ref={valueRef}
        x={x + width - PADDING_X}
        y={y}
        dominantBaseline='middle'
        textAnchor='end'
        style={VALUE_STYLE}
      >
        {value}
      </text>
    </g>
  );
});

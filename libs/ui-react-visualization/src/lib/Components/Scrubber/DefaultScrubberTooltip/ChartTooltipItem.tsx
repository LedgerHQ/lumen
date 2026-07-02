import { memo } from 'react';

import { chartConfig } from '../../../config';
import type { ChartTooltipItemProps } from '../types';

const { color, font, tooltip } = chartConfig;

const LABEL_STYLE = {
  fontSize: font.bodySize,
  fontFamily: font.family,
  fill: color.textMuted,
};

const VALUE_STYLE = {
  fontSize: font.bodySize,
  fontFamily: font.family,
  fill: color.text,
  fontWeight: font.bodyWeightSemiBold,
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
        x={x + tooltip.paddingX}
        y={y}
        dominantBaseline='middle'
        style={LABEL_STYLE}
      >
        {label}
      </text>
      <text
        ref={valueRef}
        x={x + width - tooltip.paddingX}
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

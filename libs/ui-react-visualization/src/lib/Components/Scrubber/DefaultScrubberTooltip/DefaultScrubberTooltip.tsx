import { cssVar } from '@ledgerhq/lumen-design-core';

import type { ChartTooltipItemData, ScrubberTooltipProps } from '../types';
import { ChartTooltipItem } from './ChartTooltipItem';
import {
  BORDER_RADIUS,
  DEFAULT_OFFSET,
  DEFAULT_TOOLTIP_WIDTH,
  PADDING_X,
  PADDING_Y,
  ROW_GAP,
  ROW_HEIGHT,
  TITLE_GAP,
  TOOLTIP_TRANSITION,
} from './constants';

const TOOLTIP_GROUP_STYLE = {
  opacity: 1,
  transition: TOOLTIP_TRANSITION,
  pointerEvents: 'none' as const,
};

const TITLE_STYLE = {
  fontSize: cssVar('var(--font-style-body-4-size)'),
  fontFamily: cssVar('var(--font-family-font)'),
  fill: cssVar('var(--text-base)'),
  fontWeight: cssVar('var(--font-style-body-4-weight-medium)'),
};

/**
 * Default structured tooltip anchored to the scrubber line.
 *
 * Use with {@link ScrubberProps.tooltip}. Layout options belong on the object
 * returned from the `tooltip` callback (`offset`, `tooltipWidth`).
 * To hide at specific indices, return `{ items: [] }` from the `tooltip` callback.
 */
export function DefaultScrubberTooltip({
  pixelX,
  drawingArea,
  title,
  items,
  offset = DEFAULT_OFFSET,
  tooltipWidth = DEFAULT_TOOLTIP_WIDTH,
}: Readonly<ScrubberTooltipProps>) {
  const resolvedItems: ChartTooltipItemData[] = items;
  if (resolvedItems.length === 0) {
    return null;
  }

  const hasTitle = title !== undefined && title !== null;

  const shouldFlip =
    pixelX + offset + tooltipWidth > drawingArea.x + drawingArea.width;

  const tooltipX = Math.max(
    drawingArea.x,
    shouldFlip ? pixelX - offset - tooltipWidth : pixelX + offset,
  );

  const titleBlockHeight = hasTitle ? ROW_HEIGHT + TITLE_GAP : 0;

  const tooltipHeight =
    PADDING_Y * 2 +
    titleBlockHeight +
    resolvedItems.length * ROW_HEIGHT +
    (resolvedItems.length - 1) * ROW_GAP;

  const itemsBaseY = drawingArea.y + PADDING_Y + titleBlockHeight;

  return (
    <g data-testid='chart-tooltip' role='tooltip' style={TOOLTIP_GROUP_STYLE}>
      <rect
        x={tooltipX}
        y={drawingArea.y}
        width={tooltipWidth}
        height={tooltipHeight}
        rx={BORDER_RADIUS}
        fill={cssVar('var(--background-muted)')}
      />
      {hasTitle && (
        <text
          data-testid='chart-tooltip-title'
          x={tooltipX + PADDING_X}
          y={drawingArea.y + PADDING_Y + ROW_HEIGHT / 2}
          dominantBaseline='middle'
          style={TITLE_STYLE}
        >
          {title}
        </text>
      )}
      {resolvedItems.map((item, i) => (
        <ChartTooltipItem
          key={i}
          label={item.label}
          value={item.value}
          x={tooltipX}
          y={itemsBaseY + i * (ROW_HEIGHT + ROW_GAP) + ROW_HEIGHT / 2}
          width={tooltipWidth}
        />
      ))}
    </g>
  );
}

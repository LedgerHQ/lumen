import { cssVar } from '@ledgerhq/lumen-design-core';

import { useCartesianChartContext } from '../CartesianChart/context';
import { useScrubberContext } from '../Scrubber/context';
import { resolvePixelX } from '../Scrubber/utils';
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
import type { ChartTooltipItemData, ChartTooltipProps } from './types';

const HIDDEN_TOOLTIP = (
  <g
    data-testid='chart-tooltip'
    role='tooltip'
    aria-hidden='true'
    style={{ opacity: 0, pointerEvents: 'none', transition: 'none' }}
  />
);

/**
 * Renders a structured tooltip anchored to the scrubber line.
 *
 * Visible at every scrubber position by default. To limit which positions
 * show a tooltip, return an empty array from `items` for unwanted indices.
 *
 * Must be used as a child of `LineChart` (or `CartesianChart`) with
 * `enableScrubbing` enabled.
 *
 * @example
 * ```tsx
 * <LineChart series={series} enableScrubbing>
 *   <Scrubber />
 *   <ChartTooltip
 *     title={(i) => `${count[i]} Transactions`}
 *     items={(i) => [{ title: 'Index', value: i }]}
 *   />
 * </LineChart>
 * ```
 */
export function ChartTooltip({
  title,
  items,
  offset = DEFAULT_OFFSET,
  side = 'auto',
  tooltipWidth = DEFAULT_TOOLTIP_WIDTH,
}: Readonly<ChartTooltipProps>) {
  const { scrubberPosition } = useScrubberContext();
  const { getXScale, getXAxisConfig, drawingArea } = useCartesianChartContext();

  if (scrubberPosition === undefined) return HIDDEN_TOOLTIP;

  const pixelX = resolvePixelX(scrubberPosition, getXScale, getXAxisConfig());
  const resolvedItems: ChartTooltipItemData[] = items(scrubberPosition);

  if (pixelX === undefined || resolvedItems.length === 0) return HIDDEN_TOOLTIP;

  const resolvedTitle =
    typeof title === 'function' ? title(scrubberPosition) : title;
  const hasTitle = resolvedTitle !== undefined && resolvedTitle !== null;

  const shouldFlip =
    side === 'left' ||
    (side === 'auto' &&
      pixelX + offset + tooltipWidth > drawingArea.x + drawingArea.width);

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
    <g
      data-testid='chart-tooltip'
      role='tooltip'
      style={{
        opacity: 1,
        transition: TOOLTIP_TRANSITION,
        pointerEvents: 'none',
      }}
    >
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
          style={{
            fontSize: cssVar('var(--font-style-body-4-size)'),
            fontFamily: cssVar('var(--font-family-font)'),
            fill: cssVar('var(--text-base)'),
            fontWeight: cssVar('var(--font-style-body-4-weight-medium)'),
          }}
        >
          {resolvedTitle}
        </text>
      )}
      {resolvedItems.map((item, i) => (
        <ChartTooltipItem
          key={i}
          title={item.title}
          value={item.value}
          x={tooltipX}
          y={itemsBaseY + i * (ROW_HEIGHT + ROW_GAP) + ROW_HEIGHT / 2}
          width={tooltipWidth}
        />
      ))}
    </g>
  );
}

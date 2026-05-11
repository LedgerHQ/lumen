import { cssVar } from '@ledgerhq/lumen-design-core';

import { useCartesianChartContext } from '../CartesianChart/context';
import { useScrubberContext } from '../Scrubber/context';
import { resolvePixelX } from '../Scrubber/utils';
import { ChartTooltipItem } from './ChartTooltipItem';
import type { ChartTooltipItemData, ChartTooltipProps } from './types';

const DEFAULT_OFFSET = 10;
const DEFAULT_TOOLTIP_WIDTH = 120;
const PADDING_Y = 8;
const ROW_HEIGHT = 16;
const ROW_GAP = 6;
const BORDER_RADIUS = 4;
const TOOLTIP_TRANSITION = 'opacity 0.15s ease-out 0.05s';

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
 *   <ChartTooltip items={(i) => [{ title: 'Index', value: i }]} />
 * </LineChart>
 * ```
 */
export function ChartTooltip({
  items,
  offset = DEFAULT_OFFSET,
  side = 'auto',
  tooltipWidth = DEFAULT_TOOLTIP_WIDTH,
}: ChartTooltipProps) {
  const { scrubberPosition } = useScrubberContext();
  const { getXScale, drawingArea } = useCartesianChartContext();

  const hiddenTooltip = (
    <g
      data-testid='chart-tooltip'
      style={{ opacity: 0, pointerEvents: 'none', transition: 'none' }}
    />
  );

  if (scrubberPosition === undefined) return hiddenTooltip;

  const pixelX = resolvePixelX(scrubberPosition, getXScale);
  const resolvedItems: ChartTooltipItemData[] = items(scrubberPosition);

  if (pixelX === undefined || resolvedItems.length === 0) return hiddenTooltip;

  const shouldFlip =
    side === 'left' ||
    (side === 'auto' &&
      pixelX + offset + tooltipWidth > drawingArea.x + drawingArea.width);

  const tooltipX = Math.max(
    drawingArea.x,
    shouldFlip ? pixelX - offset - tooltipWidth : pixelX + offset,
  );

  const tooltipHeight =
    PADDING_Y * 2 +
    resolvedItems.length * ROW_HEIGHT +
    (resolvedItems.length - 1) * ROW_GAP;

  const ariaLabel = resolvedItems
    .map((item) => `${String(item.title)}: ${String(item.value)}`)
    .join(', ');

  return (
    <g
      data-testid='chart-tooltip'
      role='tooltip'
      aria-label={ariaLabel}
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
      {resolvedItems.map((item, i) => (
        <ChartTooltipItem
          key={`${String(item.title)}-${i}`}
          title={item.title}
          value={item.value}
          x={tooltipX}
          y={
            drawingArea.y +
            PADDING_Y +
            i * (ROW_HEIGHT + ROW_GAP) +
            ROW_HEIGHT / 2
          }
          width={tooltipWidth}
        />
      ))}
    </g>
  );
}

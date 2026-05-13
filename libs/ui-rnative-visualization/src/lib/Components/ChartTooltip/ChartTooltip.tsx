import { useTheme } from '@ledgerhq/lumen-ui-rnative';
import { useMemo } from 'react';
import { G, Rect, Text as SvgText } from 'react-native-svg';

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
} from './constants';
import type { ChartTooltipItemData, ChartTooltipProps } from './types';

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
 *     items={(i) => [{ label: 'Index', value: i }]}
 *   />
 * </LineChart>
 * ```
 */
export function ChartTooltip({
  title,
  items,
  offset = DEFAULT_OFFSET,
  tooltipWidth = DEFAULT_TOOLTIP_WIDTH,
}: Readonly<ChartTooltipProps>) {
  const { theme } = useTheme();
  const { scrubberPosition } = useScrubberContext();
  const { getXScale, getXAxisConfig, drawingArea } = useCartesianChartContext();

  const pixelX = useMemo(() => {
    if (scrubberPosition === undefined) return undefined;
    return resolvePixelX(scrubberPosition, getXScale, getXAxisConfig());
  }, [scrubberPosition, getXScale, getXAxisConfig]);

  const resolvedItems = useMemo<ChartTooltipItemData[]>(() => {
    if (scrubberPosition === undefined) return [];
    return items(scrubberPosition);
  }, [scrubberPosition, items]);

  const resolvedTitle = useMemo(() => {
    if (scrubberPosition === undefined) return undefined;
    return typeof title === 'function' ? title(scrubberPosition) : title;
  }, [scrubberPosition, title]);

  if (scrubberPosition === undefined || pixelX === undefined) {
    return null;
  }

  if (resolvedItems.length === 0) {
    return null;
  }

  const hasTitle = resolvedTitle !== undefined && resolvedTitle !== null;

  const shouldFlip =
    pixelX + offset + tooltipWidth > drawingArea.x + drawingArea.width;

  const preferredTooltipX = shouldFlip
    ? pixelX - offset - tooltipWidth
    : pixelX + offset;
  const maxTooltipX = Math.max(
    drawingArea.x,
    drawingArea.x + drawingArea.width - tooltipWidth,
  );
  const tooltipX = Math.min(
    maxTooltipX,
    Math.max(drawingArea.x, preferredTooltipX),
  );

  const titleBlockHeight = hasTitle ? ROW_HEIGHT + TITLE_GAP : 0;

  const tooltipHeight =
    PADDING_Y * 2 +
    titleBlockHeight +
    resolvedItems.length * ROW_HEIGHT +
    (resolvedItems.length - 1) * ROW_GAP;

  const itemsBaseY = drawingArea.y + PADDING_Y + titleBlockHeight;

  return (
    <G testID='chart-tooltip'>
      <Rect
        testID='chart-tooltip-rect'
        x={tooltipX}
        y={drawingArea.y}
        width={tooltipWidth}
        height={tooltipHeight}
        rx={BORDER_RADIUS}
        fill={theme.colors.bg.muted}
      />
      {hasTitle && (
        <SvgText
          testID='chart-tooltip-title'
          x={tooltipX + PADDING_X}
          y={drawingArea.y + PADDING_Y + ROW_HEIGHT / 2}
          alignmentBaseline='central'
          fill={theme.colors.text.base}
          fontSize={theme.typographies.body4.fontSize}
          fontWeight={theme.typographies.body4.fontWeight}
          fontFamily={theme.fontFamilies.sans}
        >
          {String(resolvedTitle)}
        </SvgText>
      )}
      {resolvedItems.map((item: ChartTooltipItemData, i: number) => (
        <ChartTooltipItem
          key={i}
          label={item.label}
          value={item.value}
          x={tooltipX}
          y={itemsBaseY + i * (ROW_HEIGHT + ROW_GAP) + ROW_HEIGHT / 2}
          width={tooltipWidth}
        />
      ))}
    </G>
  );
}

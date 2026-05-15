import { useTheme } from '@ledgerhq/lumen-ui-rnative';
import { G, Rect, Text as SvgText } from 'react-native-svg';

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
} from './constants';

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
  const { theme } = useTheme();

  const resolvedItems: ChartTooltipItemData[] = items;
  if (resolvedItems.length === 0) {
    return null;
  }

  const hasTitle = title !== undefined && title !== null;

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
          {String(title)}
        </SvgText>
      )}
      {resolvedItems.map((item, i) => (
        <ChartTooltipItem
          key={`${item.label}-${item.value}`}
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

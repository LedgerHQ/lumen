import { useTheme } from '@ledgerhq/lumen-ui-rnative';
import { G, Rect, Text as SvgText } from 'react-native-svg';

import type { ScrubberTooltipProps } from '../types';
import { ChartTooltipItem } from './ChartTooltipItem';
import {
  BORDER_RADIUS,
  DEFAULT_OFFSET,
  DEFAULT_TOOLTIP_MIN_WIDTH,
  PADDING_X,
  PADDING_Y,
  ROW_GAP,
  ROW_HEIGHT,
} from './constants';
import {
  computeItemsBaseY,
  computeTooltipHeight,
  computeTooltipWidth,
  computeTooltipX,
  useTooltipMeasurement,
} from './utils';

/**
 * Default structured tooltip anchored to the scrubber line.
 *
 * The tooltip auto-fits its width to the rendered content via `getBBox`,
 * with `minWidth` acting as an optional minimum width override. Use with
 * {@link ScrubberProps.tooltip}; layout options (`offset`, `minWidth`) belong
 * on the object returned from the `tooltip` callback. Return `{ items: [] }`
 * from the callback to hide the tooltip at a given index.
 */
export function DefaultScrubberTooltip({
  pixelX,
  drawingArea,
  title,
  items,
  offset = DEFAULT_OFFSET,
  minWidth = DEFAULT_TOOLTIP_MIN_WIDTH,
}: Readonly<ScrubberTooltipProps>) {
  const { theme } = useTheme();

  const hasTitle = title !== undefined && title !== null;

  const { widths, titleRef, labelRefs, valueRefs } = useTooltipMeasurement(
    items,
    hasTitle,
    title,
  );

  if (items.length === 0) {
    return null;
  }

  const tooltipWidth = computeTooltipWidth(widths, hasTitle, minWidth);
  const tooltipX = computeTooltipX(pixelX, offset, tooltipWidth, drawingArea);
  const tooltipHeight = computeTooltipHeight(items.length, hasTitle);
  const itemsBaseY = computeItemsBaseY(drawingArea.y, hasTitle);

  return (
    <G testID='chart-tooltip' opacity={widths === null ? 0 : 1}>
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
          ref={(el) => {
            titleRef.current = el as unknown as (typeof titleRef)['current'];
          }}
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
      {items.map((item, i) => (
        <ChartTooltipItem
          key={`${item.label}-${item.value}-${i}`}
          label={item.label}
          value={item.value}
          x={tooltipX}
          y={itemsBaseY + i * (ROW_HEIGHT + ROW_GAP) + ROW_HEIGHT / 2}
          width={tooltipWidth}
          labelRef={(el) => {
            labelRefs.current[i] = el;
          }}
          valueRef={(el) => {
            valueRefs.current[i] = el;
          }}
        />
      ))}
    </G>
  );
}

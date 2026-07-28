import { G, Rect, Text as SvgText } from 'react-native-svg';

import { chartConfig, useChartTokens } from '../../../config';
import type { ScrubberTooltipProps } from '../types';
import { ChartTooltipItem } from './ChartTooltipItem';
import {
  computeItemsBaseY,
  computeTooltipHeight,
  computeTooltipWidth,
  computeTooltipX,
  useBuildRefSetters,
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
  offset = chartConfig.tooltip.defaultOffset,
  minWidth = chartConfig.tooltip.defaultMinWidth,
}: Readonly<ScrubberTooltipProps>) {
  const tokens = useChartTokens();

  const hasTitle = title !== undefined;

  const { widths, titleRef, labelRefs, valueRefs } = useTooltipMeasurement(
    items,
    hasTitle,
    title,
  );

  const labelRefSetters = useBuildRefSetters(labelRefs, items.length);
  const valueRefSetters = useBuildRefSetters(valueRefs, items.length);

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
        rx={tokens.radius.sm}
        fill={tokens.color.surface}
      />
      {hasTitle && (
        <SvgText
          ref={(el) => {
            titleRef.current = el as unknown as (typeof titleRef)['current'];
          }}
          testID='chart-tooltip-title'
          x={tooltipX + chartConfig.tooltip.paddingX}
          y={
            drawingArea.y +
            chartConfig.tooltip.paddingY +
            chartConfig.tooltip.rowHeight / 2
          }
          alignmentBaseline='central'
          fill={tokens.color.textMuted}
          fontSize={tokens.font.bodySize}
          fontWeight={tokens.font.bodyWeightMedium}
          fontFamily={tokens.font.family}
        >
          {String(title)}
        </SvgText>
      )}
      {items.map((item, i) => (
        <ChartTooltipItem
          key={i}
          label={item.label}
          value={item.value}
          x={tooltipX}
          y={
            itemsBaseY +
            i * (chartConfig.tooltip.rowHeight + chartConfig.tooltip.rowGap) +
            chartConfig.tooltip.rowHeight / 2
          }
          width={tooltipWidth}
          labelRef={labelRefSetters[i]}
          valueRef={valueRefSetters[i]}
        />
      ))}
    </G>
  );
}

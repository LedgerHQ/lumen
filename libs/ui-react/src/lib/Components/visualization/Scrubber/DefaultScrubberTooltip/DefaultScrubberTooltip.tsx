import { chartConfig } from '../../../config';
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

const { color, font, tooltip } = chartConfig;

const TITLE_STYLE = {
  fontSize: font.bodySize,
  fontFamily: font.family,
  fill: color.textMuted,
  fontWeight: font.bodyWeightMedium,
};

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
  offset = tooltip.defaultOffset,
  minWidth = tooltip.defaultMinWidth,
}: Readonly<ScrubberTooltipProps>) {
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
    <g
      data-testid='chart-tooltip'
      role='tooltip'
      style={{
        opacity: widths === null ? 0 : 1,
        transition: tooltip.transition,
        pointerEvents: 'none',
      }}
    >
      <rect
        x={tooltipX}
        y={drawingArea.y}
        width={tooltipWidth}
        height={tooltipHeight}
        fill={tooltip.background}
        style={{
          rx: tooltip.borderRadius,
        }}
      />
      {hasTitle && (
        <text
          ref={titleRef}
          data-testid='chart-tooltip-title'
          x={tooltipX + tooltip.paddingX}
          y={drawingArea.y + tooltip.paddingY + tooltip.rowHeight / 2}
          dominantBaseline='middle'
          style={TITLE_STYLE}
        >
          {title}
        </text>
      )}
      {items.map((item, i) => (
        <ChartTooltipItem
          key={i}
          label={item.label}
          value={item.value}
          x={tooltipX}
          y={
            itemsBaseY +
            i * (tooltip.rowHeight + tooltip.rowGap) +
            tooltip.rowHeight / 2
          }
          width={tooltipWidth}
          labelRef={labelRefSetters[i]}
          valueRef={valueRefSetters[i]}
        />
      ))}
    </g>
  );
}

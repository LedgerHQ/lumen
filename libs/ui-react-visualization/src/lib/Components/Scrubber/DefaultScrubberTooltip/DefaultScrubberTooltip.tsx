import { cssVar } from '@ledgerhq/lumen-design-core';

import {
  CHART_FONT_FAMILY,
  CHART_TEXT_MUTED_COLOR,
  TOOLTIP_DEFAULT_MIN_WIDTH,
  TOOLTIP_DEFAULT_OFFSET,
  TOOLTIP_PADDING_X,
  TOOLTIP_PADDING_Y,
  TOOLTIP_ROW_GAP,
  TOOLTIP_ROW_HEIGHT,
  TOOLTIP_TRANSITION,
} from '../../../config';
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

const TITLE_STYLE = {
  fontSize: cssVar('var(--font-style-body-3-size)'),
  fontFamily: CHART_FONT_FAMILY,
  fill: CHART_TEXT_MUTED_COLOR,
  fontWeight: cssVar('var(--font-style-body-3-weight-medium)'),
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
  offset = TOOLTIP_DEFAULT_OFFSET,
  minWidth = TOOLTIP_DEFAULT_MIN_WIDTH,
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
        transition: TOOLTIP_TRANSITION,
        pointerEvents: 'none',
      }}
    >
      <rect
        x={tooltipX}
        y={drawingArea.y}
        width={tooltipWidth}
        height={tooltipHeight}
        fill={cssVar('var(--background-muted)')}
        style={{
          rx: cssVar('var(--border-radius-sm)'),
        }}
      />
      {hasTitle && (
        <text
          ref={titleRef}
          data-testid='chart-tooltip-title'
          x={tooltipX + TOOLTIP_PADDING_X}
          y={drawingArea.y + TOOLTIP_PADDING_Y + TOOLTIP_ROW_HEIGHT / 2}
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
            i * (TOOLTIP_ROW_HEIGHT + TOOLTIP_ROW_GAP) +
            TOOLTIP_ROW_HEIGHT / 2
          }
          width={tooltipWidth}
          labelRef={labelRefSetters[i]}
          valueRef={valueRefSetters[i]}
        />
      ))}
    </g>
  );
}

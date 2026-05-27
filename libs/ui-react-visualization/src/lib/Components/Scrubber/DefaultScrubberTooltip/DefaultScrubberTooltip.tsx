import { cssVar } from '@ledgerhq/lumen-design-core';

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
  TOOLTIP_TRANSITION,
} from './constants';
import {
  computeItemsBaseY,
  computeTooltipHeight,
  computeTooltipWidth,
  computeTooltipX,
  useBuildRefSetters,
  useTooltipMeasurement,
} from './utils';

const TITLE_STYLE = {
  fontSize: cssVar('var(--font-style-body-4-size)'),
  fontFamily: cssVar('var(--font-family-font)'),
  fill: cssVar('var(--text-base)'),
  fontWeight: cssVar('var(--font-style-body-4-weight-medium)'),
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
  offset = DEFAULT_OFFSET,
  minWidth = DEFAULT_TOOLTIP_MIN_WIDTH,
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
        rx={BORDER_RADIUS}
        fill={cssVar('var(--background-muted)')}
      />
      {hasTitle && (
        <text
          ref={titleRef}
          data-testid='chart-tooltip-title'
          x={tooltipX + PADDING_X}
          y={drawingArea.y + PADDING_Y + ROW_HEIGHT / 2}
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
          y={itemsBaseY + i * (ROW_HEIGHT + ROW_GAP) + ROW_HEIGHT / 2}
          width={tooltipWidth}
          labelRef={labelRefSetters[i]}
          valueRef={valueRefSetters[i]}
        />
      ))}
    </g>
  );
}

import { cssVar } from '@ledgerhq/lumen-design-core';
import { useEffect, useRef, useState } from 'react';

import type { ChartTooltipItemData, ScrubberTooltipProps } from '../types';
import { ChartTooltipItem } from './ChartTooltipItem';
import {
  BORDER_RADIUS,
  DEFAULT_OFFSET,
  DEFAULT_TOOLTIP_MIN_WIDTH,
  LABEL_VALUE_GAP,
  PADDING_X,
  PADDING_Y,
  ROW_GAP,
  ROW_HEIGHT,
  TITLE_GAP,
  TOOLTIP_TRANSITION,
} from './constants';

const TITLE_STYLE = {
  fontSize: cssVar('var(--font-style-body-4-size)'),
  fontFamily: cssVar('var(--font-family-font)'),
  fill: cssVar('var(--text-base)'),
  fontWeight: cssVar('var(--font-style-body-4-weight-medium)'),
};

type Widths = {
  title: number;
  labels: number[];
  values: number[];
};

const safeGetBBoxWidth = (el: SVGGraphicsElement | null): number => {
  if (!el || typeof el.getBBox !== 'function') return 0;
  try {
    return el.getBBox().width;
  } catch {
    return 0;
  }
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
  const resolvedItems: ChartTooltipItemData[] = items;
  const hasTitle = title !== undefined && title !== null;

  const titleRef = useRef<SVGTextElement | null>(null);
  const labelRefs = useRef<(SVGTextElement | null)[]>([]);
  const valueRefs = useRef<(SVGTextElement | null)[]>([]);

  const [widths, setWidths] = useState<Widths | null>(null);

  useEffect(() => {
    if (resolvedItems.length === 0) return;

    const measure = (): void => {
      const measuredTitle = hasTitle ? safeGetBBoxWidth(titleRef.current) : 0;
      const measuredLabels = resolvedItems.map((_, i) =>
        safeGetBBoxWidth(labelRefs.current[i]),
      );
      const measuredValues = resolvedItems.map((_, i) =>
        safeGetBBoxWidth(valueRefs.current[i]),
      );
      setWidths({
        title: measuredTitle,
        labels: measuredLabels,
        values: measuredValues,
      });
    };

    measure();

    if (typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(measure);
    if (titleRef.current) observer.observe(titleRef.current);
    labelRefs.current.forEach((el) => el && observer.observe(el));
    valueRefs.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, [resolvedItems, title, hasTitle]);

  if (resolvedItems.length === 0) {
    return null;
  }

  const titleWidth = widths && hasTitle ? widths.title : 0;
  const rowWidths = widths
    ? widths.labels.map(
        (lw, i) => lw + LABEL_VALUE_GAP + (widths.values[i] ?? 0),
      )
    : [];
  const contentWidth = Math.max(titleWidth, ...rowWidths);

  const fitWidth = contentWidth + PADDING_X * 2;
  const tooltipWidth = Math.max(fitWidth, minWidth);

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
      {resolvedItems.map((item, i) => (
        <ChartTooltipItem
          key={`${item.label}-${item.value}`}
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
    </g>
  );
}

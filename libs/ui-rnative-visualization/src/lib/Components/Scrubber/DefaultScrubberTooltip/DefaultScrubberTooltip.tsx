import { useTheme } from '@ledgerhq/lumen-ui-rnative';
import { useEffect, useRef, useState } from 'react';
import { G, Rect, Text as SvgText } from 'react-native-svg';

import type {
  ChartTooltipItemData,
  ScrubberTooltipProps,
  SvgBBoxElement,
} from '../types';
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
} from './constants';

type Widths = {
  title: number;
  labels: number[];
  values: number[];
};

const safeGetBBoxWidth = async (el: SvgBBoxElement | null): Promise<number> => {
  if (!el) return 0;
  try {
    const result = await el.getBBox();
    return result?.width ?? 0;
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
  const { theme } = useTheme();

  const resolvedItems: ChartTooltipItemData[] = items;
  const hasTitle = title !== undefined && title !== null;

  const titleRef = useRef<SvgBBoxElement | null>(null);
  const labelRefs = useRef<(SvgBBoxElement | null)[]>([]);
  const valueRefs = useRef<(SvgBBoxElement | null)[]>([]);

  const [widths, setWidths] = useState<Widths | null>(null);

  useEffect(() => {
    if (resolvedItems.length === 0) return;

    let cancelled = false;

    const measure = async (): Promise<void> => {
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => resolve()),
      );
      if (cancelled) return;

      const measuredTitle = hasTitle
        ? await safeGetBBoxWidth(titleRef.current)
        : 0;
      const measuredLabels = await Promise.all(
        resolvedItems.map((_, i) => safeGetBBoxWidth(labelRefs.current[i])),
      );
      const measuredValues = await Promise.all(
        resolvedItems.map((_, i) => safeGetBBoxWidth(valueRefs.current[i])),
      );

      if (!cancelled) {
        setWidths({
          title: measuredTitle,
          labels: measuredLabels,
          values: measuredValues,
        });
      }
    };

    void measure();
    return () => {
      cancelled = true;
    };
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
            titleRef.current = el as unknown as SvgBBoxElement | null;
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
    </G>
  );
}

import type { RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';

import type { DrawingArea } from '../../../utils/types';
import type { ChartTooltipItemData, SvgBBoxElement } from '../types';
import {
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

type UseTooltipMeasurementReturn = {
  widths: Widths | null;
  titleRef: RefObject<SvgBBoxElement | null>;
  labelRefs: RefObject<(SvgBBoxElement | null)[]>;
  valueRefs: RefObject<(SvgBBoxElement | null)[]>;
};

export const safeGetBBoxWidth = async (
  el: SvgBBoxElement | null,
): Promise<number> => {
  if (!el) return 0;
  try {
    const result = await el.getBBox();
    return result?.width ?? 0;
  } catch {
    return 0;
  }
};

/**
 * Derive the auto-fit tooltip width from measured text widths,
 * clamped to a minimum floor.
 */
export const computeTooltipWidth = (
  widths: Widths | null,
  hasTitle: boolean,
  minWidth: number,
): number => {
  const titleWidth = widths && hasTitle ? widths.title : 0;
  const rowWidths = widths
    ? widths.labels.map(
        (lw, i) => lw + LABEL_VALUE_GAP + (widths.values[i] ?? 0),
      )
    : [];
  const contentWidth = Math.max(titleWidth, ...rowWidths);
  const fitWidth = contentWidth + PADDING_X * 2;
  return Math.max(fitWidth, minWidth);
};

/**
 * Compute the tooltip's horizontal position, flipping to the left
 * of the scrubber line when it would overflow the drawing area.
 * Also clamps from above to prevent overflow on the right edge.
 */
export const computeTooltipX = (
  pixelX: number,
  offset: number,
  tooltipWidth: number,
  drawingArea: DrawingArea,
): number => {
  const shouldFlip =
    pixelX + offset + tooltipWidth > drawingArea.x + drawingArea.width;
  const preferredTooltipX = shouldFlip
    ? pixelX - offset - tooltipWidth
    : pixelX + offset;
  const maxTooltipX = Math.max(
    drawingArea.x,
    drawingArea.x + drawingArea.width - tooltipWidth,
  );
  return Math.min(maxTooltipX, Math.max(drawingArea.x, preferredTooltipX));
};

/**
 * Compute the total tooltip height from item count and title presence.
 */
export const computeTooltipHeight = (
  itemCount: number,
  hasTitle: boolean,
): number => {
  const titleBlockHeight = hasTitle ? ROW_HEIGHT + TITLE_GAP : 0;
  return (
    PADDING_Y * 2 +
    titleBlockHeight +
    itemCount * ROW_HEIGHT +
    (itemCount - 1) * ROW_GAP
  );
};

/**
 * Vertical offset where tooltip rows begin, accounting for title presence.
 */
export const computeItemsBaseY = (
  drawingAreaY: number,
  hasTitle: boolean,
): number => {
  const titleBlockHeight = hasTitle ? ROW_HEIGHT + TITLE_GAP : 0;
  return drawingAreaY + PADDING_Y + titleBlockHeight;
};

const waitForAnimationFrame = (): Promise<void> =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

/**
 * Reads the rendered widths of all tooltip text elements via async `getBBox`.
 * Defers until the next animation frame so layout has settled.
 */
export const measureWidths = async (
  items: ChartTooltipItemData[],
  hasTitle: boolean,
  titleRef: RefObject<SvgBBoxElement | null>,
  labelRefs: RefObject<(SvgBBoxElement | null)[]>,
  valueRefs: RefObject<(SvgBBoxElement | null)[]>,
): Promise<Widths> => {
  await waitForAnimationFrame();
  const title = hasTitle ? await safeGetBBoxWidth(titleRef.current) : 0;
  const labels = await Promise.all(
    items.map((_, i) => safeGetBBoxWidth(labelRefs.current[i])),
  );
  const values = await Promise.all(
    items.map((_, i) => safeGetBBoxWidth(valueRefs.current[i])),
  );
  return { title, labels, values };
};

/**
 * Manages SVG text measurement for the tooltip via async `getBBox`.
 *
 * Uses `requestAnimationFrame` to defer measurement until after layout,
 * with a cancellation flag to prevent stale state updates when items change
 * rapidly.
 */
export function useTooltipMeasurement(
  items: ChartTooltipItemData[],
  hasTitle: boolean,
  title: string | number | undefined,
): UseTooltipMeasurementReturn {
  const titleRef = useRef<SvgBBoxElement | null>(null);
  const labelRefs = useRef<(SvgBBoxElement | null)[]>([]);
  const valueRefs = useRef<(SvgBBoxElement | null)[]>([]);

  const [widths, setWidths] = useState<Widths | null>(null);

  useEffect(() => {
    if (items.length === 0) return;

    let cancelled = false;

    void measureWidths(items, hasTitle, titleRef, labelRefs, valueRefs).then(
      (result) => {
        if (!cancelled) setWidths(result);
      },
    );

    return () => {
      cancelled = true;
    };
  }, [items, title, hasTitle]);

  return { widths, titleRef, labelRefs, valueRefs };
}

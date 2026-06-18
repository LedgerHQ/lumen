import type { RefObject } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { clamp } from '../../../utils/numbers';
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
  return clamp(preferredTooltipX, drawingArea.x, maxTooltipX);
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

const waitForAnimationFrame = (): {
  promise: Promise<void>;
  cancel: () => void;
} => {
  let id: number;
  const promise = new Promise<void>((resolve) => {
    id = requestAnimationFrame(() => resolve());
  });
  return { promise, cancel: () => cancelAnimationFrame(id) };
};

/**
 * Reads the rendered widths of all tooltip text elements via async `getBBox`.
 * Defers until the next animation frame so layout has settled.
 * Returns a cancel function so callers can abort the pending RAF.
 */
export const measureWidths = (
  items: ChartTooltipItemData[],
  hasTitle: boolean,
  titleRef: RefObject<SvgBBoxElement | null>,
  labelRefs: RefObject<(SvgBBoxElement | null)[]>,
  valueRefs: RefObject<(SvgBBoxElement | null)[]>,
): { promise: Promise<Widths>; cancel: () => void } => {
  const raf = waitForAnimationFrame();
  const promise = raf.promise.then(async () => {
    const title = hasTitle ? await safeGetBBoxWidth(titleRef.current) : 0;
    const labels = await Promise.all(
      items.map((_, i) => safeGetBBoxWidth(labelRefs.current[i])),
    );
    const values = await Promise.all(
      items.map((_, i) => safeGetBBoxWidth(valueRefs.current[i])),
    );
    return { title, labels, values };
  });
  return { promise, cancel: raf.cancel };
};

/**
 * Builds a stable string signature for the tooltip's content shape (labels,
 * title, and item count). Used as the sole dependency of the measurement
 * effect so re-measurement only happens when something that can change the
 * tooltip's natural width actually changes — typically once per shape change,
 * not on every scrub frame as value strings update.
 */
const computeShapeSignature = (
  items: ChartTooltipItemData[],
  hasTitle: boolean,
  title: string | number | undefined,
): string => {
  let labels = '';
  for (let i = 0; i < items.length; i++) {
    if (i > 0) labels += '\u001F';
    labels += String(items[i].label);
  }
  return `${hasTitle ? '1' : '0'}|${labels}|${title ?? ''}`;
};

/**
 * Manages SVG text measurement for the tooltip via async `getBBox`.
 *
 * Uses `requestAnimationFrame` to defer measurement until after layout, with a
 * cancellation flag to prevent stale state updates when items change rapidly.
 *
 * The effect's dependency is a shape signature (labels + title + count) rather
 * than the raw `items` reference, so high-frequency value updates during a
 * scrub do not trigger a fresh measurement chain. Value-width auto-fit is
 * handled by `minWidth`; consumers that need pixel-perfect value fitting
 * should set a `minWidth` large enough to cover the widest value.
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

  const shapeKey = computeShapeSignature(items, hasTitle, title);
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const hasTitleRef = useRef(hasTitle);
  hasTitleRef.current = hasTitle;

  useEffect(() => {
    if (itemsRef.current.length === 0) return;

    let cancelled = false;

    const { promise, cancel } = measureWidths(
      itemsRef.current,
      hasTitleRef.current,
      titleRef,
      labelRefs,
      valueRefs,
    );
    void promise.then((result) => {
      if (!cancelled) setWidths(result);
    });

    return () => {
      cancelled = true;
      cancel();
    };
  }, [shapeKey]);

  return { widths, titleRef, labelRefs, valueRefs };
}

type RefSetter = (el: SvgBBoxElement | null) => void;

/**
 * Builds stable per-index ref-callback arrays that mutate the given refs in
 * place. Recomputed only when `length` changes, so the same callback identity
 * is passed to each `ChartTooltipItem` across scrub frames. This unlocks
 * `React.memo` on `ChartTooltipItem` and avoids the per-frame detach /
 * re-attach dance of inline arrow ref callbacks.
 */
export const useBuildRefSetters = (
  refs: { current: (SvgBBoxElement | null)[] },
  length: number,
): RefSetter[] => {
  return useMemo(() => {
    const setters: RefSetter[] = new Array(length);
    for (let i = 0; i < length; i++) {
      setters[i] = (el) => {
        refs.current[i] = el;
      };
    }
    return setters;
  }, [refs, length]);
};

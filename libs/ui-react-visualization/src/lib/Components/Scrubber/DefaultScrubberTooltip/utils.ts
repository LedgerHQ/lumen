import type { RefObject } from 'react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import type { DrawingArea } from '../../../utils/types';
import type { ChartTooltipItemData, SvgTextContent } from '../types';
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
  titleRef: RefObject<SVGTextElement | null>;
  labelRefs: RefObject<(SVGTextElement | null)[]>;
  valueRefs: RefObject<(SVGTextElement | null)[]>;
};

export const safeGetBBoxWidth = (el: SVGGraphicsElement | null): number => {
  if (!el || typeof el.getBBox !== 'function') return 0;
  try {
    return el.getBBox().width;
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
 */
export const computeTooltipX = (
  pixelX: number,
  offset: number,
  tooltipWidth: number,
  drawingArea: DrawingArea,
): number => {
  const shouldFlip =
    pixelX + offset + tooltipWidth > drawingArea.x + drawingArea.width;
  return Math.max(
    drawingArea.x,
    shouldFlip ? pixelX - offset - tooltipWidth : pixelX + offset,
  );
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

/**
 * Builds a stable string signature for the tooltip's content shape (labels,
 * title, and item count). Used as the sole dependency of the measurement
 * effect so re-measurement and observer re-binding only happen when something
 * that can change the tooltip's natural width actually changes — typically
 * once per shape change, not on every scrub frame as value strings update.
 */
const computeShapeSignature = (
  items: ChartTooltipItemData[],
  hasTitle: boolean,
  title: SvgTextContent | undefined,
): string => {
  let labels = '';
  for (let i = 0; i < items.length; i++) {
    if (i > 0) labels += '\u001F';
    const label = items[i].label;
    labels +=
      typeof label === 'string' || typeof label === 'number'
        ? String(label)
        : '';
  }
  const titleKey =
    typeof title === 'string' || typeof title === 'number' ? String(title) : '';
  return `${hasTitle ? '1' : '0'}|${labels}|${titleKey}`;
};

/**
 * Manages SVG text measurement for the tooltip via `getBBox`.
 *
 * A single `ResizeObserver` is created on mount and reused for the component's
 * entire lifetime, avoiding the cost of tearing down and recreating an observer
 * on every scrubber movement.
 *
 * The re-measure / re-observe effect's dependency is a shape signature (labels
 * + title + count) rather than the raw `items` reference, so high-frequency
 * value updates during a scrub do not trigger a fresh measurement or
 * disconnect / re-observe cycle. The `ResizeObserver` still picks up real
 * geometry changes (e.g. value strings widening past the current rect).
 */
export function useTooltipMeasurement(
  items: ChartTooltipItemData[],
  hasTitle: boolean,
  title: SvgTextContent | undefined,
): UseTooltipMeasurementReturn {
  const titleRef = useRef<SVGTextElement | null>(null);
  const labelRefs = useRef<(SVGTextElement | null)[]>([]);
  const valueRefs = useRef<(SVGTextElement | null)[]>([]);
  const observerRef = useRef<ResizeObserver | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const measureFnRef = useRef<() => void>(() => {});

  const [widths, setWidths] = useState<Widths | null>(null);

  measureFnRef.current = () => {
    const measuredTitle = hasTitle ? safeGetBBoxWidth(titleRef.current) : 0;
    const measuredLabels = items.map((_, i) =>
      safeGetBBoxWidth(labelRefs.current[i]),
    );
    const measuredValues = items.map((_, i) =>
      safeGetBBoxWidth(valueRefs.current[i]),
    );
    setWidths({
      title: measuredTitle,
      labels: measuredLabels,
      values: measuredValues,
    });
  };

  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') {
      return;
    }
    observerRef.current = new ResizeObserver(() => measureFnRef.current());
    return () => observerRef.current?.disconnect();
  }, []);

  const shapeKey = computeShapeSignature(items, hasTitle, title);
  const itemsLengthRef = useRef(items.length);
  itemsLengthRef.current = items.length;

  useLayoutEffect(() => {
    const length = itemsLengthRef.current;
    if (length === 0) return;

    labelRefs.current.length = length;
    valueRefs.current.length = length;

    measureFnRef.current();

    const observer = observerRef.current;
    if (!observer) return;
    observer.disconnect();
    if (titleRef.current) observer.observe(titleRef.current);
    labelRefs.current.forEach((el) => el && observer.observe(el));
    valueRefs.current.forEach((el) => el && observer.observe(el));
  }, [shapeKey]);

  return { widths, titleRef, labelRefs, valueRefs };
}

type SvgTextRefSetter = (el: SVGTextElement | null) => void;

/**
 * Builds stable per-index ref-callback arrays that mutate the given refs in
 * place. Recomputed only when `length` changes, so the same callback identity
 * is passed to each `ChartTooltipItem` across scrub frames. This unlocks
 * `React.memo` on `ChartTooltipItem` and avoids the per-frame detach /
 * re-attach dance of inline arrow ref callbacks.
 */
export const useBuildRefSetters = (
  refs: RefObject<(SVGTextElement | null)[]>,
  length: number,
): SvgTextRefSetter[] => {
  return useMemo(() => {
    const setters: SvgTextRefSetter[] = new Array(length);
    for (let i = 0; i < length; i++) {
      setters[i] = (el) => {
        refs.current[i] = el;
      };
    }
    return setters;
  }, [refs, length]);
};

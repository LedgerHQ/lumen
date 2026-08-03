import type { ComponentPropsWithRef, ReactNode } from 'react';

import type { chartConfig } from '../../config';

export type DonutSize = keyof typeof chartConfig.donut.size;

/**
 * The title's own typography scale.
 */
export type DonutTitleSize = 'md' | 'sm';

/** Ring dimensions for a given size, in SVG user units. */
export type DonutGeometry = Readonly<{
  box: number;
  innerRadius: number;
  outerRadius: number;
  cornerRadius: number;
  padAngle: number;
  hoverOffset: number;
}>;

/** An arc ready to draw: its path is centered at the origin. */
export type DonutArc = {
  id: string;
  path: string;
  color: string;
  percent: number;
  midAngle: number;
  hoverTranslate: { x: number; y: number };
  hoverEnabled: boolean;
};

/** A single part-to-whole segment. */
export type DonutSegment = {
  /**
   * Stable identifier for the segment.
   */
  id: string;
  /**
   * Human-readable label.
   */
  label: string;
  /**
   * Raw value; the percent is computed from the total.
   */
  value: number;
  /**
   * Optional CSS color override; defaults to a neutral grey.
   */
  color?: string;
};

/** How `useDonutSeries` folds a raw series' long tail into a single segment. */
export type DonutSeriesOptions = {
  /**
   * Segments below this share of the total are grouped into the "other" segment.
   * A fraction of the total, not a percentage: pass `0.04` for 4%. `0` means no
   * minimum. The top segment is always kept, so `1` or above groups everything
   * but the largest rather than collapsing the chart.
   * @default 0
   */
  minShare?: number;
  /**
   * Max segments kept before the tail is grouped; `0` disables grouping. A soft
   * cap: a tail of a single segment is kept as-is, so the result can hold
   * `maxSegments + 1` segments.
   * @default 7
   */
  maxSegments?: number;
  /**
   * Shape of the aggregate segment; `value` is always computed.
   */
  other: {
    /** @default 'other' */
    id?: DonutSegment['id'];
    label: DonutSegment['label'];
    /** Optional color override; defaults to the chart's neutral segment color. */
    color?: DonutSegment['color'];
  };
};

export type DonutSeriesResult = {
  /**
   * Kept segments, sorted by value descending, plus the appended `other` segment.
   */
  segments: DonutSegment[];
  /**
   * The raw segments folded into `other`; empty when nothing was grouped.
   */
  others: DonutSegment[];
};

/** A segment enriched with its computed share of the series total. */
export type DonutActiveSegment = DonutSegment & {
  /**
   * Exact share of the total, 0–100. Use it to compute; it is unrounded and can
   * carry float artifacts (`7.000000000000001`), so prefer `percentLabel` to display.
   */
  percent: number;
  /** Display-ready `percent`, rounded to at most 1 decimal and suffixed, e.g. `7%`. */
  percentLabel: string;
};

export type DonutChartProps = {
  /**
   * Part-to-whole segments, rendered in order.
   */
  series: DonutSegment[];
  /**
   * Ring size. `md` is 168px, `sm` is 80px.
   * @default 'md'
   */
  size?: DonutSize;
  /**
   * Accessible label describing what the chart represents, exposed to
   * assistive tech via the SVG `role="img"`.
   * @default 'Donut chart'
   */
  ariaLabel?: string;
  /**
   * Controlled active segment id. Active is data-driven, not a state variant.
   */
  activeId?: string | null;
  /**
   * Default active segment id for uncontrolled mode.
   */
  defaultActiveId?: string | null;
  /** Fired when the active segment changes (hover or external reset). */
  onActiveIdChange?: (id: string | null) => void;
  /**
   * Renders the resting center content. Return a top-level `DonutChartCenter`
   * wrapping `DonutChartTitle` and/or `DonutChartDescription`. Receives
   * `{ activeSegment, series }`; `activeSegment` is enriched with its computed
   * `percent`/`percentLabel` and is `null` when nothing is active.
   */
  renderCenter?: (params: {
    activeSegment: DonutActiveSegment | null;
    series: DonutSegment[];
  }) => ReactNode;
  /**
   * Optional active center content on segment hover, wrapped in a top-level
   * `DonutChartCenter`. When set, the chart crossfades between the resting
   * slot (`renderCenter`, called with `activeSegment: null`) and this active slot.
   */
  renderCenterActive?: (params: {
    activeSegment: DonutActiveSegment;
  }) => ReactNode;
};

export type DonutChartCenterProps = ComponentPropsWithRef<'div'>;

export type DonutChartTitleProps = ComponentPropsWithRef<'div'> & {
  /**
   * The title's own typography scale.
   * @default 'md'
   */
  size?: DonutTitleSize;
};

export type DonutChartDescriptionProps = ComponentPropsWithRef<'div'>;

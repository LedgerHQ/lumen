import type { BoxProps, TextProps } from '@ledgerhq/lumen-ui-rnative';
import type { ReactNode } from 'react';

import type { DonutSizeKey } from '../../config';

export type DonutSize = DonutSizeKey;

/**
 * The title's own typography scale.
 */
export type DonutTitleSize = 'md' | 'sm';

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
   * Optional color override; defaults to a neutral grey.
   */
  color?: string;
};

/**
 * A segment enriched with its computed share of the series total.
 */
export type DonutActiveSegment = DonutSegment & {
  /**
   * Exact share of the total, 0–100. Use it to compute; it is unrounded and can
   * carry float artifacts (`7.000000000000001`), so prefer `percentLabel` to display.
   */
  percent: number;
  /**
   * Display-ready `percent`, rounded to at most 1 decimal and suffixed, e.g. `7%`.
   */
  percentLabel: string;
};

/** How `useDonutSeries` folds a raw series' long tail into a single segment. */
export type DonutSeriesOptions = {
  /**
   * Segments below this share of the total are grouped into the "other" segment.
   * A fraction of the total, not a percentage: pass `0.04` for 4%. `0` groups
   * nothing. The top segment is always kept, so `1` or above groups everything
   * but the largest rather than collapsing the chart.
   * @default 0
   */
  groupBelowShare?: number;
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
   * Accessible label describing what the chart represents.
   * @default 'Donut chart'
   */
  accessibilityLabel?: string;
  /**
   * Whether the chart is loading. When true, renders an animated placeholder
   * wave instead of the real segments, regardless of `series`.
   * @default false
   */
  loading?: boolean;
  /**
   * Controlled active segment id. Active is data-driven, not a state variant.
   */
  activeId?: string | null;
  /**
   * Default active segment id for uncontrolled mode.
   */
  defaultActiveId?: string | null;
  /**
   * When `true`, each segment's `color` is nudged so its HSL lightness differs
   * from the surface background by at least 20 units.
   *
   * Colors that already meet that minimum are left untouched. Useful when the
   * segment palette includes colors that are close in lightness to the app background.
   * @default false
   */
  enableColorContrast?: boolean;
  /**
   * Fired when the active segment changes (tap to select, tap again to deselect).
   */
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
   * Optional active center content on segment tap, wrapped in a top-level
   * `DonutChartCenter`. When set, the chart crossfades between the resting
   * slot (`renderCenter`, called with `activeSegment: null`) and this active slot.
   */
  renderCenterActive?: (params: {
    activeSegment: DonutActiveSegment;
  }) => ReactNode;
};

export type DonutChartCenterProps = BoxProps;

export type DonutChartTitleProps = Omit<TextProps, 'typography'> & {
  /**
   * The title's own typography scale.
   * @default 'md'
   */
  size?: DonutTitleSize;
};

export type DonutChartDescriptionProps = {
  children: ReactNode;
} & Omit<TextProps, 'children' | 'typography'>;

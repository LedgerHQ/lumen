import type { BoxProps, TextProps } from '@ledgerhq/lumen-ui-rnative';
import type { ReactNode } from 'react';

import type { DonutSizeKey } from '../../config';

export type DonutSize = DonutSizeKey;

/**
 * The title's own typography scale.
 */
export type DonutTitleSize = 'md' | 'sm';

/** A single part-to-whole slice. */
export type DonutSegment = {
  /** Stable identifier for the segment. */
  id: string;
  /** Human-readable label. */
  label: string;
  /** Raw value; the percent is computed from the total. */
  value: number;
  /** Optional color override; defaults to a neutral grey. */
  color?: string;
};

export type DonutChartProps = {
  /** Part-to-whole slices, rendered in order. */
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
  /** Controlled active segment id. Active is data-driven, not a state variant. */
  activeId?: string | null;
  /** Default active segment id for uncontrolled mode. */
  defaultActiveId?: string | null;
  /** Fired when the active segment changes (tap to select, tap again to deselect). */
  onActiveIdChange?: (id: string | null) => void;
  /**
   * Renders the resting center content. Return a top-level `DonutChartCenter`
   * wrapping `DonutChartTitle` and/or `DonutChartDescription`. Receives
   * `{ activeSegment, series }`; `activeSegment` is enriched with its computed
   * `percent` and is `null` when nothing is active.
   */
  renderCenter?: (params: {
    activeSegment: (DonutSegment & { percent: number }) | null;
    series: DonutSegment[];
  }) => ReactNode;
  /**
   * Optional active center content on segment tap, wrapped in a top-level
   * `DonutChartCenter`. When set, the chart crossfades between the resting
   * slot (`renderCenter`, called with `activeSegment: null`) and this active slot.
   */
  renderCenterActive?: (params: {
    activeSegment: DonutSegment & { percent: number };
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

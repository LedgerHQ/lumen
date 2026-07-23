import type { DonutSizeKey } from './constants';

export type DonutSize = DonutSizeKey;

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
  /** Fired when the active segment changes (tap or external reset). */
  onActiveIdChange?: (id: string | null) => void;
};

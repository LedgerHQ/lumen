import type { DONUT_GEOMETRY } from './constants';

export type DonutSize = keyof typeof DONUT_GEOMETRY;

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
};

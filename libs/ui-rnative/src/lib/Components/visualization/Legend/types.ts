import type { BoxProps } from '../../primitives/Box';

export type LegendItem = {
  /**
   * Stable identifier for the series or segment.
   */
  id: string;
  /**
   * Human-readable label.
   * Falls back to `id` when omitted.
   */
  label?: string;
  /**
   * Swatch color.
   * Falls back to the neutral default when omitted.
   */
  color?: string;
};

export type LegendProps = {
  /**
   * Series or segments to display in the legend.
   */
  series: LegendItem[];
  /**
   * Accessible label for the legend group.
   * @default 'Legend'
   */
  accessibilityLabel?: string;
} & Omit<BoxProps, 'children'>;

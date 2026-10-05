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
   * Accessible label for the legend list. Optional: each item already carries
   * its own visible text.
   */
  ariaLabel?: string;
  /**
   * Additional custom CSS classes to apply to the root list.
   */
  className?: string;
};

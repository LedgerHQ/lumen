export type LineProps = {
  /**
   * The ID of the series to render.
   * Must match a `Series.id` provided to the parent chart.
   */
  seriesId: string;
  /**
   * Override color for the line stroke.
   * When omitted, falls back to the `stroke` defined on the series.
   */
  stroke?: string;
  /**
   * Whether to show a filled area under the line.
   * @default false
   */
  showArea?: boolean;
  /**
   * Area fill style.
   * When `'gradient'`, renders a vertical gradient from the stroke color to transparent.
   * @default 'gradient'
   */
  areaType?: 'gradient';
};

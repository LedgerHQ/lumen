import type { CurveType } from '../../utils/types';

export type { CurveType };

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
  /**
   * Override interpolation used to draw the line between data points.
   * When omitted, falls back to the `curve` defined on the series.
   * @default 'bump'
   */
  curve?: CurveType;
  /**
   * When true, skips null values and draws a continuous line across gaps.
   * When false, null values create gaps in the line.
   * When omitted, falls back to the `connectNulls` defined on the series.
   * @default false
   */
  connectNulls?: boolean;
};

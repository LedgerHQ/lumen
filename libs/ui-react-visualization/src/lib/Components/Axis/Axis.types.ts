export type BaseAxisProps = {
  /**
   * Whether to render grid lines at each tick.
   * @default false
   */
  showGrid?: boolean;
  /**
   * Appearance of the grid lines.
   * @default 'dashed'
   */
  gridLineStyle?: 'solid' | 'dashed';
  /**
   * Whether to render the axis baseline.
   * @default false
   */
  showLine?: boolean;
  /**
   * Whether to render tick marks at each tick position.
   * @default false
   */
  showTickMark?: boolean;
  /**
   * Explicit tick positions along the axis.
   * When omitted, ticks are computed automatically from the scale.
   */
  ticks?: number[];
  /**
   * Formats a tick value into its display label.
   * Receives the raw tick value (number or string label) and must return a string.
   */
  tickLabelFormatter?: (value: number | string) => string;
};

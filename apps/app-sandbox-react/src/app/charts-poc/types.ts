/** Interpolation / curve style for line segments (mapped per rendering lib). */
export type LineCurve =
  | 'linear'
  | 'natural'
  | 'step'
  | 'stepAfter'
  | 'stepBefore';

export type DataPoint = {
  timestamp: number;
  /** Use `null` for gaps; see `connectNulls` on `LineConfig`. */
  value: number | null;
};

export type LineConfig = {
  id: string;
  /** Human-friendly series label (defaults to `id` when omitted). */
  label?: string;
  data: DataPoint[];
  color: string;
  width?: number;
  showGradient?: boolean;
  curve?: LineCurve;
  /**
   * When true, libraries that support it draw through missing points; otherwise
   * gaps break the stroke (or segments are split).
   */
  connectNulls?: boolean;
};

export type ReferenceLineStyle = 'solid' | 'dashed' | 'dotted' | 'border';

export type ReferenceLineConfig = {
  /**
   * `y` = horizontal line at price/value `value`.
   * `x` = vertical line at timestamp `value` (ms).
   */
  axis?: 'x' | 'y';
  value: number;
  /** Short domain meaning for controls (e.g. “Mid-range”, “Round level”) */
  domain?: string;
  label?: string;
  labelPosition?: 'left' | 'right' | 'center';
  /** plain ≈ solid, dash, dot, border = thicker emphasis */
  style?: ReferenceLineStyle;
  /** Optional override; charts POC defaults to neutral grey */
  color?: string;
};

export type ValueLabelConfig = {
  type: 'min' | 'max' | 'custom';
  value?: number;
  label?: string;
  position?: 'left' | 'right';
};

export type MarkerConfig = {
  timestamp: number;
  value: number;
  color?: string;
  radius?: number;
  /** @default 'filled' */
  variant?: 'filled' | 'outlined';
  /** Label shown on hover (e.g. "Buy", "Sell") */
  label?: string;
};

/** Per-axis options. Omit `show` or set `show: true` to display the axis (default). */
export type ChartAxisConfig = {
  show?: boolean;
  /** Controls grid lines for this axis (same style as other axis). */
  showGrid?: boolean;
  /** Optional custom tick values for this axis. */
  ticks?: number[];
  /** x: [minTs, maxTs] ms; y: [min, max] in value space */
  domain?: [number, number];
  tickCount?: number;
};

/** Grid visibility. `true` shows both axes; object allows per-axis control. */
export type ChartGridConfig =
  | boolean
  | {
      x?: boolean;
      y?: boolean;
    };

export type LineChartProps = {
  /**
   * Primary API used in this POC. Multiple series are supported by default.
   * Prefer `series` when using Coinbase-like naming.
   */
  lines?: LineConfig[];
  /** Coinbase-like alias for `lines` (takes precedence when provided). */
  series?: LineConfig[];
  width: number;
  height: number;
  /** Merged with defaults per chart; unspecified sides keep library defaults. */
  inset?: Partial<{
    top: number;
    right: number;
    bottom: number;
    left: number;
  }>;
  xAxis?: ChartAxisConfig;
  yAxis?: ChartAxisConfig;
  formatXLabel?: (timestamp: number) => string;
  formatYLabel?: (value: number) => string;
  /**
   * @deprecated Prefer `xAxis.showGrid` / `yAxis.showGrid`.
   * Kept as backward-compatible fallback.
   */
  showGrid?: ChartGridConfig;
  /** Coinbase-like interaction switch for hover/cursor/tooltip scrubbing. */
  enableScrubbing?: boolean;
  showTooltip?: boolean;
  showCursor?: boolean;
  showCursorLabel?: boolean;
  onPointHover?: (point: DataPoint | null, lineId: string) => void;
  onMarkerHover?: (marker: MarkerConfig | null) => void;
  /**
   * Fired when the snapped index on the **primary** series (`lines[0]`) changes
   * during pointer interaction (scrubber-neutral contract).
   */
  onActiveIndexChange?: (index: number | null) => void;
  /** Root accessible name for the chart SVG / graphic. */
  chartAccessibilityLabel?: string;
  /** Optional description for the point under the cursor (e.g. screen readers). */
  getPointA11yLabel?: (point: DataPoint, lineId: string) => string;
  className?: string;
  referenceLines?: ReferenceLineConfig[];
  valueLabels?: ValueLabelConfig[];
  markers?: MarkerConfig[];
};

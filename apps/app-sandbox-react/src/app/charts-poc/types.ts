export type DataPoint = {
  timestamp: number;
  value: number;
};

export type LineConfig = {
  id: string;
  data: DataPoint[];
  color: string;
  width?: number;
  showGradient?: boolean;
};

export type ReferenceLineStyle = 'solid' | 'dashed' | 'dotted' | 'border';

export type ReferenceLineConfig = {
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

export type LineChartProps = {
  lines: LineConfig[];
  width: number;
  height: number;
  showXAxis?: boolean;
  showYAxis?: boolean;
  formatXLabel?: (timestamp: number) => string;
  formatYLabel?: (value: number) => string;
  showGrid?: boolean;
  interactive?: boolean;
  showTooltip?: boolean;
  showCursor?: boolean;
  showCursorLabel?: boolean;
  dimAfterCursor?: boolean;
  onPointHover?: (point: DataPoint | null, lineId: string) => void;
  onMarkerHover?: (marker: MarkerConfig | null) => void;
  className?: string;
  referenceLines?: ReferenceLineConfig[];
  valueLabels?: ValueLabelConfig[];
  markers?: MarkerConfig[];
};

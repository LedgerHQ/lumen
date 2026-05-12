export type TextHorizontalAlignment = 'left' | 'center' | 'right';
export type TextVerticalAlignment = 'top' | 'middle' | 'bottom';

export type ReferenceLineBaseProps = {
  /**
   * Label text displayed near the reference line.
   */
  label?: string;
  /**
   * Horizontal pixel offset applied to the label position.
   * @default 0
   */
  labelDx?: number;
  /**
   * Vertical pixel offset applied to the label position.
   * @default 0
   */
  labelDy?: number;
  /**
   * Controls how the label text anchors horizontally relative to its position.
   * - `'left'`: text starts at the position (extends right)
   * - `'center'`: text is centered on the position
   * - `'right'`: text ends at the position (extends left)
   *
   * Defaults: `'center'` for vertical lines, inferred from `labelPosition` for horizontal lines.
   */
  labelHorizontalAlignment?: TextHorizontalAlignment;
  /**
   * Controls how the label text anchors vertically relative to its position.
   * - `'top'`: text hangs below the position
   * - `'middle'`: text is vertically centered on the position
   * - `'bottom'`: text sits above the position
   *
   * Defaults: `'bottom'` for horizontal lines, inferred from `labelPosition` for vertical lines.
   */
  labelVerticalAlignment?: TextVerticalAlignment;
  /**
   * Line color.
   * @default cssVar('var(--border-muted)')
   */
  stroke?: string;
  /**
   * Line dash style.
   * - `'dashed'`: rounded dots with `strokeDasharray="0.1 6"`
   * - `'solid'`: continuous line
   * @default 'dashed'
   */
  lineStyle?: 'solid' | 'dashed';
  /**
   * Opacity applied to the line and label.
   * @default 1
   */
  opacity?: number;
};

export type HorizontalLabelPosition = 'left' | 'center' | 'right';
export type VerticalLabelPosition = 'top' | 'middle' | 'bottom';

export type HorizontalReferenceLineProps = ReferenceLineBaseProps & {
  /**
   * Y-value in data space. The horizontal line is drawn at this value
   * spanning the full width of the drawing area.
   */
  dataY: number;
  /**
   * Position of the label along the horizontal line.
   * @default 'right'
   */
  labelPosition?: HorizontalLabelPosition;
  dataX?: never;
};

export type VerticalReferenceLineProps = ReferenceLineBaseProps & {
  /**
   * X-value in data space (index or explicit value). The vertical line
   * is drawn at this value spanning the full height of the drawing area.
   */
  dataX: number;
  /**
   * Position of the label along the vertical line.
   * @default 'top'
   */
  labelPosition?: VerticalLabelPosition;
  dataY?: never;
};

export type ReferenceLineProps =
  | HorizontalReferenceLineProps
  | VerticalReferenceLineProps;

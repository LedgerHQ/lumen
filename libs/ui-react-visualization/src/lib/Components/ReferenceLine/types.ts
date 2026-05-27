export type LabelAlignment = 'start' | 'center' | 'end';
export type LabelPosition = 'start' | 'center' | 'end';

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
   * Position of the label along the line.
   * @default 'end'
   */
  labelPosition?: LabelPosition;
  /**
   * Controls the direction the label text extends from its position.
   * - `'start'`: text extends toward the start of the axis (left)
   * - `'center'`: text is centered on the position
   * - `'end'`: text extends toward the end of the axis (right)
   *
   * Defaults: `'center'` for vertical lines, inferred from `labelPosition` for horizontal lines.
   */
  labelHorizontalAlignment?: LabelAlignment;
  /**
   * Controls the direction the label text extends from its position.
   * - `'start'`: text extends toward the start of the axis (up)
   * - `'center'`: text is vertically centered on the position
   * - `'end'`: text extends toward the end of the axis (down)
   *
   * Defaults: `'end'` for horizontal lines, inferred from `labelPosition` for vertical lines.
   */
  labelVerticalAlignment?: LabelAlignment;
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
};

export type HorizontalReferenceLineProps = ReferenceLineBaseProps & {
  /**
   * Y-axis value in data space where the horizontal line is drawn.
   * The horizontal line is rendered at this Y position spanning the full
   * width of the drawing area.
   */
  dataY: number;
  dataX?: never;
};

export type VerticalReferenceLineProps = ReferenceLineBaseProps & {
  /**
   * Data index along the X axis. When `xAxis.data` contains numeric values,
   * the index is mapped to the corresponding axis value automatically.
   * The vertical line is drawn at this position spanning the full height
   * of the drawing area.
   */
  dataX: number;
  dataY?: never;
};

export type ReferenceLineProps =
  | HorizontalReferenceLineProps
  | VerticalReferenceLineProps;

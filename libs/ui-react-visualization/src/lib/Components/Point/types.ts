import type { MouseEvent, ReactNode } from 'react';

export type PointProps = {
  /**
   * X coordinate in data space (index or explicit value).
   */
  dataX: number;
  /**
   * Y coordinate in data space.
   */
  dataY: number;
  /**
   * Fill color of the point circle.
   */
  color?: string;
  /**
   * Text label displayed near the point.
   * A string is rendered directly; a function receives `dataX` and returns
   * the label string, enabling index-based formatting.
   */
  label?: string | ((dataIndex: number) => string);
  /**
   * Custom SVG element rendered instead of the default text label.
   * Automatically translated so that `(0, 0)` is the label anchor point
   * (horizontally centered on the point, vertically offset like the built-in label).
   */
  labelComponent?: ReactNode;
  /**
   * Placement of the label relative to the point.
   * @default 'top'
   */
  labelPosition?: 'top' | 'bottom';
  /**
   * When `true`, the point circle is hidden but the label (if any) is still rendered.
   * @default false
   */
  hidePoint?: boolean;
  /**
   * Diameter of the point circle in pixels.
   * Internally converted to an SVG radius (`size / 2`).
   * @default 10
   */
  size?: number;
  /**
   * When `true`, an arrow is displayed pointing from the point to the label.
   * @default true
   */
  showLabelArrow?: boolean;
  /**
   * Called when the point is clicked.
   */
  onClick?: (event: MouseEvent<SVGGElement>) => void;
};

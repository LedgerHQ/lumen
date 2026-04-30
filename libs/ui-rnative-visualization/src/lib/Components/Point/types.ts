import type { ComponentType } from 'react';
import type { GestureResponderEvent } from 'react-native';

export type PointLabelProps = {
  x: number;
  y: number;
  children: string;
};

export type PointLabelComponent = ComponentType<PointLabelProps>;

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
   * Custom component rendered instead of the default `PointLabel`.
   * Receives pixel coordinates (`x`, `y`) and the resolved label as
   * `children`. Use `PointLabel` inside your component to retain
   * theme styling while customising layout or appearance.
   */
  LabelComponent?: PointLabelComponent;
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
   * Called when the point is pressed.
   */
  onPress?: (event: GestureResponderEvent) => void;
};

import type { ComponentType } from 'react';
import type { GestureResponderEvent } from 'react-native';
import type { TextProps } from 'react-native-svg';

export type PointLabelProps = {
  x: number;
  y: number;
  children: string;
} & Omit<TextProps, 'x' | 'y' | 'children'>;

export type PointLabelComponent = ComponentType<PointLabelProps>;

/**
 * Horizontal alignment strategy for a point's label.
 *
 * - `'auto'`: keep the label inside the drawing area, anchoring it to the
 *   nearest edge when it would overflow.
 * - `'center'`: always centre the label on the point.
 */
export type LabelAlignment = 'center' | 'auto';

/**
 * Pixel position and styling inputs shared by the point's rendered glyphs. Each
 * glyph picks the subset it needs and derives its own pixel geometry (e.g.
 * radius from `size`).
 */
type PointGlyphProps = {
  x: number;
  y: number;
  size: number;
  color?: string;
  position: 'top' | 'bottom';
};

export type PointMarkerProps = Pick<
  PointGlyphProps,
  'x' | 'y' | 'size' | 'color'
>;

export type PointArrowProps = Pick<
  PointGlyphProps,
  'x' | 'y' | 'size' | 'position'
>;

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
   * Defaults to `theme.colors.bg.mutedStrong`.
   *
   * Use the `useTheme` hook from `@ledgerhq/lumen-ui-rnative` to
   * access design-token colors at runtime:
   *
   * @example
   * ```tsx
   * import { useTheme } from '@ledgerhq/lumen-ui-rnative';
   *
   * const { theme } = useTheme();
   * <Point dataX={0} dataY={42} color={theme.colors.bg.errorStrong} />
   * ```
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
  /**
   * When `true`, the scrubber magnetically snaps to this point within the
   * chart's `magnetRadius`. Requires `enableScrubbing` to be set on the
   * parent chart.
   * @default false
   */
  magnetic?: boolean;
  /**
   * Horizontal alignment of the label relative to the chart's drawing area.
   * With `'auto'`, a label that would overflow the left/right edge is anchored
   * to that edge and grows inward instead of being clipped, while the arrow
   * keeps pointing at the exact data point. Use `'center'` to always centre the
   * label on the point.
   * @default 'auto'
   */
  labelAlignment?: LabelAlignment;
};

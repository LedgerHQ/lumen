import type { ReactNode } from 'react';

import type { DrawingArea } from '../../utils/types';

export type ScrubberContextValue = {
  /**
   * Whether scrubbing interactions are enabled.
   */
  enableScrubbing: boolean;
  /**
   * The current data index of the scrubber, or undefined when idle.
   */
  scrubberPosition: number | undefined;
  /**
   * Callback to update the scrubber position.
   */
  onScrubberPositionChange: (index: number | undefined) => void;
};

export type ScrubberProviderProps = {
  children: ReactNode;
  /**
   * Width of the chart in pixels. Used to bound gesture detection.
   */
  width: number;
  /**
   * Height of the chart in pixels. Used to bound gesture detection.
   */
  height: number;
  /**
   * Whether scrubbing is enabled.
   */
  enableScrubbing: boolean;
  /**
   * Optional external callback fired whenever the scrubber position changes.
   */
  onScrubberPositionChange?: (index: number | undefined) => void;
  /**
   * Pixel radius within which the scrubber magnetically snaps to registered
   * magnetic points. Set to `0` to disable magnetisation.
   * @default 6
   */
  magnetRadius?: number;
};

export type ChartTooltipItemData = {
  /**
   * Label displayed on the left side of the row.
   */
  label: string | number;
  /**
   * Value displayed on the right side of the row.
   */
  value: string | number;
};

export type ChartTooltipItemProps = ChartTooltipItemData & {
  /**
   * X position in SVG coordinate space.
   * @default 0
   */
  x?: number;
  /**
   * Y midline position in SVG coordinate space.
   * @default 0
   */
  y?: number;
  /**
   * Width allocated to this row, used to right-align the value text.
   */
  width: number;
  /**
   * Optional callback ref forwarded to the label `<Text>` element.
   * Useful to measure the label's natural width via `getBBox` for auto-fit layouts.
   */
  labelRef?: (el: SvgBBoxElement | null) => void;
  /**
   * Optional callback ref forwarded to the value `<Text>` element.
   * Useful to measure the value's natural width via `getBBox` for auto-fit layouts.
   */
  valueRef?: (el: SvgBBoxElement | null) => void;
};

/**
 * Minimal interface for an SVG element that supports `getBBox`.
 * Handles both react-native-svg (returns `Rect | undefined`) and web DOM SVG
 * (returns `DOMRect` synchronously or a Promise on native bridge).
 */
export type SvgBBoxElement = {
  getBBox: () =>
    | { width: number }
    | undefined
    | Promise<{ width: number } | undefined>;
};

export type ScrubberTooltipLayoutProps = {
  /**
   * Horizontal gap in pixels between the scrubber line and the tooltip box.
   * @default 10
   */
  offset?: number;
  /**
   * Minimum width in pixels. The tooltip auto-fits to the rendered content
   * but never collapses below this floor; raise it to avoid jitter when
   * value length changes between indices.
   * @default 80
   */
  minWidth?: number;
};

export type ScrubberTooltipProps = ScrubberTooltipLayoutProps & {
  /**
   * Horizontal pixel position of the scrubber line within the SVG coordinate
   * space. Used to place the tooltip left or right of the line.
   */
  pixelX: number;
  /**
   * Bounding box of the chart's drawing area (x, y, width, height). Used to
   * constrain the tooltip so it never overflows the chart boundaries.
   */
  drawingArea: DrawingArea;
  /**
   * Optional title displayed at the top of the tooltip. Omit to render
   * the tooltip without a title row.
   */
  title?: string | number;
  /**
   * List of label/value pairs rendered as rows inside the tooltip body.
   */
  items: ChartTooltipItemData[];
};

/**
 * Return value of the `tooltip` callback on {@link ScrubberProps}.
 */
export type ScrubberTooltipContent = ScrubberTooltipLayoutProps & {
  /**
   * Optional header. Static value or callback per data index.
   * A callback may return `undefined` to suppress the title.
   */
  title?: string | number | ((index: number) => string | number | undefined);
  /**
   * Tooltip rows for this index. Return an empty array to hide the tooltip.
   */
  items: ChartTooltipItemData[];
};

export type ScrubberProps = {
  /**
   * Hides the vertical reference line.
   * @default false
   */
  hideLine?: boolean;
  /**
   * Hides the semi-transparent overlay that dims data after the scrubber position.
   * @default false
   */
  hideOverlay?: boolean;
  /**
   * Shows the beacon dots on each series at the scrubbed data index.
   * @default false
   */
  showBeacons?: boolean;
  /**
   * Produces tooltip content for the active data index. When set, {@link DefaultScrubberTooltip}
   * is rendered. Optional `offset` and `minWidth` on the returned object tune layout.
   * Return `{ items: [] }` to hide the tooltip at an index.
   */
  tooltip?: (dataIndex: number) => ScrubberTooltipContent;
};

import type { ReactElement, ReactNode, RefObject, SVGProps } from 'react';

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
   * Ref to the root SVG element where event listeners will be attached.
   */
  svgRef: RefObject<SVGSVGElement | null>;
  /**
   * Whether scrubbing is enabled.
   */
  enableScrubbing: boolean;
  /**
   * Optional external callback fired whenever the scrubber position changes.
   */
  onScrubberPositionChange?: (index: number | undefined) => void;
};

/**
 * Valid content for an SVG `<text>` element: a plain string,
 * a number, or a `<tspan>` element.
 */
export type SvgTextContent =
  | string
  | number
  | ReactElement<SVGProps<SVGTSpanElement>, 'tspan'>;

export type ChartTooltipItemData = {
  /** Label displayed on the left side of the row. */
  label: SvgTextContent;
  /** Value displayed on the right side of the row. */
  value: SvgTextContent;
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
};

export type ScrubberTooltipProps = {
  pixelX: number;
  drawingArea: DrawingArea;
  dataIndex: number;
  title?: SvgTextContent | null;
  items: ChartTooltipItemData[];
  /**
   * Horizontal gap in pixels between the scrubber line and the tooltip box.
   * @default 10
   */
  offset?: number;
  /**
   * Fixed width of the tooltip box in pixels.
   * @default 120
   */
  tooltipWidth?: number;
};

/**
 * Return value of the `tooltip` callback on {@link ScrubberProps}.
 */
export type ScrubberTooltipContent = {
  /**
   * Optional header. Static value or callback per data index.
   * A callback may return `null` or `undefined` to suppress the title.
   */
  title?:
    | SvgTextContent
    | ((index: number) => SvgTextContent | null | undefined);
  /**
   * Tooltip rows for this index. Return an empty array to hide the tooltip.
   */
  items: ChartTooltipItemData[];
  /**
   * Horizontal gap in pixels between the scrubber line and the tooltip box.
   * @default 10
   */
  offset?: number;
  /**
   * Fixed width of the tooltip box in pixels.
   * @default 120
   */
  tooltipWidth?: number;
};

export type ScrubberProps = {
  /**
   * Formats a label string shown above the reference line for a given data index.
   * When omitted, no label is rendered.
   */
  label?: (dataIndex: number) => string;
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
   * is rendered. Optional `offset` and `tooltipWidth` on the returned object tune layout.
   * Return `{ items: [] }` to hide the tooltip at an index.
   */
  tooltip?: (dataIndex: number) => ScrubberTooltipContent;
};

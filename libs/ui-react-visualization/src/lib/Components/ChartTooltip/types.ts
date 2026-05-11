import type { ReactNode } from 'react';

export type ChartTooltipItemData = {
  title: ReactNode;
  value: ReactNode;
};

export type ChartTooltipItemProps = {
  title: ReactNode;
  value: ReactNode;
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

export type ChartTooltipProps = {
  /**
   * Produces tooltip rows from the active data index.
   * Each returned item is rendered as a `<ChartTooltipItem>`.
   * Return an empty array to suppress the tooltip at a given index.
   */
  items: (index: number) => ChartTooltipItemData[];
  /**
   * Horizontal gap in pixels between the scrubber line and the tooltip box.
   * @default 10
   */
  offset?: number;
  /**
   * Which side of the scrubber line the tooltip appears on.
   * `'auto'` flips to the left when the right side would overflow.
   * @default 'auto'
   */
  side?: 'auto' | 'left' | 'right';
  /**
   * Fixed width of the tooltip box in pixels.
   * Used for flip-side detection and for right-aligning value text.
   * @default 120
   */
  tooltipWidth?: number;
};

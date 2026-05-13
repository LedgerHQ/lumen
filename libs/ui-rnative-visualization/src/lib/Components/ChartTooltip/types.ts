export type ChartTooltipItemData = {
  /** Label displayed on the left side of the row. */
  label: string | number;
  /** Value displayed on the right side of the row. */
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
};

export type ChartTooltipProps = {
  /**
   * Optional header rendered at the top of the tooltip card.
   * Accepts a static value or a callback receiving the active data index.
   * A callback may return `null` or `undefined` to suppress the title for a
   * specific data index without unmounting the tooltip.
   */
  title?:
    | string
    | number
    | ((index: number) => string | number | null | undefined);
  /**
   * Produces tooltip rows from the active data index.
   * Each returned item is rendered as a `ChartTooltipItem`.
   * Return an empty array to suppress the tooltip at a given index.
   */
  items: (index: number) => ChartTooltipItemData[];
  /**
   * Horizontal gap in pixels between the scrubber line and the tooltip box.
   * @default 10
   */
  offset?: number;
  /**
   * Fixed width of the tooltip box in pixels.
   * Used for flip-side detection and for right-aligning value text.
   * @default 80
   */
  tooltipWidth?: number;
};

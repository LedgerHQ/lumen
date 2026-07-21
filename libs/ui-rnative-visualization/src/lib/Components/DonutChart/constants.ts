/** Ring dimensions for a given size, in SVG user units. */
export type DonutGeometry = {
  box: number;
  innerRadius: number;
  outerRadius: number;
  cornerRadius: number;
  padAngle: number;
};

/** Per-size geometry measured from Figma; kept in one place for refinement. */
export const DONUT_GEOMETRY = {
  md: {
    box: 168,
    innerRadius: 61,
    outerRadius: 83,
    cornerRadius: 4,
    padAngle: 0.06,
  },
  sm: {
    box: 80,
    innerRadius: 28,
    outerRadius: 39,
    cornerRadius: 2,
    padAngle: 0.08,
  },
} as const satisfies Record<string, DonutGeometry>;

export type DonutSizeKey = keyof typeof DONUT_GEOMETRY;

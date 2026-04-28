export const DEFAULT_SIZE = 10;
export const STROKE_WIDTH = 2;
export const LABEL_FONT_SIZE = 10;
export const ARROW_WIDTH = 6;
export const ARROW_HEIGHT = 4;
export const GAP = 4;

export const isWithinBounds = (
  px: number,
  py: number,
  area: { x: number; y: number; width: number; height: number },
): boolean =>
  px >= area.x &&
  px <= area.x + area.width &&
  py >= area.y &&
  py <= area.y + area.height;

/**
 * Builds the three SVG points of the arrow triangle.
 *
 * `'top'`    → arrow sits below the label, tip pointing **down** toward the circle.
 * `'bottom'` → arrow sits above the label, tip pointing **up** toward the circle.
 */
export const buildArrowPoints = (
  cx: number,
  cy: number,
  radius: number,
  position: 'top' | 'bottom',
): string => {
  const halfW = ARROW_WIDTH / 2;

  if (position === 'top') {
    const tipY = cy - radius - GAP;
    const baseY = tipY - ARROW_HEIGHT;
    return `${cx},${tipY} ${cx - halfW},${baseY} ${cx + halfW},${baseY}`;
  }

  const tipY = cy + radius + GAP;
  const baseY = tipY + ARROW_HEIGHT;
  return `${cx},${tipY} ${cx - halfW},${baseY} ${cx + halfW},${baseY}`;
};

/**
 * Resolves the label prop to a string or undefined.
 */
export const resolveLabel = (
  label: string | ((dataIndex: number) => string) | undefined,
  dataX: number,
): string | undefined => {
  const resolved = typeof label === 'function' ? label(dataX) : label;
  return resolved === '' ? undefined : resolved;
};

/**
 * Computes the vertical position of the label text baseline.
 */
export const computeLabelY = (
  pixelY: number,
  radius: number,
  labelPosition: 'top' | 'bottom',
  renderArrow: boolean,
): number => {
  const arrowOffset = renderArrow ? ARROW_HEIGHT + GAP : GAP;

  return labelPosition === 'top'
    ? pixelY - radius - arrowOffset - GAP
    : pixelY + radius + arrowOffset + GAP + LABEL_FONT_SIZE;
};

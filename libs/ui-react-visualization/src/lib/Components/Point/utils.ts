import type { DrawingArea } from '../../utils/types';
import type { BaseAxisProps } from '../Axis';
import {
  ARROW_HEIGHT,
  ARROW_WIDTH,
  GAP,
  LABEL_CHAR_WIDTH_RATIO,
  LABEL_FONT_SIZE,
} from './constants';

export type LabelTextAnchor = 'start' | 'middle' | 'end';

export const isWithinBounds = (
  px: number,
  py: number,
  area: DrawingArea,
): boolean =>
  px >= area.x &&
  px <= area.x + area.width &&
  py >= area.y &&
  py <= area.y + area.height;

/**
 * Builds the three SVG points of the arrow triangle.
 *
 * `'top'`  → arrow sits below the label, tip pointing **down** toward the circle.
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

export const resolveDataXToIndex = (
  dataX: number,
  axisConfig: BaseAxisProps | undefined,
): number | undefined => {
  const axisData = axisConfig?.data;
  if (!axisData || typeof axisData[0] !== 'number') return dataX;
  const index = (axisData as number[]).indexOf(dataX);
  if (index === -1) return undefined;
  return index;
};

/**
 * Computes the label's horizontal placement, keeping it inside the drawing area
 * near the left/right edges. Centred on the point when it fits; otherwise
 * anchored to the edge and aligned with the arrow's outer vertex (offset by half
 * the arrow width from the point, when an arrow is rendered).
 */
export const computeLabelX = (
  pixelX: number,
  label: string,
  area: DrawingArea,
  clamp: boolean,
  hasArrow: boolean,
): { x: number; textAnchor: LabelTextAnchor } => {
  if (!clamp) {
    return { x: pixelX, textAnchor: 'middle' };
  }

  const halfWidth =
    (label.length * LABEL_FONT_SIZE * LABEL_CHAR_WIDTH_RATIO) / 2;
  const arrowOffset = hasArrow ? ARROW_WIDTH / 2 : 0;

  if (pixelX - halfWidth < area.x) {
    return { x: pixelX - arrowOffset, textAnchor: 'start' };
  }
  if (pixelX + halfWidth > area.x + area.width) {
    return { x: pixelX + arrowOffset, textAnchor: 'end' };
  }
  return { x: pixelX, textAnchor: 'middle' };
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

/**
 * Computes where a point's label and its connector arrow are drawn: the
 * (optionally clamped) horizontal placement, the vertical baseline, and whether
 * the arrow is rendered. Label content is resolved separately via
 * {@link resolveLabel}.
 */
export const computeLabelGeometry = ({
  text,
  pixelX,
  pixelY,
  size,
  labelPosition,
  showLabelArrow,
  area,
  clamp,
}: {
  text: string;
  pixelX: number;
  pixelY: number;
  size: number;
  labelPosition: 'top' | 'bottom';
  showLabelArrow: boolean;
  area: DrawingArea;
  clamp: boolean;
}): {
  x: number;
  y: number;
  textAnchor: LabelTextAnchor;
  renderArrow: boolean;
} => {
  const { x, textAnchor } = computeLabelX(
    pixelX,
    text,
    area,
    clamp,
    showLabelArrow,
  );
  const y = computeLabelY(pixelY, size / 2, labelPosition, showLabelArrow);

  return { x, y, textAnchor, renderArrow: showLabelArrow };
};

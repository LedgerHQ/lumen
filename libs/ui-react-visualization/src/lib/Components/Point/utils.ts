import { chartConfig } from '../../config';
import type { DrawingArea } from '../../utils/types';
import type { BaseAxisProps } from '../Axis';
import type { LabelAlignment } from './types';

const { point } = chartConfig;

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
  const halfW = point.arrowWidth / 2;

  if (position === 'top') {
    const tipY = cy - radius - point.labelGap;
    const baseY = tipY - point.arrowHeight;
    return `${cx},${tipY} ${cx - halfW},${baseY} ${cx + halfW},${baseY}`;
  }

  const tipY = cy + radius + point.labelGap;
  const baseY = tipY + point.arrowHeight;
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
  alignment: LabelAlignment,
  hasArrow: boolean,
): { x: number; textAnchor: LabelTextAnchor } => {
  if (alignment === 'center') {
    return { x: pixelX, textAnchor: 'middle' };
  }

  const halfWidth =
    (label.length * point.labelFontSize * point.labelCharWidthRatio) / 2;
  const arrowOffset = hasArrow ? point.arrowWidth / 2 : 0;

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
  const arrowOffset = renderArrow
    ? point.arrowHeight + point.labelGap
    : point.labelGap;

  return labelPosition === 'top'
    ? pixelY - radius - arrowOffset - point.labelGap
    : pixelY + radius + arrowOffset + point.labelGap + point.labelFontSize;
};

/**
 * Computes where a point's label is drawn: the (optionally clamped) horizontal
 * placement and the vertical baseline. Label content is resolved separately via
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
  alignment,
}: {
  text: string;
  pixelX: number;
  pixelY: number;
  size: number;
  labelPosition: 'top' | 'bottom';
  showLabelArrow: boolean;
  area: DrawingArea;
  alignment: LabelAlignment;
}): {
  x: number;
  y: number;
  textAnchor: LabelTextAnchor;
} => {
  const { x, textAnchor } = computeLabelX(
    pixelX,
    text,
    area,
    alignment,
    showLabelArrow,
  );
  const y = computeLabelY(pixelY, size / 2, labelPosition, showLabelArrow);

  return { x, y, textAnchor };
};

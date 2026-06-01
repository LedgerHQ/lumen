import { useEffect } from 'react';

import type { AxisConfigProps, DrawingArea } from '../../utils/types';
import { ARROW_HEIGHT, ARROW_WIDTH, GAP, LABEL_FONT_SIZE } from './constants';
import type { MagneticPointsContextValue } from './pointContext/magneticPointsContext';

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
  axisConfig: AxisConfigProps | undefined,
): number | undefined => {
  const axisData = axisConfig?.data;
  if (!axisData || typeof axisData[0] !== 'number') return dataX;
  const index = (axisData as number[]).indexOf(dataX);
  if (index === -1) return undefined;
  return index;
};

/**
 * Registers/unregisters a data index as a magnetic snap target
 * when the Point has `magnetic` enabled.
 */
export const useMagneticRegistration = (
  magnetic: boolean,
  dataX: number,
  getXAxisConfig: () => AxisConfigProps | undefined,
  { register, unregister }: MagneticPointsContextValue,
): void => {
  useEffect(() => {
    if (!magnetic) return;
    const index = resolveDataXToIndex(dataX, getXAxisConfig());
    if (index === undefined) return;
    register(index);
    return () => unregister(index);
  }, [magnetic, dataX, getXAxisConfig, register, unregister]);
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

import type { BaseAxisProps } from '../../Axis';
import { getTickLabel } from '../../utils/ticks/ticks';
import type { LineLabelContext } from '../types';

/**
 * Resolves the x-axis value at `dataIndex` and formats it the same way the
 * axis formats its tick labels.
 */
export const resolveLineLabelContext = (
  dataIndex: number,
  axisConfig: BaseAxisProps | undefined,
): LineLabelContext => {
  const value = axisConfig?.data?.[dataIndex] ?? dataIndex;
  const tick = typeof value === 'number' ? value : dataIndex;

  return {
    dataIndex,
    value,
    label: getTickLabel(tick, axisConfig?.data, axisConfig?.tickLabelFormatter),
  };
};

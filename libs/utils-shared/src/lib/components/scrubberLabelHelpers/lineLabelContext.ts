import type { LineLabelAxis, LineLabelContext } from './types';

/**
 * Resolves the x-axis value at `dataIndex` and formats it the same way the
 * axis formats its tick labels.
 */
export const resolveLineLabelContext = (
  dataIndex: number,
  axis: LineLabelAxis | undefined,
): LineLabelContext => {
  const value = axis?.data?.[dataIndex] ?? dataIndex;
  const formatter = axis?.tickLabelFormatter;

  return {
    dataIndex,
    value,
    label: formatter ? String(formatter(value)) : String(value),
  };
};

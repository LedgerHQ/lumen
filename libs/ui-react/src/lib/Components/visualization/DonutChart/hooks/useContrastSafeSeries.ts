import {
  getContrastSafeColor,
  primitiveColorTokens,
} from '@ledgerhq/lumen-design-core';
import { useMemo } from 'react';
import { useTheme } from '../../../core/ThemeProvider';

import type { DonutSegment } from '../types';

/**
 * The series with each segment `color` nudged away from the surface it is drawn
 * on, so a palette close in lightness to the background stays readable.
 *
 * `grey.050` is the base surface fill in both color schemes, and colorless
 * segments are left alone: the ring paints them with its neutral default, which
 * is already contrast-safe. Returns `series` untouched when `enabled` is false,
 * keeping its identity stable for downstream memos.
 */
export const useContrastSafeSeries = (
  series: DonutSegment[],
  enabled: boolean,
): DonutSegment[] => {
  const { colorScheme } = useTheme();
  const bgColor =
    colorScheme === 'dark'
      ? primitiveColorTokens.dark.grey['050']
      : primitiveColorTokens.light.grey['050'];

  return useMemo(() => {
    if (!enabled) {
      return series;
    }
    return series.map((segment) =>
      segment.color
        ? { ...segment, color: getContrastSafeColor(segment.color, bgColor) }
        : segment,
    );
  }, [series, enabled, bgColor]);
};

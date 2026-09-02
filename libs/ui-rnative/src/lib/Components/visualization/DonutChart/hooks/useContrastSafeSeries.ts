import { getContrastSafeColor } from '@ledgerhq/lumen-design-core';
import { useTheme } from '@ledgerhq/lumen-ui-rnative';
import { useMemo } from 'react';

import type { DonutSegment } from '../types';

/**
 * The series with each segment `color` nudged away from the surface it is drawn
 * on, so a palette close in lightness to the background stays readable.
 *
 * Colorless segments are left alone: the ring paints them with its neutral
 * default, which is already contrast-safe. Returns `series` untouched when
 * `enabled` is false, keeping its identity stable for downstream memos.
 */
export const useContrastSafeSeries = (
  series: DonutSegment[],
  enabled: boolean,
): DonutSegment[] => {
  const { theme } = useTheme();
  const bgColor = theme.colors.bg.canvas;

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

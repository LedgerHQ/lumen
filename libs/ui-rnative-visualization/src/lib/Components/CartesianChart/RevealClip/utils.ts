import { useEffect, useId } from 'react';
import {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import type { DrawingArea, Series } from '../../../utils/types';
import { OVERFLOW_BUFFER } from '../utils';

type RevealClipAnimationConfig = {
  durationMs: number;
  drawingArea: DrawingArea;
  dataFingerprint: string;
};

type RevealClipAnimationResult = {
  clipId: string;
  animatedRectProps: ReturnType<typeof useAnimatedProps>;
};

export const useRevealClipAnimation = ({
  durationMs,
  drawingArea,
  dataFingerprint,
}: RevealClipAnimationConfig): RevealClipAnimationResult => {
  const clipId = useId();
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = 0;
    width.value = withTiming(
      drawingArea.width + OVERFLOW_BUFFER.left + OVERFLOW_BUFFER.right,
      { duration: durationMs },
    );
  }, [drawingArea.width, durationMs, width, dataFingerprint]);

  const animatedRectProps = useAnimatedProps(() => ({
    width: width.value,
  }));

  return { clipId, animatedRectProps };
};

export const useComputeDataFingerprint = ({
  series,
}: {
  series: Series[];
}): string => {
  return series.map((s) => s.data?.join(',') ?? '').join('|');
};

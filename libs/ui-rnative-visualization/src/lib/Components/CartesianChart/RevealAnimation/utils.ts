import { useEffect, useId, useMemo, useRef } from 'react';
import {
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import type { DrawingArea, Series } from '../../../utils/types';
import { OVERFLOW_BUFFER } from '../utils';

/**
 * Duration in ms of an individual point's opacity fade-in.
 */
const POINT_FADE_DURATION_MS = 200;
const POINT_FADE_IN_AFTER_CLIP_MS = -100;

type RevealAnimationConfig = {
  durationMs: number;
  drawingArea: DrawingArea;
  dataFingerprint: string;
};

type RevealAnimationResult = {
  clipId: string;
  animatedRectProps: ReturnType<typeof useAnimatedProps>;
  pointOpacity: ReturnType<typeof useSharedValue<number>>;
};

/**
 * Drives the two reveal animations:
 * - the left-to-right clip-path wipe (animated `Rect` width, including the
 *   {@link OVERFLOW_BUFFER} so edge content is revealed too), and
 * - the point fade-in, delayed so points appear as the wipe finishes.
 *
 * On a data change the shared values are reset to `0` (hidden) *synchronously
 * during render* — before the new line/points are committed and painted — so
 * they never paint once at the previous cycle's end values (a visible flash).
 * The effect then animates them back in.
 */
export const useRevealAnimation = ({
  durationMs,
  drawingArea,
  dataFingerprint,
}: RevealAnimationConfig): RevealAnimationResult => {
  const clipId = useId();
  const clipWidth = useSharedValue(0);
  const pointOpacity = useSharedValue(0);

  const previousFingerprint = useRef<string | null>(null);
  if (previousFingerprint.current !== dataFingerprint) {
    previousFingerprint.current = dataFingerprint;
    clipWidth.value = 0;
    pointOpacity.value = 0;
  }

  useEffect(() => {
    clipWidth.value = withTiming(
      drawingArea.width + OVERFLOW_BUFFER.left + OVERFLOW_BUFFER.right,
      { duration: durationMs },
    );

    pointOpacity.value = withDelay(
      Math.max(durationMs + POINT_FADE_IN_AFTER_CLIP_MS, 0),
      withTiming(1, { duration: POINT_FADE_DURATION_MS }),
    );
  }, [drawingArea.width, durationMs, clipWidth, pointOpacity, dataFingerprint]);

  const animatedRectProps = useAnimatedProps(() => ({
    width: clipWidth.value,
  }));

  return { clipId, animatedRectProps, pointOpacity };
};

/**
 * Stable signature of every series' data points, memoized on the `series`
 * reference. Used to key the reveal provider so the reveal animation only
 * replays when the underlying data actually changes — not on unrelated
 * re-renders such as scrubbing or hover.
 */
export const useDataFingerprint = (series: Series[]): string => {
  return useMemo(
    () => series.map((s) => s.data?.join(',') ?? '').join('|'),
    [series],
  );
};

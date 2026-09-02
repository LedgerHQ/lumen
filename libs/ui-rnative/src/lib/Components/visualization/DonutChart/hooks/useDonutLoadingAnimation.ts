import { useEffect } from 'react';
import {
  cancelAnimation,
  Easing,
  useAnimatedProps,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { chartConfig } from '../../../config';

const { loading } = chartConfig.donut;

const DURATION_IN_MS = loading.duration;
const FULL_TURN = 2 * Math.PI;

/**
 * Drives the loading wave: a single linear 0→1 clock, looping forever, that
 * every placeholder segment reads with its own phase offset.
 */
export const useDonutLoadingAnimation = (): SharedValue<number> => {
  const progress = useSharedValue(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      cancelAnimation(progress);
      progress.value = 0;
      return;
    }

    progress.value = withRepeat(
      withTiming(1, { duration: DURATION_IN_MS, easing: Easing.linear }),
      -1,
      false,
    );

    return () => {
      cancelAnimation(progress);
    };
  }, [reducedMotion, progress]);

  return progress;
};

/**
 * Opacity for one placeholder segment, offset so the pulse peaks later the
 * further the segment sits clockwise from 12 o'clock. The cosine is the RN
 * counterpart of the web keyframes' eased 1 → `minOpacity` → 1 pulse.
 */
export const useDonutLoadingSegmentProps = (
  progress: SharedValue<number>,
  midAngle: number,
): ReturnType<typeof useAnimatedProps> => {
  const phaseOffset = (FULL_TURN - midAngle) / FULL_TURN;

  return useAnimatedProps(() => {
    const phase = (progress.value + phaseOffset) % 1;
    const pulse = (1 + Math.cos(FULL_TURN * phase)) / 2;

    return { opacity: loading.minOpacity + (1 - loading.minOpacity) * pulse };
  });
};

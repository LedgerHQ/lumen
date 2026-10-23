import { useEffect } from 'react';
import {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTimingConfig } from '../../animations/useTimingConfig';

/**
 * Animates the fill width to the given percentage. It starts at the initial
 * value, so the first render does not animate.
 */
export const useAnimatedProgressWidth = (
  value: number,
): ReturnType<typeof useAnimatedStyle> => {
  const progress = useSharedValue(value);
  const timingConfig = useTimingConfig({ duration: 200, easing: 'easeOut' });

  useEffect(() => {
    progress.value = withTiming(value, timingConfig);
    return () => cancelAnimation(progress);
  }, [value, progress, timingConfig]);

  return useAnimatedStyle(() => ({ width: `${progress.value}%` }), [progress]);
};

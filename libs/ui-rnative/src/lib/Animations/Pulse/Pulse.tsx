import { useEffect, memo } from 'react';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { TimingTokens } from '../types';
import { useTimingConfig } from '../useTimingConfig';
import { PulseProps } from './types';

const MIN_OPACITY = 0.35;

const PULSE_TIMING_DEFAULTS: TimingTokens = {
  duration: 1000,
  easing: 'linear',
};
export const Pulse = memo(({ children, timing, animate }: PulseProps) => {
  const sv = useSharedValue<number>(1);

  const timingConfig = useTimingConfig({
    duration: timing?.duration ?? PULSE_TIMING_DEFAULTS.duration,
    easing: timing?.easing ?? PULSE_TIMING_DEFAULTS.easing,
  });

  useEffect(() => {
    if (animate) {
      sv.value = withRepeat(
        withSequence(
          withTiming(MIN_OPACITY, timingConfig),
          withTiming(1, timingConfig),
        ),
        -1,
      );
    } else {
      cancelAnimation(sv);
      sv.value = withTiming(1, timingConfig);
    }

    return () => cancelAnimation(sv);
  }, [sv, animate, timingConfig]);

  const animatedStyle = useAnimatedStyle(
    () => ({
      opacity: sv.value,
    }),
    [sv],
  );

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
});
Pulse.displayName = 'Pulse';

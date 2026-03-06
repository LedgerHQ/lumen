import { memo, useEffect } from 'react';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { TimingTokens } from '../types';
import { useTimingConfig } from '../useTimingConfig';
import { SpinProps } from './types';

const SPIN_TIMING_DEFAULTS: TimingTokens = {
  duration: 1000,
  easing: 'linear',
};
export const Spin = memo(({ children, timing }: SpinProps) => {
  const sv = useSharedValue<number>(0);

  const timingConfig = useTimingConfig({
    duration: timing?.duration ?? SPIN_TIMING_DEFAULTS.duration,
    easing: timing?.easing ?? SPIN_TIMING_DEFAULTS.easing,
  });

  useEffect(() => {
    sv.value = withRepeat(withTiming(1, timingConfig), -1);

    return () => cancelAnimation(sv);
  }, [sv, timingConfig]);

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ rotate: `${sv.value * 360}deg` }],
    }),
    [sv],
  );

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
});
Spin.displayName = 'Spin';

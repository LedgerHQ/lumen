import { memo, useEffect } from 'react';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import type { TimingTokens } from '../types';
import { useTimingConfig } from '../useTimingConfig';
import type { SpinProps } from './types';

const TIMING_DEFAULTS: TimingTokens = {
  duration: 1000,
  easing: 'linear',
};
export const Spin = memo(({ children, timing }: SpinProps) => {
  const sv = useSharedValue<number>(0);

  const timingConfig = useTimingConfig({
    duration: timing?.duration ?? TIMING_DEFAULTS.duration,
    easing: timing?.easing ?? TIMING_DEFAULTS.easing,
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

  return (
    <Animated.View style={[{ alignSelf: 'flex-start' }, animatedStyle]}>
      {children}
    </Animated.View>
  );
});
Spin.displayName = 'Spin';

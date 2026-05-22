import { useEffect, memo } from 'react';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useResolveViewStyle } from '../../../styles';
import type { TimingTokens } from '../types';
import { useTimingConfig } from '../useTimingConfig';
import type { PulseProps } from './types';

const MIN_OPACITY = 0.35;

const TIMING_DEFAULTS: TimingTokens = {
  duration: 1000,
  easing: 'linear',
};
export const Pulse = memo(
  ({ children, timing, animate, style, lx = {}, ...props }: PulseProps) => {
    const sv = useSharedValue<number>(1);
    const resolvedLxStyle = useResolveViewStyle(lx, style);

    const timingConfig = useTimingConfig({
      duration: timing?.duration ?? TIMING_DEFAULTS.duration,
      easing: timing?.easing ?? TIMING_DEFAULTS.easing,
    });

    useEffect(() => {
      if (animate) {
        sv.value = withRepeat(withTiming(MIN_OPACITY, timingConfig), -1, true);
      } else {
        cancelAnimation(sv);
        sv.value = withTiming(1, timingConfig);
      }

      return () => {
        cancelAnimation(sv);
        sv.value = 1;
      };
    }, [sv, animate, timingConfig]);

    const animatedStyle = useAnimatedStyle(() => ({
      opacity: sv.value,
    }));

    return (
      <Animated.View
        {...props}
        collapsable={false}
        style={[resolvedLxStyle, animatedStyle]}
      >
        {children}
      </Animated.View>
    );
  },
);
Pulse.displayName = 'Pulse';

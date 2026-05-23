import { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import type { RevealClipDefsProps } from './types';
import { useComputeDataFingerprint } from './utils';

const DEFAULT_DURATION_IN_SECONDS = 0.8;

export function RevealClipDefs({
  children,
  width,
  height,
  series,
  animate = true,
  transitions,
}: RevealClipDefsProps) {
  const isDisabled = !animate;
  const durationMs =
    (transitions?.enter?.duration ?? DEFAULT_DURATION_IN_SECONDS) * 1000;

  const dataFingerprint = useComputeDataFingerprint({ series });
  const animatedWidth = useSharedValue(isDisabled ? width : 0);

  useEffect(() => {
    if (isDisabled) {
      animatedWidth.value = width;
      return;
    }
    animatedWidth.value = 0;
    animatedWidth.value = withTiming(width, { duration: durationMs });
  }, [width, durationMs, animatedWidth, dataFingerprint, isDisabled]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: animatedWidth.value,
    height,
    overflow: 'hidden' as const,
  }));

  if (isDisabled) {
    return <>{children}</>;
  }

  return (
    <Animated.View key={dataFingerprint} style={animatedStyle}>
      {children}
    </Animated.View>
  );
}

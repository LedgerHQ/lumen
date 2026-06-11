import { useEffect } from 'react';
import {
  cancelAnimation,
  Easing,
  useAnimatedProps,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const HALF_PULSE_DURATION_IN_MS = 1000;
const MIN_OPACITY = 0.5;

type ShimmerAnimationResult = {
  animatedProps: ReturnType<typeof useAnimatedProps>;
};

/**
 * Self-contained shimmer (opacity pulse) for SVG content, the RN counterpart of
 * the web's CSS-keyframe shimmer. Shared by the initial loading placeholder and
 * the transition-loading line. Honors the user's reduced-motion preference by
 * keeping the content fully opaque.
 */
export const useShimmerAnimation = (animate = true): ShimmerAnimationResult => {
  const opacity = useSharedValue(1);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (animate && !reducedMotion) {
      opacity.value = withRepeat(
        withTiming(MIN_OPACITY, {
          duration: HALF_PULSE_DURATION_IN_MS,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true,
      );
    } else {
      cancelAnimation(opacity);
      opacity.value = 1;
    }

    return () => {
      cancelAnimation(opacity);
    };
  }, [animate, reducedMotion, opacity]);

  const animatedProps = useAnimatedProps(() => ({ opacity: opacity.value }));

  return { animatedProps };
};

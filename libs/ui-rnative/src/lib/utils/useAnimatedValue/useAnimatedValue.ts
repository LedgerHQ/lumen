import { useEffect, useRef } from 'react';
import { Animated, Easing, EasingFunction } from 'react-native';

type UseAnimatedValueOptions = {
  /** Target numeric value to animate towards. */
  toValue: number;
  /** Animation duration in milliseconds. @default 300 */
  duration?: number;
  /** Easing function. @default Easing.inOut(Easing.ease) */
  easing?: EasingFunction;
  /** Whether to use the native animation driver. @default false */
  useNativeDriver?: boolean;
};

/**
 * A reusable hook that returns an `Animated.Value` which smoothly
 * transitions whenever `toValue` changes.
 *
 * Useful for animating SVG props, opacity, transforms, or any numeric
 * value that should transition over time.
 *
 * @example
 * ```tsx
 * const animatedOffset = useAnimatedValue({ toValue: dashOffset });
 *
 * <AnimatedCircle strokeDashoffset={animatedOffset} />
 * ```
 *
 * @example
 * ```tsx
 * const opacity = useAnimatedValue({
 *   toValue: visible ? 1 : 0,
 *   duration: 200,
 *   useNativeDriver: true,
 * });
 *
 * <Animated.View style={{ opacity }} />
 * ```
 */
export const useAnimatedValue = ({
  toValue,
  duration = 300,
  easing = Easing.inOut(Easing.ease),
  useNativeDriver = false,
}: UseAnimatedValueOptions): Animated.Value => {
  const animatedValue = useRef(new Animated.Value(toValue)).current;

  useEffect(() => {
    const animation = Animated.timing(animatedValue, {
      toValue,
      duration,
      easing,
      useNativeDriver,
    });
    animation.start();

    return () => animation.stop();
  }, [toValue, duration, easing, useNativeDriver, animatedValue]);

  return animatedValue;
};

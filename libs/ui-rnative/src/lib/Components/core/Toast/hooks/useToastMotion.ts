import { useEffect, useRef } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { useTimingConfig } from '../../../animations/useTimingConfig';
import type { ToastPosition } from '../types';

type UseToastMotionArgs = {
  position: ToastPosition;
  exiting: boolean;
};

type UseToastMotionReturn = {
  animatedStyle: ReturnType<typeof useAnimatedStyle>;
  translateX: SharedValue<number>;
  markDismissedViaSwipe: () => void;
};

export const useToastMotion = ({
  position,
  exiting,
}: UseToastMotionArgs): UseToastMotionReturn => {
  const enterTiming = useTimingConfig({ duration: 200, easing: 'easeIn' });
  const exitTiming = useTimingConfig({ duration: 200, easing: 'easeOut' });
  const enterOffset = position === 'top' ? -10 : 10;

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(enterOffset);
  const translateX = useSharedValue(0);

  const dismissedViaSwipeRef = useRef(false);
  const markDismissedViaSwipe = useRef(() => {
    dismissedViaSwipeRef.current = true;
  }).current;

  useEffect(() => {
    translateY.value = withTiming(0, enterTiming);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    opacity.value = withTiming(
      exiting ? 0 : 1,
      exiting ? exitTiming : enterTiming,
    );
    if (exiting && !dismissedViaSwipeRef.current) {
      translateY.value = withTiming(enterOffset, exitTiming);
    }
  }, [exiting, enterTiming, exitTiming, enterOffset, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(
    () => ({
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value },
        { translateX: translateX.value },
      ],
    }),
    [opacity, translateY, translateX],
  );

  return { animatedStyle, translateX, markDismissedViaSwipe };
};

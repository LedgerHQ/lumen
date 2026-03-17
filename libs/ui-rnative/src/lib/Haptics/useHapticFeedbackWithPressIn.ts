import { useCallback } from 'react';
import type { GestureResponderEvent } from 'react-native';
import { triggerHapticFeedback } from './triggerHapticFeedback';
import type { HapticFeedback } from './types';

export type UseHapticFeedbackWithPressInParams = {
  hapticFeedback?: HapticFeedback;
  onPressIn?: (event: GestureResponderEvent) => void;
};

export const useHapticFeedbackWithPressIn = ({
  hapticFeedback,
  onPressIn,
}: UseHapticFeedbackWithPressInParams): {
  handlePressIn: ((event: GestureResponderEvent) => void) | undefined;
} => {
  const handlerFn = useCallback(
    (event: GestureResponderEvent) => {
      if (hapticFeedback) {
        triggerHapticFeedback(hapticFeedback);
      }
      onPressIn?.(event);
    },
    [hapticFeedback, onPressIn],
  );

  const hasPressInHandler = Boolean(hapticFeedback || onPressIn);
  return {
    handlePressIn: hasPressInHandler ? handlerFn : undefined,
  };
};

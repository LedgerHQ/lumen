import { Platform, Vibration } from 'react-native';
import type { HapticFeedback } from './types';

const ANDROID_DURATIONS: Record<HapticFeedback, number> = {
  light: 10,
  medium: 25,
  heavy: 50,
};

/**
 * Triggers a haptic feedback vibration.
 *
 * On Android, vibrates for a duration proportional to the feedback intensity.
 * On iOS, always triggers the system default vibration (duration control
 * is not supported by the RN Vibration API on iOS).
 */
export const triggerHapticFeedback = (feedback: HapticFeedback): void => {
  if (Platform.OS === 'android') {
    Vibration.vibrate(ANDROID_DURATIONS[feedback]);
  } else {
    Vibration.vibrate();
  }
};

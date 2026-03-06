import * as Haptics from 'expo-haptics';
import type { HapticFeedback } from './types';

/**
 * Triggers a haptic feedback using expo-haptics.
 * Uses impact feedback (light / medium / heavy) on both iOS and Android.
 */
export const triggerHapticFeedback = (feedback: HapticFeedback): void => {
  void Haptics.impactAsync(feedback as Haptics.ImpactFeedbackStyle).catch(
    () => {
      // Ignore errors (e.g. unsupported platform or haptics disabled)
    },
  );
};

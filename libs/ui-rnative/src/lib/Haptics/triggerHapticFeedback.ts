import * as Haptics from 'expo-haptics';
import type { HapticFeedback } from './types';

/**
 * Triggers haptic impact feedback using expo-haptics.
 * Uses impact feedback on both iOS and Android.
 */
export const triggerHapticFeedback = (feedback: HapticFeedback): void => {
  Haptics.impactAsync(feedback as Haptics.ImpactFeedbackStyle);
};

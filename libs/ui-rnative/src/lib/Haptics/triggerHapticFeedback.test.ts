import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import * as Haptics from 'expo-haptics';
import { triggerHapticFeedback } from './triggerHapticFeedback';
import type { HapticFeedback } from './types';

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {
    light: 'light',
    medium: 'medium',
    heavy: 'heavy',
  },
}));

describe('triggerHapticFeedback', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each<[HapticFeedback, string]>([
    ['light', 'light'],
    ['medium', 'medium'],
    ['heavy', 'heavy'],
  ])(
    'calls impactAsync with "%s" style for "%s" feedback',
    (feedback, style) => {
      triggerHapticFeedback(feedback);
      expect(Haptics.impactAsync).toHaveBeenCalledWith(style);
    },
  );
});

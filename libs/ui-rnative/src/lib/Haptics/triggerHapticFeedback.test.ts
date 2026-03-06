import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { Platform, Vibration } from 'react-native';
import { triggerHapticFeedback } from './triggerHapticFeedback';
import type { HapticFeedback } from './types';

jest.mock('react-native', () => ({
  Platform: { OS: 'android' },
  Vibration: { vibrate: jest.fn() },
}));

describe('triggerHapticFeedback', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('on Android', () => {
    beforeEach(() => {
      (Platform as { OS: string }).OS = 'android';
    });

    it.each<[HapticFeedback, number]>([
      ['light', 10],
      ['medium', 25],
      ['heavy', 50],
    ])(
      'vibrates for "%s" feedback with %dms duration',
      (feedback, duration) => {
        triggerHapticFeedback(feedback);
        expect(Vibration.vibrate).toHaveBeenCalledWith(duration);
      },
    );
  });

  describe('on iOS', () => {
    beforeEach(() => {
      (Platform as { OS: string }).OS = 'ios';
    });

    it.each<HapticFeedback>(['light', 'medium', 'heavy'])(
      'triggers default system vibration for "%s"',
      (feedback) => {
        triggerHapticFeedback(feedback);
        expect(Vibration.vibrate).toHaveBeenCalledWith();
      },
    );
  });
});

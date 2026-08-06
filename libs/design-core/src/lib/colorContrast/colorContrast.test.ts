import { describe, expect, it } from 'vitest';
import { getContrastSafeColor } from './colorContrast';

describe('getContrastSafeColor', () => {
  describe('no adjustment needed', () => {
    it('returns the original string unchanged when delta >= threshold', () => {
      expect(getContrastSafeColor('#000000', '#ffffff')).toBe('#000000');
    });

    it('returns the original string unchanged when delta equals the threshold exactly', () => {
      expect(getContrastSafeColor('#cccccc', '#ffffff')).toBe('#cccccc');
    });

    it('respects a custom threshold, unchanged when already above it', () => {
      expect(getContrastSafeColor('#e5e5e5', '#ffffff', 8)).toBe('#e5e5e5');
    });
  });

  describe('lightness adjustment', () => {
    it('darkens a light fg that is too close to a light bg', () => {
      expect(getContrastSafeColor('#e5e5e5', '#ffffff')).toBe('#cccccc');
    });

    it('lightens a dark fg that is too close to a dark bg', () => {
      expect(getContrastSafeColor('#333333', '#1a1a1a')).toBe('#4d4d4d');
    });

    it('handles the achromatic white background correctly', () => {
      expect(getContrastSafeColor('#f0f0f0', '#ffffff')).toBe('#cccccc');
    });

    it('respects a custom threshold when adjusting', () => {
      expect(getContrastSafeColor('#e5e5e5', '#ffffff', 15)).toBe('#d9d9d9');
    });
  });

  describe('clamping', () => {
    it('clamps at 0 when darkening would go below black', () => {
      expect(getContrastSafeColor('#0d0d0d', '#1a1a1a')).toBe('#000000');
    });

    it('clamps at 100 when lightening would go above white', () => {
      expect(getContrastSafeColor('#f5f5f5', '#cccccc')).toBe('#ffffff');
    });
  });

  describe('error handling', () => {
    it('throws on an invalid fg hex string', () => {
      expect(() => getContrastSafeColor('not-a-hex', '#ffffff')).toThrow();
    });

    it('throws on an invalid bg hex string', () => {
      expect(() => getContrastSafeColor('#ffffff', 'not-a-hex')).toThrow();
    });

    it('throws on a CSS variable reference', () => {
      expect(() =>
        getContrastSafeColor('var(--color-bg-base)', '#ffffff'),
      ).toThrow();
    });
  });
});

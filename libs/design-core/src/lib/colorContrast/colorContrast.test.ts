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

  describe('chromatic colors', () => {
    it('handles a red-dominant fg against a dark bg', () => {
      const result = getContrastSafeColor('#ff4444', '#1a1a1a');
      expect(typeof result).toBe('string');
      expect(result).toMatch(/^#[0-9a-f]{6}$/i);
    });

    it('handles a green-dominant fg against a light bg', () => {
      const result = getContrastSafeColor('#44ff44', '#ffffff');
      expect(typeof result).toBe('string');
      expect(result).toMatch(/^#[0-9a-f]{6}$/i);
    });

    it('handles a blue-dominant fg against a light bg', () => {
      const result = getContrastSafeColor('#4444ff', '#ffffff');
      expect(typeof result).toBe('string');
      expect(result).toMatch(/^#[0-9a-f]{6}$/i);
    });

    it('returns a chromatic color unchanged when it already has sufficient contrast', () => {
      expect(getContrastSafeColor('#ff0000', '#000000')).toBe('#ff0000');
    });

    it('adjusts a dark red fg close to a dark bg', () => {
      const result = getContrastSafeColor('#800000', '#1a1a1a');
      expect(result).toMatch(/^#[0-9a-f]{6}$/i);
    });

    it('adjusts two close chromatic colors', () => {
      expect(getContrastSafeColor('#ff8080', '#ff9999')).toBe('#ff3333');
    });
  });

  describe('error handling', () => {
    it('returns the fg color unchanged when fg is not a hex string', () => {
      expect(getContrastSafeColor('not-a-hex', '#ffffff')).toBe('not-a-hex');
    });

    it('returns the fg color unchanged when bg is not a hex string', () => {
      expect(getContrastSafeColor('#ffffff', 'not-a-hex')).toBe('#ffffff');
    });

    it('returns the fg color unchanged when fg is a CSS variable reference', () => {
      expect(getContrastSafeColor('var(--color-bg-base)', '#ffffff')).toBe(
        'var(--color-bg-base)',
      );
    });
  });
});

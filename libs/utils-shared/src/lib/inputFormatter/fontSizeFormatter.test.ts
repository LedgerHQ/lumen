import { describe, it, expect } from 'vitest';
import { getFontSize } from './fontSizeFormatter';

describe('getFontSize', () => {
  describe('md (default)', () => {
    it('returns 48px for empty value', () => {
      expect(getFontSize('')).toBe(48);
    });

    it('returns 46px for single digit', () => {
      expect(getFontSize('5')).toBe(46);
    });

    it('scales down as digit count increases', () => {
      expect(getFontSize('12345')).toBe(38);
      expect(getFontSize('123456789')).toBe(30);
    });

    it('does not go below 17px', () => {
      expect(getFontSize('123456789012345678')).toBe(17);
    });
  });

  describe('sm', () => {
    it('returns 28px for empty value', () => {
      expect(getFontSize('', 'sm')).toBe(28);
    });

    it('returns 27px for single digit', () => {
      expect(getFontSize('5', 'sm')).toBe(27);
    });

    it('scales down more gradually than md', () => {
      expect(getFontSize('12345', 'sm')).toBe(23);
      expect(getFontSize('12345')).toBe(38);
    });

    it('does not go below 17px', () => {
      expect(getFontSize('12345678901', 'sm')).toBe(17);
    });
  });
});

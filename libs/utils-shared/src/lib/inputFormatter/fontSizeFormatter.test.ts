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

    it('stays at 28px for up to 6 digits (scaling starts after startAt)', () => {
      expect(getFontSize('5', 'sm')).toBe(28);
      expect(getFontSize('123456', 'sm')).toBe(28);
    });

    it('scales down after 6 digits', () => {
      // 7 digits: 28 - 1 * 2 = 26
      expect(getFontSize('1234567', 'sm')).toBe(26);
      // 10 digits: 28 - 4 * 2 = 20
      expect(getFontSize('1234567890', 'sm')).toBe(20);
    });

    it('does not go below 12px', () => {
      // 15 digits: 28 - 9 * 2 = 10 → clamped to 12
      expect(getFontSize('123456789012345', 'sm')).toBe(12);
    });
  });
});

import { describe, it, expect } from 'vitest';
import { AVATAR_COLORS, resolveAvatarColor } from './colors.js';

describe('resolveAvatarColor', () => {
  it('should return a color from the palette', () => {
    expect(AVATAR_COLORS).toContain(resolveAvatarColor('user-123'));
  });

  it('should be deterministic for the same identifier', () => {
    expect(resolveAvatarColor('user-123')).toBe(resolveAvatarColor('user-123'));
  });

  it('should handle an empty identifier', () => {
    expect(AVATAR_COLORS).toContain(resolveAvatarColor(''));
  });

  it('should distribute across the whole palette', () => {
    const used = new Set(
      Array.from({ length: 200 }, (_, i) => resolveAvatarColor(`user-${i}`)),
    );
    expect(used.size).toBe(AVATAR_COLORS.length);
  });
});

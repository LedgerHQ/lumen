import { describe, it, expect } from 'vitest';
import { AVATAR_COLOR_KEYS, resolveAvatarColorKey } from './colors.js';

describe('resolveAvatarColorKey', () => {
  it('should return a key from the palette', () => {
    expect(AVATAR_COLOR_KEYS).toContain(resolveAvatarColorKey('user-123'));
  });

  it('should be deterministic for the same identifier', () => {
    expect(resolveAvatarColorKey('user-123')).toBe(
      resolveAvatarColorKey('user-123'),
    );
  });

  it('should handle an empty identifier', () => {
    expect(AVATAR_COLOR_KEYS).toContain(resolveAvatarColorKey(''));
  });

  it('should distribute across the whole palette', () => {
    const used = new Set(
      Array.from({ length: 200 }, (_, i) => resolveAvatarColorKey(`user-${i}`)),
    );
    expect(used.size).toBe(AVATAR_COLOR_KEYS.length);
  });
});

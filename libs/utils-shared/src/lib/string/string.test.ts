import { describe, it, expect } from 'vitest';
import { hashString } from './string.js';

describe('hashString', () => {
  it('should be deterministic for the same input', () => {
    expect(hashString('user-123')).toBe(hashString('user-123'));
  });

  it('should produce different hashes for different inputs', () => {
    expect(hashString('user-1')).not.toBe(hashString('user-2'));
  });

  it('should return 0 for an empty string', () => {
    expect(hashString('')).toBe(0);
  });
});

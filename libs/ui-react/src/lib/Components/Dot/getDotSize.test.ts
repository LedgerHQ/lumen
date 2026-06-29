import { describe, it, expect } from 'vitest';
import { getDotSize } from './getDotSize';

describe('getDotSize', () => {
  it('resolves avatar dot sizes', () => {
    expect(getDotSize('avatar', 'sm')).toBe('lg');
    expect(getDotSize('avatar', 'md')).toBe('xl');
  });

  it('resolves mediaImage dot sizes', () => {
    expect(getDotSize('mediaImage', 40)).toBe(16);
    expect(getDotSize('mediaImage', 48)).toBe(20);
    expect(getDotSize('mediaImage', 56)).toBe(24);
    expect(getDotSize('mediaImage', 64)).toBe(24);
    expect(getDotSize('mediaImage', 72)).toBe(32);
  });

  it('resolves spot dot sizes', () => {
    expect(getDotSize('spot', 40)).toBe(16);
    expect(getDotSize('spot', 48)).toBe(20);
    expect(getDotSize('spot', 56)).toBe(24);
    expect(getDotSize('spot', 72)).toBe(32);
  });
});

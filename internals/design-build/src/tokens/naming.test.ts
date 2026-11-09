import { describe, expect, it } from 'vitest';
import { cssReference, cssVariableName } from './naming.js';

describe('cssVariableName', () => {
  it.each([
    [['color', 'dark', 'crypto', 'Zcash-0%'], '--color-dark-crypto-zcash-0'],
    [['border-width', 'default'], '--border-width'],
    [
      ['background', 'gradient overlay', '80%'],
      '--background-gradient-overlay-80',
    ],
    [['spacing', '16'], '--spacing-16'],
  ])('%j → %s', (path, expected) => {
    expect(cssVariableName(path)).toBe(expected);
  });
});

describe('cssReference', () => {
  it('points at the referenced variable', () => {
    expect(cssReference('font.size.64')).toBe('var(--font-size-64)');
  });
});

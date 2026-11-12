import { describe, expect, it } from 'vitest';
import {
  camelKey,
  cssReference,
  cssVariableName,
  semanticKey,
  stepKey,
} from './naming.js';

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

describe('React Native keys', () => {
  it.each([
    [camelKey, 'bitcoin-cash', 'bitcoinCash'],
    [camelKey, 'celo-2', 'celo2'],
    [camelKey, '050-10', '050-10'],
    [stepKey, '16', 's16'],
    [stepKey, 'md', 'md'],
    [semanticKey, 'canvas-muted', 'canvasMuted'],
    [semanticKey, 'aion-0', 'aion0'],
  ])('%o(%s) → %s', (rule, key, expected) => {
    expect(rule(key)).toBe(expected);
  });
});

import { describe, it, expect } from 'vitest';
import { themeCss } from './testing/themeCss.js';

// -- Plain CSS theme files: structural integrity -------------------------------

const themeFiles = [
  'ledger-live.css',
  'enterprise.css',
  'websites.css',
  'all-brands.css',
].flatMap((file) =>
  Object.entries(themeCss(file)).map(([selector, tokenMap]) => ({
    name: `${file} ${selector}`,
    tokenMap,
  })),
);

describe.each(themeFiles)('$name — CSS token integrity', ({ tokenMap }) => {
  it('token map is not empty', () => {
    expect(Object.keys(tokenMap).length).toBeGreaterThan(0);
  });

  it('all keys are valid CSS custom properties', () => {
    for (const key of Object.keys(tokenMap)) {
      expect(key, `"${key}" is not a valid CSS custom property`).toMatch(
        /^--[a-z0-9-]+$/,
      );
    }
  });

  it('no value is empty', () => {
    for (const [key, value] of Object.entries(tokenMap)) {
      expect(value, `${key} is empty`).not.toBe('');
    }
  });
});

const ledgerLive = themeCss('ledger-live.css');

// -- Sanity checks on well-known primitive values -----------------------------

describe('primitives — core value sanity checks', () => {
  const root = ledgerLive[':root'];

  it('light white is #ffffff', () => {
    expect(root['--color-light-constant-050']).toBe('#ffffff');
  });

  it('dark black is #000000', () => {
    expect(root['--color-dark-constant-950']).toBe('#000000');
  });

  it('spacing-0 is 0px', () => {
    expect(root['--spacing-0']).toBe('0px');
  });

  it('spacing-16 is 16px', () => {
    expect(root['--spacing-16']).toBe('16px');
  });

  it('border-radius-full is 10000px', () => {
    expect(root['--border-radius-full']).toBe('10000px');
  });

  it('font-family is Inter', () => {
    expect(root['--font-family-font']).toBe('Inter');
  });

  it('font-weight-bold is 700', () => {
    expect(root['--font-weight-bold']).toBe('700');
  });
});

// -- Sanity checks on well-known semantic theme values ------------------------

describe('ledger-live light theme — core value sanity checks', () => {
  const root = ledgerLive[':root'];

  it('canvas background references a light primitive', () => {
    expect(root['--color-background-canvas']).toMatch(
      /^var\(--color-light-.+\)$/,
    );
  });

  it('color-text-base references a light primitive', () => {
    expect(root['--color-text-base']).toMatch(/^var\(--color-light-.+\)$/);
  });

  it('text-base aliases to color-text-base', () => {
    expect(root['--text-base']).toBe('var(--color-text-base)');
  });
});

describe('ledger-live dark theme — core value sanity checks', () => {
  const dark = ledgerLive['.dark'];

  it('canvas background references a dark primitive', () => {
    expect(dark['--color-background-canvas']).toMatch(
      /^var\(--color-dark-.+\)$/,
    );
  });

  it('color-text-base references a dark primitive', () => {
    expect(dark['--color-text-base']).toMatch(/^var\(--color-dark-.+\)$/);
  });

  it('text-base aliases to color-text-base', () => {
    expect(dark['--text-base']).toBe('var(--color-text-base)');
  });
});

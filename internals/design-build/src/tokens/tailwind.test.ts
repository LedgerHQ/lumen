import { createTokenModel } from '@lumen/design-sources';
import { describe, expect, it } from 'vitest';
import { tailwindTarget } from './tailwind.js';

describe('tailwindTarget', () => {
  it('emits a shared theme and one small entry per brand plus all brands', async () => {
    const files = await tailwindTarget('out', '../css').emit(
      createTokenModel(),
    );
    const byPath = Object.fromEntries(files.map((f) => [f.path, f.contents]));

    expect(Object.keys(byPath)).toEqual([
      'theme.css',
      'enterprise.css',
      'ledger-live.css',
      'websites.css',
      'all-brands.css',
    ]);
    expect(byPath['theme.css']).toContain("@import './lumen.css';");
    for (const brand of [
      'enterprise.css',
      'ledger-live.css',
      'websites.css',
      'all-brands.css',
    ]) {
      expect(byPath[brand]).toContain("@import './theme.css';");
      expect(byPath[brand]).not.toContain('@theme');
    }
  });

  it('pulls every variable from the plain CSS theme of the same name, into the base layer', async () => {
    const files = await tailwindTarget('out', '../css').emit(
      createTokenModel(),
    );
    const byPath = Object.fromEntries(files.map((f) => [f.path, f.contents]));

    expect(byPath['all-brands.css']).toContain(
      "@import '../css/all-brands.css' layer(base);",
    );
    expect(byPath['enterprise.css']).toContain(
      "@import '../css/enterprise.css' layer(base);",
    );
    expect(byPath['theme.css']).not.toContain('@layer base');
  });

  it('owns the generated entries only, never lumen.css', () => {
    const target = tailwindTarget('out', '../css');

    expect(target.owns?.('theme.css')).toBe(true);
    expect(target.owns?.('enterprise.css')).toBe(true);
    expect(target.owns?.('lumen.css')).toBe(false);
  });
});

import { createTokenModel } from '@lumen/design-sources';
import { describe, expect, it } from 'vitest';
import { tailwindV4Target } from './tailwindV4.js';

describe('tailwindV4Target', () => {
  it('emits a shared theme and one small entry per brand plus all brands', async () => {
    const files = await tailwindV4Target('out').emit(createTokenModel());
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

  it('scopes brands by class in all-brands.css and themes by .dark otherwise', async () => {
    const files = await tailwindV4Target('out').emit(createTokenModel());
    const byPath = Object.fromEntries(files.map((f) => [f.path, f.contents]));

    expect(byPath['all-brands.css']).toContain('  .ledger-live.dark {');
    expect(byPath['enterprise.css']).toContain('  .dark {');
    expect(byPath['theme.css']).toContain('@media (min-width: 640px)');
  });

  it('owns the generated entries only, never lumen.css', () => {
    const target = tailwindV4Target('out');

    expect(target.owns?.('theme.css')).toBe(true);
    expect(target.owns?.('enterprise.css')).toBe(true);
    expect(target.owns?.('lumen.css')).toBe(false);
    expect(target.format).toBe(false);
  });
});

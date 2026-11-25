import { createTokenModel } from '@lumen/design-sources';
import { beforeAll, describe, expect, it } from 'vitest';
import type { OutputFile } from '../core/target.js';
import { cssThemesTarget } from './cssThemes.js';

const selectors = (css: string): string[] =>
  [...css.matchAll(/^(\S[^{\n]*?) \{$/gm)].map(([, selector]) => selector);

describe('cssThemesTarget', () => {
  let files: OutputFile[];
  const contents = (path: string): string =>
    files.find((file) => file.path === path)?.contents ?? '';

  beforeAll(async () => {
    files = await cssThemesTarget('out').emit(createTokenModel());
  });

  it('emits one file per brand and the all-brands file', () => {
    expect(files.map(({ path }) => path).sort()).toEqual([
      'all-brands.css',
      'enterprise.css',
      'ledger-live.css',
      'websites.css',
    ]);
  });

  it('declares the primitives, each wider breakpoint in px, then light and dark', () => {
    const found = selectors(contents('ledger-live.css'));

    expect(found[0]).toBe(':root');
    expect(found.slice(-2)).toEqual([':root', '.dark']);
    const widths = found
      .slice(1, -2)
      .map((selector) =>
        Number(/^@media \(min-width: (\d+)px\)$/.exec(selector)?.[1]),
      );
    expect(widths.length).toBeGreaterThan(0);
    expect(widths).toEqual([...widths].sort((a, b) => a - b));
  });

  it('picks the brand by class in all-brands.css', () => {
    expect(selectors(contents('all-brands.css')).slice(-6)).toEqual([
      '.enterprise',
      '.enterprise.dark',
      '.ledger-live',
      '.ledger-live.dark',
      '.websites',
      '.websites.dark',
    ]);
  });

  it('is plain CSS, with no Tailwind directive or function', () => {
    for (const { contents: css } of files) {
      expect(css).not.toMatch(/@theme|@utility|@apply|theme\(/);
    }
  });
});

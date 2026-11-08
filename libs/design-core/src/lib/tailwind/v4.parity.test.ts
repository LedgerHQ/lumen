import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import type { Config } from 'tailwindcss';
import { __unstable__loadDesignSystem, compile } from 'tailwindcss';
import { describe, expect, it } from 'vitest';
import {
  allBrandsPreset,
  enterprisePreset,
  ledgerLivePreset,
  websitesPreset,
} from './presets/index.js';
import {
  customProperties,
  normalizeCss as normalize,
} from './testing/cssFingerprint.js';

/**
 * The Tailwind v4 CSS files (`@ledgerhq/lumen-design-core/tailwind/*.css`)
 * must produce exactly what the JS presets produce, so a consumer can switch
 * from `@config` to `@import` with no visual change. Every class the preset
 * adds or changes is compiled both ways and compared.
 */

const require = createRequire(import.meta.url);
const tailwindDir = path.dirname(require.resolve('tailwindcss/package.json'));
const cssDir = path.resolve(import.meta.dirname, '../../../tailwind');

const options = (preset?: Config) => ({
  base: cssDir,
  loadStylesheet: async (id: string, base: string) => {
    if (id === 'tailwindcss' || id.startsWith('tailwindcss/')) {
      const file =
        id === 'tailwindcss' ? 'index.css' : id.slice('tailwindcss/'.length);
      return {
        path: file,
        base: tailwindDir,
        content: readFileSync(path.join(tailwindDir, file), 'utf8'),
      };
    }
    const file = path.resolve(base, id);
    return {
      path: file,
      base: path.dirname(file),
      content: readFileSync(file, 'utf8'),
    };
  },
  loadModule: async () => ({ path: 'preset', base: '/', module: preset ?? {} }),
});

const VARIANT_SAMPLES = [
  'dark:bg-base',
  'dark:text-muted',
  'sm:p-16',
  'md:p-16',
  'lg:p-16',
  'xl:p-16',
  '2xl:p-16',
  'max-md:p-16',
  'hover:bg-base-hover',
];

const cases = [
  ['enterprise', enterprisePreset],
  ['ledger-live', ledgerLivePreset],
  ['websites', websitesPreset],
  ['all-brands', allBrandsPreset],
] as const;

describe('Tailwind v4 CSS files', () => {
  it.each(cases)(
    '%s.css generates the same classes as the preset',
    async (name, preset) => {
      const withPreset = await __unstable__loadDesignSystem(
        '@import "tailwindcss"; @config "./preset";',
        options(preset),
      );
      const vanilla = await __unstable__loadDesignSystem(
        '@import "tailwindcss";',
        options(),
      );
      const withCss = await __unstable__loadDesignSystem(
        `@import "tailwindcss"; @import "./${name}.css";`,
        options(),
      );

      const mismatches: string[] = [];
      const addedBy = (system: typeof withPreset): string[] =>
        system
          .getClassList()
          .map(([className]) => className)
          .filter(
            (className) =>
              system.candidatesToCss([className])[0] !==
              vanilla.candidatesToCss([className])[0],
          );
      // Both directions: a class only the CSS file adds is a difference too.
      const candidates = [
        ...new Set([...addedBy(withPreset), ...addedBy(withCss)]),
        ...VARIANT_SAMPLES,
      ];
      for (const className of candidates) {
        const expected = withPreset.candidatesToCss([className])[0] ?? '';
        const actual = withCss.candidatesToCss([className])[0] ?? '';
        if (normalize(expected) !== normalize(actual))
          mismatches.push(className);
      }

      expect(candidates.length).toBeGreaterThan(5000);
      expect(mismatches.slice(0, 20)).toEqual([]);
      expect(mismatches).toHaveLength(0);
    },
    120_000,
  );

  it.each(cases)(
    '%s.css sets the same variables, selectors and breakpoints as the preset',
    async (name, preset) => {
      const fromPreset = await compile(
        '@import "tailwindcss"; @config "./preset";',
        options(preset),
      );
      const fromCss = await compile(
        `@import "tailwindcss"; @import "./${name}.css";`,
        options(),
      );
      // Selectors and media conditions included: the preset once resolved
      // its breakpoints to Tailwind's rem screens while the CSS used px.
      expect(customProperties(fromCss.build([]))).toEqual(
        customProperties(fromPreset.build([])),
      );
    },
    120_000,
  );
});

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { plugin as shadcn } from '@shadcn/lint';
import betterTailwindcss from 'eslint-plugin-better-tailwindcss';
import { describe, expect, it } from 'vitest';

import { buildOxlintPresets } from '../scripts/generate-oxlint-json.js';

import eslint from './eslint.js';
import oxlint from './oxlint.js';
import { NO_RESTYLE_OPTIONS, RULES } from './rules.js';

/** @param {Record<string, unknown>} rules */
const levels = (rules) =>
  Object.fromEntries(
    Object.entries(rules).map(([id, value]) => [
      id,
      Array.isArray(value) ? value[0] : value,
    ]),
  );

describe('presets', () => {
  it('recommended is better-tailwindcss’ correctness config plus restyling as a warning', () => {
    expect(levels(RULES.recommended)).toEqual({
      'better-tailwindcss/no-unknown-classes': 'error',
      'better-tailwindcss/no-conflicting-classes': 'error',
      'better-tailwindcss/no-concatenated-classes': 'error',
      'shadcn/no-restyle': 'warn',
    });
  });

  it('strict adds the stylistic rules and the shadcn signals, and raises restyling', () => {
    expect(levels(RULES.strict)).toEqual({
      'better-tailwindcss/no-unknown-classes': 'error',
      'better-tailwindcss/no-conflicting-classes': 'error',
      'better-tailwindcss/no-concatenated-classes': 'error',
      'better-tailwindcss/enforce-consistent-class-order': 'error',
      'better-tailwindcss/enforce-canonical-classes': 'error',
      'better-tailwindcss/no-deprecated-classes': 'error',
      'better-tailwindcss/no-duplicate-classes': 'error',
      'better-tailwindcss/no-unnecessary-whitespace': 'error',
      'better-tailwindcss/enforce-consistent-line-wrapping': 'off',
      'shadcn/no-restyle': 'error',
      'shadcn/no-arbitrary-values': 'warn',
      'shadcn/no-inline-styles': 'warn',
    });
  });

  it.each(['recommended', 'strict'])(
    '%s only names rules the plugins really have',
    (preset) => {
      const known = [
        ...Object.keys(betterTailwindcss.rules ?? {}).map(
          (rule) => `better-tailwindcss/${rule}`,
        ),
        ...Object.keys(shadcn.rules ?? {}).map((rule) => `shadcn/${rule}`),
      ];
      for (const id of Object.keys(
        RULES[/** @type {'recommended' | 'strict'} */ (preset)],
      )) {
        expect(known).toContain(id);
      }
    },
  );

  it('always allows layout classes on Lumen components', () => {
    for (const rules of [RULES.recommended, RULES.strict]) {
      expect(rules['shadcn/no-restyle']).toEqual([
        expect.any(String),
        NO_RESTYLE_OPTIONS,
      ]);
    }
    expect(NO_RESTYLE_OPTIONS.allow).toEqual(['layout']);
  });

  it('leave the selectors to better-tailwindcss’ defaults', () => {
    expect(JSON.stringify(RULES)).not.toContain('selectors');
  });
});

describe('ESLint entry', () => {
  it.each(['recommended', 'strict'])(
    'registers both plugins with the %s rules and no settings',
    (preset) => {
      const name = /** @type {'recommended' | 'strict'} */ (preset);
      const config = eslint.configs[name];
      expect(Object.keys(config.plugins ?? {})).toEqual([
        'better-tailwindcss',
        'shadcn',
      ]);
      expect(config.rules).toEqual(RULES[name]);
      expect(config.files).toEqual(['**/*.{ts,tsx,js,jsx}']);
      expect(config).not.toHaveProperty('settings');
    },
  );
});

describe('oxlint entry', () => {
  it.each(['recommended', 'strict'])(
    'loads both plugins from absolute paths with the %s rules',
    (preset) => {
      const name = /** @type {'recommended' | 'strict'} */ (preset);
      const config = oxlint.configs[name];
      expect(
        config.jsPlugins?.map((p) => typeof p !== 'string' && p.name),
      ).toEqual(['better-tailwindcss', 'shadcn']);
      for (const plugin of config.jsPlugins ?? []) {
        const specifier =
          typeof plugin === 'string' ? plugin : plugin.specifier;
        expect(specifier.startsWith('/')).toBe(true);
        expect(existsSync(specifier)).toBe(true);
      }
      expect(config.rules).toEqual(RULES[name]);
      expect(config).not.toHaveProperty('settings');
    },
  );
});

const DIR = new URL('../oxlint/', import.meta.url);
const REGENERATE = 'run `npx nx run @ledgerhq/lumen-lint-plugin:generate`';

/** @param {string} name */
const readPreset = (name) =>
  JSON.parse(readFileSync(new URL(name, DIR), 'utf8'));

describe('generated JSON presets', () => {
  const generated = buildOxlintPresets();
  const names = Object.keys(generated).sort();

  it(`are all committed, with no stale file (${REGENERATE} if this fails)`, () => {
    const committed = readdirSync(DIR)
      .filter((file) => file.endsWith('.json'))
      .sort();
    expect(committed).toEqual(names);
  });

  it.each(names)(
    `%s matches the rules (${REGENERATE} if this fails)`,
    (name) => {
      expect(readPreset(name)).toEqual(generated[name]);
    },
  );

  it.each(names)('%s only uses relative plugin paths that exist', (name) => {
    for (const { specifier } of readPreset(name).jsPlugins) {
      // A bare name would be resolved from the consumer's folder: not under pnpm.
      expect(specifier.startsWith('../')).toBe(true);
      expect(existsSync(fileURLToPath(new URL(specifier, DIR)))).toBe(true);
    }
  });

  it('scopes the `.web` presets and leaves the others global', () => {
    expect(readPreset('strict.web.json').overrides[0].files).toEqual([
      '**/*.web.{ts,tsx}',
    ]);
    expect(readPreset('recommended.json')).toHaveProperty('rules');
    expect(readPreset('recommended.json')).not.toHaveProperty('overrides');
  });
});

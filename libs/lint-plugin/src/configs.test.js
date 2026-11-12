import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { plugin as shadcn } from '@shadcn/lint';
import { builtinRules } from 'eslint/use-at-your-own-risk';
import betterTailwindcss from 'eslint-plugin-better-tailwindcss';
import { describe, expect, it } from 'vitest';

import { buildOxlintPresets } from '../scripts/generate-oxlint-json.js';

import eslint from './eslint.js';
import oxlint from './oxlint.js';
import lumen from './plugins/lumen.js';
import {
  LOGICAL_PROPERTIES_OPTIONS,
  NO_ARBITRARY_VALUES_OPTIONS,
  NO_RESTRICTED_CLASSES_OPTIONS,
  NO_RESTRICTED_IMPORTS_OPTIONS,
  RULES,
} from './rules.js';

/** @import { ESLint } from 'eslint' */
/** @import { PresetName } from './rules.js' */

/** @param {Record<string, unknown>} rules */
const levels = (rules) =>
  Object.fromEntries(
    Object.entries(rules).map(([id, value]) => [
      id,
      Array.isArray(value) ? value[0] : value,
    ]),
  );

describe('presets', () => {
  it('recommended is better-tailwindcss’ correctness config plus duplicates, and class-merging imports as errors', () => {
    expect(levels(RULES.recommended)).toEqual({
      'better-tailwindcss/no-unknown-classes': 'error',
      'better-tailwindcss/no-conflicting-classes': 'error',
      'better-tailwindcss/no-concatenated-classes': 'error',
      'better-tailwindcss/no-duplicate-classes': 'error',
      'no-restricted-imports': 'error',
    });
  });

  it('strict adds the stylistic rules and the shadcn signals, and raises class-merging imports', () => {
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
      'better-tailwindcss/enforce-logical-properties': 'error',
      'better-tailwindcss/no-restricted-classes': 'error',
      'shadcn/no-arbitrary-values': 'warn',
      'shadcn/no-inline-styles': 'warn',
      'no-restricted-imports': 'error',
    });
  });

  it("react-native-strict is Lumen's own logical-properties rule only", () => {
    expect(levels(RULES['react-native-strict'])).toEqual({
      'lumen/enforce-logical-properties': 'error',
    });
  });

  it.each(['recommended', 'strict', 'react-native-strict'])(
    '%s only names rules the plugins or ESLint core really have',
    (preset) => {
      const known = [
        ...Object.keys(betterTailwindcss.rules ?? {}).map(
          (rule) => `better-tailwindcss/${rule}`,
        ),
        ...Object.keys(shadcn.rules ?? {}).map((rule) => `shadcn/${rule}`),
        ...Object.keys(lumen.rules ?? {}).map((rule) => `lumen/${rule}`),
        ...builtinRules.keys(),
      ];
      for (const id of Object.keys(RULES[/** @type {PresetName} */ (preset)])) {
        expect(known).toContain(id);
      }
    },
  );

  it('points every class-merging import at Lumen’s cn', () => {
    expect(RULES.recommended['no-restricted-imports']).toEqual([
      'error',
      NO_RESTRICTED_IMPORTS_OPTIONS,
    ]);
    expect(RULES.strict['no-restricted-imports']).toEqual([
      'error',
      NO_RESTRICTED_IMPORTS_OPTIONS,
    ]);
    expect(NO_RESTRICTED_IMPORTS_OPTIONS.paths.map(({ name }) => name)).toEqual(
      ['tailwind-merge', 'clsx', 'classnames'],
    );
    for (const { message } of NO_RESTRICTED_IMPORTS_OPTIONS.paths) {
      expect(message).toContain('@ledgerhq/lumen-design-core/cn');
    }
  });

  it('exports Lumen’s options frozen, so no consumer changes them for everyone', () => {
    for (const options of [NO_ARBITRARY_VALUES_OPTIONS]) {
      expect(Object.isFrozen(options)).toBe(true);
      expect(Object.isFrozen(options.allow)).toBe(true);
      expect(Object.isFrozen(options.componentImports)).toBe(true);
    }
    expect(Object.isFrozen(NO_RESTRICTED_IMPORTS_OPTIONS.paths)).toBe(true);
    expect(Object.isFrozen(LOGICAL_PROPERTIES_OPTIONS.ignore)).toBe(true);
    expect(Object.isFrozen(NO_RESTRICTED_CLASSES_OPTIONS.restrict)).toBe(true);
  });

  it('leave the selectors to better-tailwindcss’ defaults', () => {
    expect(JSON.stringify(RULES)).not.toContain('selectors');
  });
});

/** @type {[PresetName, string[]][]} */
const PRESET_PLUGINS = [
  ['recommended', ['better-tailwindcss', 'shadcn']],
  ['strict', ['better-tailwindcss', 'shadcn']],
  ['react-native-strict', ['lumen']],
];

describe('ESLint entry', () => {
  it.each(PRESET_PLUGINS)(
    'registers the %s plugins with its rules and no settings',
    (name, plugins) => {
      const config = eslint.configs[name];
      expect(Object.keys(config.plugins ?? {})).toEqual(plugins);
      expect(config.rules).toEqual(RULES[name]);
      expect(config.files).toEqual(['**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}']);
      expect(config).not.toHaveProperty('settings');
    },
  );
});

describe('oxlint entry', () => {
  it.each(PRESET_PLUGINS)(
    'loads the %s plugins from absolute paths with its rules',
    (name, plugins) => {
      const config = oxlint.configs[name];
      expect(
        config.jsPlugins?.map((p) => typeof p !== 'string' && p.name),
      ).toEqual(plugins);
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

  it.each(names)(
    '%s sets no file globs, so the consumer scopes it and its own rules win',
    (name) => {
      expect(readPreset(name)).not.toHaveProperty('overrides');
    },
  );
});

describe('README rules table', () => {
  const ICONS = new Map([
    ['✅', 'error'],
    ['⚠️', 'warn'],
    ['', 'off'],
  ]);
  /** @type {[string, ESLint.Plugin, PresetName[]][]} */
  const PLUGINS = [
    ['better-tailwindcss', betterTailwindcss, ['recommended', 'strict']],
    ['shadcn', shadcn, ['recommended', 'strict']],
    ['lumen', lumen, ['react-native-strict']],
  ];
  const rows = new Map(
    [
      ...readFileSync(
        new URL('../README.md', import.meta.url),
        'utf8',
      ).matchAll(/^\| \[`([^`]+)`\]\((\S+)\)\s*\|(.*)\|\s*$/gm),
    ].map(([, rule, url, rest]) => [
      url,
      { rule, cells: rest.split('|').map((cell) => cell.trim()) },
    ]),
  );
  const allRules = PLUGINS.flatMap(([plugin, { rules = {} }, presets]) =>
    Object.entries(rules).map(([rule, module]) => ({
      id: `${plugin}/${rule}`,
      rule,
      meta: typeof module === 'function' ? undefined : module.meta,
      presets,
    })),
  );

  it('lists every rule of the plugins, and nothing else', () => {
    expect([...rows.keys()].sort()).toEqual(
      allRules.map(({ meta }) => meta?.docs?.url).sort(),
    );
  });

  it.each(allRules)(
    '$id: name, levels and fixable match',
    ({ id, rule, meta, presets }) => {
      const row = rows.get(meta?.docs?.url ?? '');
      expect(row?.rule).toBe(rule);
      expect(presets.map((_, i) => ICONS.get(row?.cells[i] ?? ''))).toEqual(
        presets.map((preset) => levels(RULES[preset])[id] ?? 'off'),
      );
      expect(row?.cells[presets.length] === '🔧').toBe(Boolean(meta?.fixable));
    },
  );
});

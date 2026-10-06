import { existsSync, readFileSync } from 'node:fs';

import { plugin as shadcn } from '@shadcn/lint';
import betterTailwindcss from 'eslint-plugin-better-tailwindcss';
import { describe, expect, it } from 'vitest';

import * as eslintEntry from './eslint.js';
import { KNOWN_RULES, buildPreset } from './model.js';
import * as oxlintEntry from './oxlint.js';
import { plugin as lumen } from './plugin.js';

const ENTRY_POINT = 'src/global.css';
const ENTRY = { entryPoint: ENTRY_POINT };
const TAILWIND_PREFIX = 'better-tailwindcss/';

/** @param {ReturnType<typeof buildPreset>} preset */
const levels = (preset) =>
  Object.fromEntries(preset.rules.map(({ id, level }) => [id, level]));

/**
 * @param {ReturnType<typeof buildPreset>} preset
 * @param {string} id
 */
const ruleOf = (preset, id) => preset.rules.find((rule) => rule.id === id);

/** @param {Record<string, unknown>} rules */
const withoutLineWrapping = (rules) =>
  Object.fromEntries(
    Object.entries(rules).filter(([id]) => !id.endsWith('line-wrapping')),
  );

const CORE = {
  'better-tailwindcss/no-unknown-classes': 'error',
  'better-tailwindcss/no-conflicting-classes': 'error',
  'better-tailwindcss/no-concatenated-classes': 'error',
};

describe('KNOWN_RULES', () => {
  it.each([
    ['lumen', lumen],
    ['better-tailwindcss', betterTailwindcss],
    ['shadcn', shadcn],
  ])('lists every rule of the %s plugin and nothing else', (name, plugin) => {
    expect(
      [...KNOWN_RULES[/** @type {keyof typeof KNOWN_RULES} */ (name)]].sort(),
    ).toEqual(Object.keys(plugin.rules ?? {}).sort());
  });
});

const presets = {
  'react recommended': buildPreset('react', ENTRY),
  'react strict': buildPreset('react', { ...ENTRY, preset: 'strict' }),
  'react (Tailwind v3)': buildPreset('react', {
    tailwindConfig: 'tailwind.config.js',
    preset: 'strict',
  }),
  'react (shadcn off)': buildPreset('react', {
    ...ENTRY,
    preset: 'strict',
    shadcn: false,
  }),
  'react-native recommended': buildPreset('react-native'),
  'react-native strict': buildPreset('react-native', { preset: 'strict' }),
};

describe.each(Object.entries(presets))('%s preset', (_name, preset) => {
  it('is JSON-serializable, which oxlint requires', () => {
    expect(JSON.parse(JSON.stringify(preset))).toEqual(preset);
  });

  it('only references known rules of a registered plugin', () => {
    for (const { id } of preset.rules) {
      const [pluginName, ruleName] = id.split('/');
      expect(preset.plugins).toContain(pluginName);
      expect(
        KNOWN_RULES[/** @type {keyof typeof KNOWN_RULES} */ (pluginName)],
      ).toContain(ruleName);
    }
  });
});

describe('recommended vs strict', () => {
  const recommended = presets['react recommended'];
  const strict = presets['react strict'];

  it('recommended is the core only', () => {
    expect(levels(recommended)).toEqual({
      ...CORE,
      'shadcn/no-restyle': 'warn',
    });
  });

  it('strict adds a few more rules and raises the design-contract one', () => {
    expect(levels(strict)).toEqual({
      ...CORE,
      'shadcn/no-restyle': 'error',
      'better-tailwindcss/enforce-consistent-class-order': 'error',
      'better-tailwindcss/enforce-canonical-classes': 'error',
      'better-tailwindcss/no-deprecated-classes': 'error',
      'better-tailwindcss/no-duplicate-classes': 'error',
      'better-tailwindcss/no-unnecessary-whitespace': 'error',
      'shadcn/no-arbitrary-values': 'warn',
      'shadcn/no-inline-styles': 'warn',
    });
  });

  it('strict contains every recommended rule', () => {
    for (const id of Object.keys(levels(recommended))) {
      expect(levels(strict)).toHaveProperty([id]);
    }
  });

  it('matches better-tailwindcss: core = "correctness", strict = "recommended-error"', () => {
    /** @param {ReturnType<typeof buildPreset>} preset */
    const tailwind = (preset) =>
      Object.fromEntries(
        Object.entries(levels(preset)).filter(([id]) =>
          id.startsWith(TAILWIND_PREFIX),
        ),
      );
    expect(tailwind(recommended)).toEqual(
      betterTailwindcss.configs.correctness.rules,
    );
    expect(tailwind(strict)).toEqual(
      withoutLineWrapping(
        /** @type {Record<string, unknown>} */ (
          betterTailwindcss.configs['recommended-error'].rules
        ),
      ),
    );
  });

  it('always allows every layout class on a Lumen component', () => {
    for (const preset of [recommended, strict]) {
      expect(ruleOf(preset, 'shadcn/no-restyle')?.options?.allow).toEqual([
        'layout',
      ]);
    }
  });

  it('words restyle errors for consumers instead of pointing at library source', () => {
    const message = /** @type {Record<string, string>} */ (
      ruleOf(strict, 'shadcn/no-restyle')?.options?.message
    );
    expect(Object.keys(message).sort()).toEqual([
      'color',
      'effects',
      'motion',
      'shape',
      'typography',
    ]);
    expect(message.color).toContain('{{component}}');
  });

  it('lets structural arbitrary utilities through', () => {
    expect(
      ruleOf(strict, 'shadcn/no-arbitrary-values')?.options?.allow,
    ).toEqual(expect.arrayContaining(['transition-*', 'grid-rows-*']));
  });

  it('enables no React Native rule in recommended, and style literals in strict', () => {
    expect(levels(presets['react-native recommended'])).toEqual({});
    expect(levels(presets['react-native strict'])).toEqual({
      'lumen/no-hardcoded-style-literals': 'warn',
    });
  });

  it('rejects an unknown preset name', () => {
    expect(() =>
      buildPreset('react', {
        ...ENTRY,
        // @ts-expect-error: a JavaScript consumer can pass anything
        preset: 'loose',
      }),
    ).toThrow(/unknown preset "loose"/);
  });
});

describe('Tailwind setup', () => {
  it('requires the Tailwind entry for the React preset and says how to fix it', () => {
    expect(() => buildPreset('react')).toThrow(/needs your Tailwind CSS entry/);
    expect(() => buildPreset('react', { preset: 'strict' })).toThrow(
      /entryPoint: 'src\/global\.css'/,
    );
  });

  it('does not require it for React Native', () => {
    expect(() => buildPreset('react-native')).not.toThrow();
  });

  it('drops Tailwind v4-only rules and shadcn for a v3 config', () => {
    const v3 = presets['react (Tailwind v3)'];
    expect(Object.keys(levels(v3))).not.toContain(
      'better-tailwindcss/no-conflicting-classes',
    );
    expect(v3.plugins).not.toContain('shadcn');
    expect(v3.tailwind?.tailwindConfig).toBe('tailwind.config.js');
    expect(v3.tailwind).not.toHaveProperty('entryPoint');
  });

  it('keeps shadcn out when disabled', () => {
    expect(presets['react (shadcn off)'].plugins).not.toContain('shadcn');
    expect(Object.keys(levels(presets['react (shadcn off)']))).not.toContain(
      'shadcn/no-restyle',
    );
  });

  it('lints `*ClassName` props next to the default selectors', () => {
    const selectors = presets['react recommended'].tailwind?.selectors ?? [];
    expect(selectors).toContainEqual({
      kind: 'attribute',
      name: '^[a-z]\\w*ClassName$',
      match: [{ type: 'strings' }],
    });
    expect(selectors.some((s) => s.name === '^cva$')).toBe(true);
  });
});

describe('the `rules` option', () => {
  it('turns a rule off without losing its options', () => {
    const preset = buildPreset('react', {
      ...ENTRY,
      rules: { 'shadcn/no-restyle': 'off' },
    });
    expect(ruleOf(preset, 'shadcn/no-restyle')).toMatchObject({
      level: 'off',
      options: { allow: ['layout'] },
    });
  });

  it('merges options over the preset’s instead of replacing them', () => {
    const preset = buildPreset('react', {
      ...ENTRY,
      rules: {
        'shadcn/no-restyle': ['error', { allow: ['layout', 'spacing'] }],
      },
    });
    expect(ruleOf(preset, 'shadcn/no-restyle')).toMatchObject({
      level: 'error',
      options: {
        allow: ['layout', 'spacing'],
        componentImports: ['^@ledgerhq/lumen-ui-react(/|$)'],
        message: expect.any(Object),
      },
    });
  });

  it('enables a rule the preset leaves off, with its default options', () => {
    const preset = buildPreset('react', {
      ...ENTRY,
      rules: { 'shadcn/no-arbitrary-values': 'warn' },
    });
    expect(ruleOf(preset, 'shadcn/no-arbitrary-values')).toMatchObject({
      level: 'warn',
      options: { allow: expect.arrayContaining(['transition-*']) },
    });
  });

  it('enables any known rule of a registered plugin', () => {
    const preset = buildPreset('react', {
      ...ENTRY,
      rules: {
        'better-tailwindcss/enforce-logical-properties': 'warn',
        'shadcn/no-raw-colors': ['error', { allow: ['bg-black'] }],
      },
    });
    expect(
      ruleOf(preset, 'better-tailwindcss/enforce-logical-properties'),
    ).toEqual({
      id: 'better-tailwindcss/enforce-logical-properties',
      level: 'warn',
    });
    expect(ruleOf(preset, 'shadcn/no-raw-colors')).toMatchObject({
      level: 'error',
      options: { allow: ['bg-black'] },
    });
  });

  it('accepts numeric levels', () => {
    expect(
      levels(
        buildPreset('react-native', {
          rules: { 'lumen/no-hardcoded-style-literals': 1 },
        }),
      ),
    ).toEqual({ 'lumen/no-hardcoded-style-literals': 'warn' });
    expect(
      levels(
        buildPreset('react-native', {
          preset: 'strict',
          rules: { 'lumen/no-hardcoded-style-literals': 0 },
        }),
      ),
    ).toEqual({ 'lumen/no-hardcoded-style-literals': 'off' });
  });

  it('emits an explicit `off`, so it also wins over earlier configs', () => {
    expect(levels(buildPreset('react', ENTRY))).not.toHaveProperty([
      'shadcn/no-inline-styles',
    ]);
    expect(
      levels(
        buildPreset('react', {
          ...ENTRY,
          rules: { 'shadcn/no-inline-styles': 'off' },
        }),
      ),
    ).toHaveProperty(['shadcn/no-inline-styles'], 'off');
  });

  it('names the valid rules when an id does not exist', () => {
    expect(() =>
      buildPreset('react', { ...ENTRY, rules: { 'shadcn/no-foo': 'warn' } }),
    ).toThrow(
      /unknown rule "shadcn\/no-foo"\. Rules in "shadcn": .*no-restyle/,
    );
    expect(() =>
      buildPreset('react', { ...ENTRY, rules: { 'react/foo': 'warn' } }),
    ).toThrow(
      /Rule ids start with "lumen\/", "better-tailwindcss\/", "shadcn\/"/,
    );
  });

  it('refuses a rule whose plugin the preset does not register', () => {
    expect(() =>
      buildPreset('react', {
        tailwindConfig: 'tailwind.config.js',
        rules: { 'shadcn/no-restyle': 'warn' },
      }),
    ).toThrow(/needs the "shadcn" plugin/);
    expect(() =>
      buildPreset('react-native', {
        rules: { 'better-tailwindcss/no-unknown-classes': 'warn' },
      }),
    ).toThrow(/needs the "better-tailwindcss" plugin/);
  });

  it('rejects an invalid level and non-object options', () => {
    expect(() =>
      buildPreset('react', {
        ...ENTRY,
        // @ts-expect-error: a JavaScript consumer can pass anything
        rules: { 'shadcn/no-restyle': 'loud' },
      }),
    ).toThrow(/invalid level "loud"/);
    expect(() =>
      buildPreset('react', {
        ...ENTRY,
        // @ts-expect-error: a JavaScript consumer can pass anything
        rules: { 'shadcn/no-restyle': ['warn', 'x'] },
      }),
    ).toThrow(/must be an object/);
  });
});

describe('the `files` option', () => {
  const WEB = ['**/*.web.{ts,tsx}'];

  it('scopes the preset and defaults to source files', () => {
    expect(buildPreset('react', ENTRY).files).toEqual(['**/*.{ts,tsx,js,jsx}']);
    expect(buildPreset('react', ENTRY)).not.toHaveProperty('scope');
    const scoped = buildPreset('react', { ...ENTRY, files: WEB });
    expect(scoped.files).toEqual(WEB);
    expect(scoped.scope).toEqual(WEB);
  });

  it('rejects an empty or non-string list', () => {
    expect(() => buildPreset('react', { ...ENTRY, files: [] })).toThrow(
      /"files" must be a non-empty array/,
    );
    expect(() =>
      buildPreset('react-native', {
        // @ts-expect-error: a JavaScript consumer can pass anything
        files: 'src/**',
      }),
    ).toThrow(/"files" must be a non-empty array/);
  });
});

describe('ESLint entry', () => {
  const [config] = eslintEntry.react(ENTRY);
  const [strict] = eslintEntry.react({ ...ENTRY, preset: 'strict' });

  it('registers every plugin once and carries the Tailwind settings', () => {
    expect(Object.keys(config.plugins ?? {})).toEqual([
      'lumen',
      'better-tailwindcss',
      'shadcn',
    ]);
    expect(config.settings?.['better-tailwindcss']).toMatchObject({
      entryPoint: ENTRY_POINT,
    });
  });

  it('translates levels and options, and strict raises them', () => {
    expect(config.rules?.['better-tailwindcss/no-unknown-classes']).toBe(
      'error',
    );
    expect(config.rules?.['shadcn/no-restyle']).toEqual([
      'warn',
      expect.objectContaining({ allow: ['layout'] }),
    ]);
    expect(strict.rules?.['shadcn/no-restyle']).toEqual([
      'error',
      expect.objectContaining({ allow: ['layout'] }),
    ]);
  });

  it('applies the `rules` and `files` options', () => {
    const [custom] = eslintEntry.react({
      ...ENTRY,
      files: ['**/*.web.tsx'],
      rules: { 'shadcn/no-restyle': 'off' },
    });
    expect(custom.files).toEqual(['**/*.web.tsx']);
    // Switched off, but the preset's options are kept, so `[level, options]`.
    expect(custom.rules?.['shadcn/no-restyle']).toEqual([
      'off',
      expect.objectContaining({ allow: ['layout'] }),
    ]);
  });

  it('has no static presets: the React preset needs an entry point', () => {
    expect(eslintEntry).not.toHaveProperty('configs');
  });

  it('has a React Native preset without Tailwind', () => {
    const [native] = eslintEntry.reactNative({ preset: 'strict' });
    expect(Object.keys(native.plugins ?? {})).toEqual(['lumen']);
    expect(native.settings).toBeUndefined();
    expect(native.rules?.['lumen/no-hardcoded-style-literals']).toBe('warn');
  });
});

describe('oxlint entry', () => {
  const config = oxlintEntry.react(ENTRY);

  it('is JSON-serializable', () => {
    expect(JSON.parse(JSON.stringify(config))).toEqual(config);
  });

  it('points jsPlugins at absolute files of this package that exist', () => {
    const plugins = /** @type {{ name: string, specifier: string }[]} */ (
      config.jsPlugins
    );
    expect(plugins.map(({ name }) => name)).toEqual([
      'lumen',
      'better-tailwindcss',
      'shadcn',
    ]);
    for (const { specifier } of plugins) {
      expect(specifier.startsWith('/')).toBe(true);
      expect(existsSync(specifier)).toBe(true);
    }
  });

  it('repeats the Tailwind config as rule options because settings are not inherited', () => {
    expect(config.rules?.['better-tailwindcss/no-unknown-classes']).toEqual([
      'error',
      expect.objectContaining({
        entryPoint: ENTRY_POINT,
        selectors: expect.any(Array),
      }),
    ]);
    expect(config.settings?.['better-tailwindcss']).toMatchObject({
      entryPoint: ENTRY_POINT,
    });
  });

  it('puts rules at the top level so a consumer’s own `rules` win', () => {
    // Rules inside `overrides` would beat the consumer's top-level `rules`.
    expect(config).not.toHaveProperty('overrides');
    expect(config.rules).toBeDefined();
  });

  it('uses `overrides` only when the preset is scoped with `files`', () => {
    const scoped = oxlintEntry.react({ ...ENTRY, files: ['**/*.web.tsx'] });
    expect(scoped).not.toHaveProperty('rules');
    expect(scoped.overrides).toEqual([
      { files: ['**/*.web.tsx'], rules: expect.any(Object) },
    ]);
  });

  it('translates the strict preset and the `rules` option', () => {
    const strict = oxlintEntry.react({
      ...ENTRY,
      preset: 'strict',
      rules: { 'better-tailwindcss/enforce-logical-properties': 'warn' },
    });
    expect(strict.rules?.['shadcn/no-restyle']).toEqual([
      'error',
      expect.any(Object),
    ]);
    // A rule enabled through `rules` still gets the Tailwind options.
    expect(
      strict.rules?.['better-tailwindcss/enforce-logical-properties'],
    ).toEqual(['warn', expect.objectContaining({ entryPoint: ENTRY_POINT })]);
  });
});

describe('package exports', () => {
  const manifest = JSON.parse(
    readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
  );
  const entries = Object.entries(manifest.exports).filter(
    ([key]) => key !== './package.json' && !key.includes('*'),
  );

  it.each(entries)('%s points at an existing source file', (_key, target) => {
    const { default: file } = /** @type {{ default: string }} */ (target);
    expect(existsSync(new URL(`../${file}`, import.meta.url))).toBe(true);
  });

  it('exposes the generated oxlint presets and ships them', () => {
    expect(manifest.exports['./oxlint/*.json']).toBe('./oxlint/*.json');
    expect(manifest.files).toContain('oxlint');
  });
});

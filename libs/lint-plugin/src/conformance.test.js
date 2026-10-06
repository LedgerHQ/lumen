import { execFile } from 'node:child_process';
import { createRequire } from 'node:module';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import { ESLint } from 'eslint';
import tseslint from 'typescript-eslint';
import { describe, expect, it } from 'vitest';

import { react, reactNative } from './eslint.js';

// Keeps `/oxlint` and the generated JSON presets honest: every way of setting
// the plugin up must report exactly the same diagnostics, at the same lines
// and severities, on the same fixtures.

const run = promisify(execFile);
const root = fileURLToPath(new URL('..', import.meta.url));
// `bin/` is not in oxlint's `exports`, so locate it from the package root.
const oxlintBin = join(
  dirname(createRequire(import.meta.url).resolve('oxlint/package.json')),
  'bin',
  'oxlint',
);
const OUR_PLUGINS = new Set(['lumen', 'better-tailwindcss', 'shadcn']);

const tsxParser = {
  files: ['**/*.tsx'],
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
};

/** @param {string} name */
const fixture = (name) =>
  fileURLToPath(new URL(`../fixtures/${name}`, import.meta.url));

/**
 * @param {string} file
 * @param {string} rule
 * @param {number} line
 * @param {'error' | 'warn'} severity
 * @param {boolean} withFile
 */
const entry = (file, rule, line, severity, withFile) =>
  `${withFile ? `${basename(file)}|` : ''}${rule}:${line}:${severity}`;

/**
 * @param {string} target a file or a directory
 * @param {import('eslint').Linter.Config[]} preset
 * @param {{ withFile?: boolean }} [options]
 * @returns {Promise<string[]>} sorted `rule:line:severity` entries
 */
async function lintWithEslint(target, preset, { withFile = false } = {}) {
  const eslint = new ESLint({
    cwd: root,
    overrideConfigFile: true,
    overrideConfig: [tsxParser, ...preset],
  });
  const results = await eslint.lintFiles([target]);
  return results
    .flatMap(({ filePath, messages }) =>
      messages
        .filter(({ ruleId }) => OUR_PLUGINS.has(ruleId?.split('/')[0] ?? ''))
        .map(({ ruleId, line, severity }) =>
          entry(
            filePath,
            `${ruleId}`,
            line,
            severity === 2 ? 'error' : 'warn',
            withFile,
          ),
        ),
    )
    .sort();
}

/**
 * @param {string} config
 * @param {string} target a file or a directory
 * @param {{ withFile?: boolean }} [options]
 * @returns {Promise<string[]>} sorted `rule:line:severity` entries
 */
async function lintWithOxlint(config, target, { withFile = false } = {}) {
  // oxlint exits with 1 when it reports errors; its JSON is still on stdout.
  const { stdout } = await run(
    process.execPath,
    [oxlintBin, '-c', config, '--format', 'json', target],
    { cwd: root },
  ).catch((error) => error);
  const { diagnostics } = JSON.parse(stdout);
  return diagnostics
    .flatMap(
      (
        /** @type {{ code: string, filename: string, severity: string, labels: { span: { line: number } }[] }} */ d,
      ) => {
        const [, plugin, rule] = /^(.+)\((.+)\)$/.exec(d.code) ?? [];
        return OUR_PLUGINS.has(plugin)
          ? [
              entry(
                d.filename,
                `${plugin}/${rule}`,
                d.labels[0].span.line,
                d.severity === 'error' ? 'error' : 'warn',
                withFile,
              ),
            ]
          : [];
      },
    )
    .sort();
}

/** @param {string[]} entries */
const ruleIds = (entries) =>
  [...new Set(entries.map((e) => e.replace(/^.*\|/, '').split(':')[0]))].sort();

describe('every way of setting the plugin up reports the same diagnostics', () => {
  const entryPoint = fixture('global.css');
  const web = fixture('react/web.tsx');
  const native = fixture('native/native.tsx');

  it('react, recommended: the core only', async () => {
    const [eslint, oxlint, json] = await Promise.all([
      lintWithEslint(web, react({ entryPoint })),
      lintWithOxlint(fixture('react/oxlint.config.ts'), web),
      lintWithOxlint(fixture('json/react.oxlintrc.json'), web),
    ]);

    expect(oxlint).toEqual(eslint);
    expect(json).toEqual(eslint);
    expect(eslint).toEqual(
      expect.arrayContaining([
        'better-tailwindcss/no-unknown-classes:6:error',
        'better-tailwindcss/no-conflicting-classes:8:error',
        'better-tailwindcss/no-concatenated-classes:12:error',
        'shadcn/no-restyle:16:warn',
      ]),
    );
    // Not in the core: arbitrary values, inline styles, class order.
    expect(ruleIds(eslint)).toEqual([
      'better-tailwindcss/no-concatenated-classes',
      'better-tailwindcss/no-conflicting-classes',
      'better-tailwindcss/no-unknown-classes',
      'shadcn/no-restyle',
    ]);
    // Line 7 uses a class defined only in the fixture's CSS entry point.
    expect(eslint.filter((line) => line.includes(':7:'))).toEqual([]);
  });

  it('react, strict: a few more rules, and the contract rule raised', async () => {
    const [recommended, strict, oxlint, json] = await Promise.all([
      lintWithEslint(web, react({ entryPoint })),
      lintWithEslint(web, react({ entryPoint, preset: 'strict' })),
      lintWithOxlint(fixture('react/oxlint.strict.config.ts'), web),
      lintWithOxlint(fixture('json/react-strict.oxlintrc.json'), web),
    ]);

    expect(oxlint).toEqual(strict);
    expect(json).toEqual(strict);
    expect(strict).toEqual(
      expect.arrayContaining([
        'shadcn/no-restyle:16:error',
        'better-tailwindcss/enforce-consistent-class-order:6:error',
        'shadcn/no-arbitrary-values:10:warn',
        'shadcn/no-inline-styles:15:warn',
      ]),
    );
    // Every core finding is still there; strict only adds rules.
    expect(ruleIds(strict)).toEqual(
      expect.arrayContaining(ruleIds(recommended)),
    );
    expect(
      ruleIds(strict).filter((id) => !ruleIds(recommended).includes(id)),
    ).toEqual([
      'better-tailwindcss/enforce-consistent-class-order',
      'shadcn/no-arbitrary-values',
      'shadcn/no-inline-styles',
    ]);
  });

  it('react-native, recommended and strict', async () => {
    const [recommended, strict, ...others] = await Promise.all([
      lintWithEslint(native, reactNative()),
      lintWithEslint(native, reactNative({ preset: 'strict' })),
      lintWithOxlint(fixture('native/oxlint.config.ts'), native),
      lintWithOxlint(fixture('json/react-native.oxlintrc.json'), native),
      lintWithOxlint(fixture('native/oxlint.strict.config.ts'), native),
      lintWithOxlint(fixture('json/react-native-strict.oxlintrc.json'), native),
    ]);

    expect(others[0]).toEqual(recommended);
    expect(others[1]).toEqual(recommended);
    expect(others[2]).toEqual(strict);
    expect(others[3]).toEqual(strict);
    // Nothing is enabled in the React Native core yet.
    expect(recommended).toEqual([]);
    expect(strict).toEqual([
      'lumen/no-hardcoded-style-literals:5:warn',
      'lumen/no-hardcoded-style-literals:8:warn',
    ]);
  });

  it('a consumer can override rules four ways, all with the same result', async () => {
    const rules = /** @type {const} */ ({
      'shadcn/no-restyle': 'off',
      'shadcn/no-inline-styles': 'warn',
    });
    const [eslint, factoryOption, topLevel, json] = await Promise.all([
      lintWithEslint(web, react({ entryPoint, rules })),
      lintWithOxlint(fixture('react/oxlint.rules-option.config.ts'), web),
      lintWithOxlint(fixture('react/oxlint.override.config.ts'), web),
      lintWithOxlint(fixture('json/react-override.oxlintrc.json'), web),
    ]);

    expect(factoryOption).toEqual(eslint);
    expect(topLevel).toEqual(eslint);
    expect(json).toEqual(eslint);
    // Turned off, and a rule outside the preset turned on.
    expect(ruleIds(eslint)).not.toContain('shadcn/no-restyle');
    expect(eslint).toContain('shadcn/no-inline-styles:15:warn');
    expect(ruleIds(eslint)).toContain('better-tailwindcss/no-unknown-classes');
  });

  it('a monorepo with web and native suffixes is scoped by file name', async () => {
    const dir = fixture('monorepo/src');
    const options = { withFile: true };
    const [eslint, oxlint, json] = await Promise.all([
      lintWithEslint(
        dir,
        [
          ...react({
            entryPoint,
            preset: 'strict',
            files: ['**/*.web.{ts,tsx}'],
          }),
          ...reactNative({ preset: 'strict', files: ['**/*.native.{ts,tsx}'] }),
        ],
        options,
      ),
      lintWithOxlint(fixture('monorepo/scoped.oxlint.config.ts'), dir, options),
      lintWithOxlint(fixture('monorepo/scoped.oxlintrc.json'), dir, options),
    ]);

    expect(oxlint).toEqual(eslint);
    expect(json).toEqual(eslint);

    const onFile = (/** @type {string} */ name) =>
      eslint.filter((line) => line.startsWith(`${name}|`));
    // Web rules only in the web file, native rules only in the native file.
    expect(onFile('page.web.tsx')).toContain(
      'page.web.tsx|shadcn/no-restyle:16:error',
    );
    expect(
      ruleIds(onFile('page.web.tsx')).filter((id) =>
        id.startsWith('lumen/no-hardcoded-style'),
      ),
    ).toEqual([]);
    expect(ruleIds(onFile('screen.native.tsx'))).toEqual([
      'lumen/no-hardcoded-style-literals',
    ]);
    // The unsuffixed file holds a literal style value and is left alone.
    expect(onFile('helpers.ts')).toEqual([]);
  });
});

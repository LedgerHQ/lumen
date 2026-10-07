import { execFile } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import { ESLint } from 'eslint';
import tseslint from 'typescript-eslint';
import { afterAll, describe, expect, it } from 'vitest';

import lumen from './eslint.js';

/** @import { Linter } from 'eslint' */

// Keeps `/oxlint` and the generated JSON presets honest: every way of setting
// the presets up must report exactly the same diagnostics, at the same lines
// and severities, on the same fixtures.

const run = promisify(execFile);
const root = fileURLToPath(new URL('..', import.meta.url));
// `bin/` is not in oxlint's `exports`, so locate it from the package root.
const oxlintBin = join(
  dirname(createRequire(import.meta.url).resolve('oxlint/package.json')),
  'bin',
  'oxlint',
);
const OUR_PLUGINS = new Set(['better-tailwindcss', 'shadcn']);

/** @param {string} name */
const fixture = (name) =>
  fileURLToPath(new URL(`../fixtures/${name}`, import.meta.url));

const tsxParser = {
  files: ['**/*.tsx'],
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
};

/** What a consumer adds next to a preset. */
const tailwindSettings = {
  settings: { 'better-tailwindcss': { entryPoint: fixture('global.css') } },
};

const configDir = mkdtempSync(join(tmpdir(), 'lumen-lint-plugin-'));
afterAll(() => rmSync(configDir, { recursive: true, force: true }));
let configCount = 0;

/**
 * Writes the `.oxlintrc.json` a consumer would have, extending one of the
 * generated presets, and returns its path.
 * @param {string} preset file name in `oxlint/`
 * @param {Linter.RulesRecord} [rules] the consumer's own rules
 * @returns {string}
 */
function oxlintrc(preset, rules) {
  const file = join(configDir, `${++configCount}.oxlintrc.json`);
  writeFileSync(
    file,
    JSON.stringify({
      extends: [fileURLToPath(new URL(`../oxlint/${preset}`, import.meta.url))],
      ...tailwindSettings,
      ...(rules && { rules }),
    }),
  );
  return file;
}

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
 * @param {Linter.Config[]} config
 * @param {{ withFile?: boolean }} [options]
 * @returns {Promise<string[]>} sorted `rule:line:severity` entries
 */
async function lintWithEslint(target, config, { withFile = false } = {}) {
  const eslint = new ESLint({
    cwd: root,
    overrideConfigFile: true,
    overrideConfig: [tsxParser, ...config],
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

describe('every way of setting the presets up reports the same diagnostics', () => {
  const page = fixture('src/page.web.tsx');

  it('recommended: the core only', async () => {
    const [eslint, json] = await Promise.all([
      lintWithEslint(page, [lumen.configs.recommended, tailwindSettings]),
      lintWithOxlint(oxlintrc('recommended.json'), page),
    ]);

    expect(json).toEqual(eslint);
    expect(eslint).toEqual([
      'better-tailwindcss/no-concatenated-classes:10:error',
      'better-tailwindcss/no-conflicting-classes:8:error',
      'better-tailwindcss/no-conflicting-classes:8:error',
      'better-tailwindcss/no-unknown-classes:11:error',
      'better-tailwindcss/no-unknown-classes:6:error',
      'shadcn/no-restyle:13:warn',
    ]);
  });

  it('strict: a few more rules, and restyling raised', async () => {
    const [recommended, strict, oxlint, json] = await Promise.all([
      lintWithEslint(page, [lumen.configs.recommended, tailwindSettings]),
      lintWithEslint(page, [lumen.configs.strict, tailwindSettings]),
      lintWithOxlint(fixture('oxlint.config.ts'), page),
      lintWithOxlint(oxlintrc('strict.json'), page),
    ]);

    expect(oxlint).toEqual(strict);
    expect(json).toEqual(strict);
    expect(strict).toEqual(
      expect.arrayContaining([
        'shadcn/no-restyle:13:error',
        'better-tailwindcss/enforce-consistent-class-order:6:error',
        'shadcn/no-arbitrary-values:9:warn',
        'shadcn/no-inline-styles:12:warn',
      ]),
    );
    // Every core rule still reports; strict only adds rules.
    expect(ruleIds(strict)).toEqual(
      expect.arrayContaining(ruleIds(recommended)),
    );
  });

  it('a consumer overrides rules with plain config, on both engines', async () => {
    /** @type {Linter.RulesRecord} */
    const rules = {
      'shadcn/no-restyle': 'off',
      'shadcn/no-inline-styles': 'warn',
    };
    const [eslint, json] = await Promise.all([
      lintWithEslint(page, [
        lumen.configs.recommended,
        tailwindSettings,
        { rules },
      ]),
      lintWithOxlint(oxlintrc('recommended.json', rules), page),
    ]);

    expect(json).toEqual(eslint);
    expect(ruleIds(eslint)).not.toContain('shadcn/no-restyle');
    expect(eslint).toContain('shadcn/no-inline-styles:12:warn');
  });

  it('the `.web` presets only lint suffixed files', async () => {
    const dir = fixture('src');
    const options = { withFile: true };
    const [eslint, json] = await Promise.all([
      lintWithEslint(
        dir,
        [
          { ...lumen.configs.strict, files: ['**/*.web.{ts,tsx}'] },
          tailwindSettings,
        ],
        options,
      ),
      lintWithOxlint(oxlintrc('strict.web.json'), dir, options),
    ]);

    expect(json).toEqual(eslint);
    expect(eslint).toContain('page.web.tsx|shadcn/no-restyle:13:error');
    // The unsuffixed file holds an unknown class and is left alone.
    expect(eslint.filter((line) => line.startsWith('helpers.ts|'))).toEqual([]);
  });
});

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { buildOxlintPresets } from '../scripts/generate-oxlint-json.js';

const DIR = new URL('../oxlint/', import.meta.url);
const REGENERATE = 'run `npx nx run @ledgerhq/lumen-lint-plugin:generate`';

/** @param {string} name */
const readPreset = (name) =>
  JSON.parse(readFileSync(new URL(name, DIR), 'utf8'));

describe('generated oxlint presets', () => {
  const generated = buildOxlintPresets();
  const names = Object.keys(generated).sort();

  it(`are all committed, with no stale file (${REGENERATE} if this fails)`, () => {
    const committed = readdirSync(DIR)
      .filter((file) => file.endsWith('.json'))
      .sort();
    expect(committed).toEqual(names);
  });

  it.each(names)(
    `%s matches the model (${REGENERATE} if this fails)`,
    (name) => {
      expect(readPreset(name)).toEqual(generated[name]);
    },
  );

  it.each(names)('%s only uses relative plugin paths that exist', (name) => {
    const config = readPreset(name);
    for (const { specifier } of config.jsPlugins) {
      // A bare name would be resolved from the consumer's folder: not under pnpm.
      expect(specifier.startsWith('../')).toBe(true);
      expect(existsSync(fileURLToPath(new URL(specifier, DIR)))).toBe(true);
    }
  });

  it.each(names)('%s carries no consumer-specific Tailwind setup', (name) => {
    const config = readPreset(name);
    expect(config).not.toHaveProperty('settings');
    expect(JSON.stringify(config)).not.toContain('entryPoint');
  });

  it('scopes the suffix presets and leaves the others global', () => {
    expect(readPreset('react-strict.web.json').overrides[0].files).toEqual([
      '**/*.web.{ts,tsx}',
    ]);
    expect(readPreset('react-native.native.json').overrides[0].files).toEqual([
      '**/*.native.{ts,tsx}',
    ]);
    expect(readPreset('react.json')).toHaveProperty('rules');
    expect(readPreset('react.json')).not.toHaveProperty('overrides');
  });
});

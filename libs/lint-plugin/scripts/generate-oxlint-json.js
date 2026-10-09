// Generates `oxlint/*.json`: the presets for consumers who configure oxlint
// with `.oxlintrc.json` and extend a file by path. They come from the same
// rules as the `/oxlint` entry, so the two cannot drift; a test checks it.
//
//   node libs/lint-plugin/scripts/generate-oxlint-json.js
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { format, resolveConfig } from 'prettier';

import { toOxlintConfig } from '../src/oxlint-config.js';

/** @import { OxlintConfig } from 'oxlint' */
/** @import { PluginName } from '../src/oxlint-config.js' */
/** @import { PresetName } from '../src/rules.js' */

// Relative paths only: oxlint resolves a bare name from the consumer's folder,
// which fails under pnpm. These files import the third-party plugins with
// Node's own resolution (see src/plugins/).
/** @param {PluginName} name */
const resolvePlugin = (name) => `../src/plugins/${name}.js`;

/**
 * @returns {Record<string, OxlintConfig>} file name to config, in `oxlint/`
 */
export function buildOxlintPresets() {
  /** @type {Record<string, OxlintConfig>} */
  const presets = {};
  for (const preset of /** @type {PresetName[]} */ ([
    'recommended',
    'strict',
  ])) {
    presets[`${preset}.json`] = toOxlintConfig(preset, { resolvePlugin });
  }
  return presets;
}

/** Directory the presets are written to and shipped from. */
export const OXLINT_DIR = fileURLToPath(new URL('../oxlint/', import.meta.url));

async function writePresets() {
  mkdirSync(OXLINT_DIR, { recursive: true });
  for (const [name, config] of Object.entries(buildOxlintPresets())) {
    const file = `${OXLINT_DIR}${name}`;
    const options = await resolveConfig(file);
    writeFileSync(
      file,
      await format(JSON.stringify(config), { ...options, filepath: file }),
    );
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  await writePresets();
}

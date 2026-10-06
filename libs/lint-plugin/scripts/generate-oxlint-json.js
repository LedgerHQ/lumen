// Generates `oxlint/*.json`: the presets for consumers who configure oxlint
// with `.oxlintrc.json` and extend a file by path. They come from the same
// model as the `/oxlint` factory, so the two cannot drift; a test checks it.
//
//   node libs/lint-plugin/scripts/generate-oxlint-json.js
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { format, resolveConfig } from 'prettier';

import { buildPreset } from '../src/model.js';
import { toOxlintConfig } from '../src/oxlint-config.js';

/** @import { OxlintConfig } from 'oxlint' */
/** @import { PluginName, PresetName } from '../src/model.js' */

// Relative paths only: oxlint resolves a bare name from the consumer's folder,
// which fails under pnpm. These files import the third-party plugins with
// Node's own resolution (see src/plugins/).
/** @type {Record<PluginName, string>} */
const PLUGIN_SPECIFIERS = {
  lumen: '../src/plugin.js',
  'better-tailwindcss': '../src/plugins/better-tailwindcss.js',
  shadcn: '../src/plugins/shadcn.js',
};

const WEB_FILES = ['**/*.web.{ts,tsx}'];
const NATIVE_FILES = ['**/*.native.{ts,tsx}'];

// The preset needs one to build, but the JSON never carries it: each consumer
// sets `settings["better-tailwindcss"].entryPoint` in its own config.
const UNUSED_ENTRY_POINT = 'unused';

/**
 * @param {ReturnType<typeof buildPreset>} preset
 * @returns {OxlintConfig}
 */
function toJson(preset) {
  return toOxlintConfig(preset, {
    resolvePlugin: (name) => PLUGIN_SPECIFIERS[name],
    tailwind: preset.tailwind && { selectors: preset.tailwind.selectors },
    withSettings: false,
  });
}

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
    const suffix = preset === 'strict' ? '-strict' : '';
    const react = { preset, entryPoint: UNUSED_ENTRY_POINT };
    presets[`react${suffix}.json`] = toJson(buildPreset('react', react));
    presets[`react${suffix}.web.json`] = toJson(
      buildPreset('react', { ...react, files: WEB_FILES }),
    );
    presets[`react-native${suffix}.json`] = toJson(
      buildPreset('react-native', { preset }),
    );
    presets[`react-native${suffix}.native.json`] = toJson(
      buildPreset('react-native', { preset, files: NATIVE_FILES }),
    );
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

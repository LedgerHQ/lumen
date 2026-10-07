import { RULES } from './rules.js';

/** @import { OxlintConfig } from 'oxlint' */
/** @import { PresetName } from './rules.js' */

/** @typedef {'better-tailwindcss' | 'shadcn'} PluginName */

/** @type {PluginName[]} */
const PLUGIN_NAMES = ['better-tailwindcss', 'shadcn'];

/**
 * Shared by the `/oxlint` entry (absolute plugin paths) and the generated JSON
 * presets (paths relative to the preset file).
 * @param {PresetName} preset
 * @param {{ resolvePlugin: (name: PluginName) => string, files?: string[] }} options
 *   `files` scopes the preset through `overrides`.
 * @returns {OxlintConfig}
 */
export function toOxlintConfig(preset, { resolvePlugin, files }) {
  const rules = /** @type {NonNullable<OxlintConfig['rules']>} */ (
    RULES[preset]
  );
  return {
    jsPlugins: PLUGIN_NAMES.map((name) => ({
      name,
      specifier: resolvePlugin(name),
    })),
    // Top-level unless scoped, so a consumer's own top-level `rules` win: oxlint
    // applies a config's `overrides` on top of its base `rules`.
    ...(files ? { overrides: [{ files, rules }] } : { rules }),
  };
}

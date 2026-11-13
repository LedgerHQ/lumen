import { PLUGINS, RULES } from './rules.js';

/** @import { OxlintConfig } from 'oxlint' */
/** @import { PluginName, PresetName } from './rules.js' */

/**
 * Shared by the `/oxlint` entry (absolute plugin paths) and the generated JSON
 * presets (paths relative to the preset file). Rules stay top-level, never in
 * `overrides`, so a consumer's own top-level `rules` always win and scoping
 * stays in the consumer's config.
 * @param {PresetName} preset
 * @param {{ resolvePlugin: (name: PluginName) => string }} options
 * @returns {OxlintConfig}
 */
export function toOxlintConfig(preset, { resolvePlugin }) {
  return {
    jsPlugins: PLUGINS[preset].map((name) => ({
      name,
      specifier: resolvePlugin(name),
    })),
    rules: /** @type {NonNullable<OxlintConfig['rules']>} */ (RULES[preset]),
  };
}

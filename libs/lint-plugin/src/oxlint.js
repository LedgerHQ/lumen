import { fileURLToPath } from 'node:url';

import { buildPreset } from './model.js';
import { toOxlintConfig } from './oxlint-config.js';

/** @import { OxlintConfig } from 'oxlint' */
/** @import { PluginName, PresetOptions } from './model.js' */

/**
 * oxlint resolves a bare plugin specifier from the *consumer's* config
 * directory, which fails under strict package managers for our own
 * dependencies. Absolute paths to files of this package always resolve, and
 * those files import the third-party plugins with Node's own resolution.
 * @type {Record<PluginName, string>}
 */
const PLUGIN_FILES = {
  lumen: fileURLToPath(new URL('./plugin.js', import.meta.url)),
  'better-tailwindcss': fileURLToPath(
    new URL('./plugins/better-tailwindcss.js', import.meta.url),
  ),
  shadcn: fileURLToPath(new URL('./plugins/shadcn.js', import.meta.url)),
};

/**
 * @param {PluginName} name
 * @returns {string}
 */
const resolvePluginFile = (name) => PLUGIN_FILES[name];

/**
 * Lumen rules for React web apps. Use as `extends: [react({ entryPoint })]`.
 * @param {PresetOptions} [options] `entryPoint` (Tailwind v4 CSS) or
 *   `tailwindConfig` (Tailwind v3) is required. `preset` is `recommended`
 *   (default) or `strict`; `rules` overrides the preset; `files` scopes it.
 * @returns {OxlintConfig}
 */
export function react(options) {
  return toOxlintConfig(buildPreset('react', options), {
    resolvePlugin: resolvePluginFile,
  });
}

/**
 * Lumen rules for React Native apps.
 * @param {Pick<PresetOptions, 'preset' | 'rules' | 'files'>} [options]
 * @returns {OxlintConfig}
 */
export function reactNative(options) {
  return toOxlintConfig(buildPreset('react-native', options), {
    resolvePlugin: resolvePluginFile,
  });
}

import { toRuleValue } from './model.js';

/** @import { OxlintConfig } from 'oxlint' */
/** @import { PluginName, Preset, TailwindSettings } from './model.js' */

const TAILWIND_RULE_PREFIX = 'better-tailwindcss/';

/**
 * Shared by the `/oxlint` entry (absolute plugin paths, full Tailwind
 * settings) and the generated JSON presets (paths relative to the preset file,
 * no consumer-specific settings).
 * @param {Preset} preset
 * @param {{
 *   resolvePlugin: (name: PluginName) => string,
 *   tailwind?: Partial<TailwindSettings> | undefined,
 *   withSettings?: boolean,
 * }} options `tailwind` is what travels to the Tailwind rules as options;
 *   `withSettings` also emits it as root `settings`.
 * @returns {OxlintConfig}
 */
export function toOxlintConfig(
  preset,
  { resolvePlugin, tailwind = preset.tailwind, withSettings = true },
) {
  const rules = Object.fromEntries(
    preset.rules.map(({ id, level, options }) => {
      // oxlint drops `settings` of an extended config, so everything the
      // Tailwind rules need also travels as rule options, which are inherited.
      const merged =
        tailwind && id.startsWith(TAILWIND_RULE_PREFIX)
          ? { ...tailwind, ...options }
          : options;
      return [id, toRuleValue(level, merged)];
    }),
  );

  return {
    jsPlugins: preset.plugins.map((name) => ({
      name,
      specifier: resolvePlugin(name),
    })),
    // Read when the preset is spread at the root instead of passed to `extends`.
    ...(withSettings &&
      tailwind && { settings: { 'better-tailwindcss': tailwind } }),
    // Top-level unless the consumer scopes the preset with `files`: a consumer's
    // own `rules` then win, because oxlint applies a config's `overrides` on top
    // of its base `rules`.
    ...(preset.scope
      ? { overrides: [{ files: preset.scope, rules }] }
      : { rules }),
  };
}

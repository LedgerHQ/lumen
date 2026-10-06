import { plugin as shadcn } from '@shadcn/lint';
import betterTailwindcss from 'eslint-plugin-better-tailwindcss';

import { buildPreset, toRuleValue } from './model.js';
import { plugin as lumen } from './plugin.js';

/** @import { Linter } from 'eslint' */
/** @import { Preset, PresetOptions } from './model.js' */

const PLUGINS = {
  lumen,
  'better-tailwindcss': betterTailwindcss,
  shadcn,
};

/**
 * @param {Preset} preset
 * @returns {Linter.Config[]}
 */
function toFlatConfig(preset) {
  return [
    {
      name: preset.name,
      files: preset.files,
      plugins: Object.fromEntries(
        preset.plugins.map((name) => [name, PLUGINS[name]]),
      ),
      ...(preset.tailwind && {
        settings: { 'better-tailwindcss': preset.tailwind },
      }),
      rules: Object.fromEntries(
        preset.rules.map(({ id, level, options }) => [
          id,
          toRuleValue(level, options),
        ]),
      ),
    },
  ];
}

/**
 * Lumen rules for React web apps: Tailwind class validation, shadcn lint
 * rules and the `lumen/*` token rules.
 * @param {PresetOptions} [options] `entryPoint` (Tailwind v4 CSS) or
 *   `tailwindConfig` (Tailwind v3) is required. `preset` is `recommended`
 *   (default) or `strict`; `rules` overrides the preset; `files` scopes it.
 * @returns {Linter.Config[]}
 */
export function react(options) {
  return toFlatConfig(buildPreset('react', options));
}

/**
 * Lumen rules for React Native apps.
 * @param {Pick<PresetOptions, 'preset' | 'rules' | 'files'>} [options]
 * @returns {Linter.Config[]}
 */
export function reactNative(options) {
  return toFlatConfig(buildPreset('react-native', options));
}

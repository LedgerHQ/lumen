import { plugin as shadcn } from '@shadcn/lint';
import betterTailwindcss from 'eslint-plugin-better-tailwindcss';

import lumen from './plugins/lumen.js';
import { PLUGINS, RULES } from './rules.js';

/** @import { ESLint, Linter } from 'eslint' */
/** @import { PluginName, PresetName } from './rules.js' */

const plugins = /** @type {Record<PluginName, ESLint.Plugin>} */ ({
  'better-tailwindcss': betterTailwindcss,
  shadcn,
  lumen,
});

/**
 * No `settings`: each app points better-tailwindcss at its own Tailwind entry.
 * @param {PresetName} preset
 * @returns {Linter.Config}
 */
const toConfig = (preset) => ({
  name: `lumen/${preset}`,
  files: ['**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}'],
  plugins: Object.fromEntries(
    PLUGINS[preset].map((name) => [name, plugins[name]]),
  ),
  rules: /** @type {Linter.RulesRecord} */ (RULES[preset]),
});

// For consumers who change a rule's options but keep Lumen's.
export {
  LOGICAL_PROPERTIES_OPTIONS,
  NO_ARBITRARY_VALUES_OPTIONS,
  NO_RESTRICTED_CLASSES_OPTIONS,
  NO_RESTRICTED_IMPORTS_OPTIONS,
} from './rules.js';

export const configs = {
  react: {
    recommended: toConfig('recommended'),
    strict: toConfig('strict'),
  },
  reactnative: {
    strict: toConfig('react-native-strict'),
  },
};

// eslint-disable-next-line import/no-default-export
export default { configs };

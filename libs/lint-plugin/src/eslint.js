import { plugin as shadcn } from '@shadcn/lint';
import betterTailwindcss from 'eslint-plugin-better-tailwindcss';

import { RULES } from './rules.js';

/** @import { ESLint, Linter } from 'eslint' */
/** @import { PresetName } from './rules.js' */

const plugins = /** @type {Record<string, ESLint.Plugin>} */ ({
  'better-tailwindcss': betterTailwindcss,
  shadcn,
});

/**
 * No `settings`: each app points better-tailwindcss at its own Tailwind entry.
 * @param {PresetName} preset
 * @returns {Linter.Config}
 */
const toConfig = (preset) => ({
  name: `lumen/${preset}`,
  files: ['**/*.{ts,tsx,js,jsx}'],
  plugins,
  rules: /** @type {Linter.RulesRecord} */ (RULES[preset]),
});

// For consumers who change a rule's options but keep Lumen's.
export { NO_ARBITRARY_VALUES_OPTIONS, NO_RESTYLE_OPTIONS } from './rules.js';

export const configs = {
  recommended: toConfig('recommended'),
  strict: toConfig('strict'),
};

// eslint-disable-next-line import/no-default-export
export default { configs };

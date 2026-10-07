import { fileURLToPath } from 'node:url';

import { toOxlintConfig } from './oxlint-config.js';

/** @import { PluginName } from './oxlint-config.js' */

/**
 * oxlint resolves a bare plugin specifier from the *consumer's* config
 * directory, which fails under strict package managers for our own
 * dependencies. Absolute paths to files of this package always resolve, and
 * those files import the third-party plugins with Node's own resolution.
 * @param {PluginName} name
 * @returns {string}
 */
const resolvePluginFile = (name) =>
  fileURLToPath(new URL(`./plugins/${name}.js`, import.meta.url));

// For consumers who change a rule's options but keep Lumen's.
export { NO_ARBITRARY_VALUES_OPTIONS, NO_RESTYLE_OPTIONS } from './rules.js';

// No `settings`: oxlint ignores those of an extended config, so each app sets
// `settings["better-tailwindcss"].entryPoint` in its own config.
export const configs = {
  recommended: toOxlintConfig('recommended', {
    resolvePlugin: resolvePluginFile,
  }),
  strict: toOxlintConfig('strict', { resolvePlugin: resolvePluginFile }),
};

// eslint-disable-next-line import/no-default-export
export default { configs };

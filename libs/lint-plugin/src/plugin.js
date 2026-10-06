import { noHardcodedColors } from './rules/no-hardcoded-colors.js';
import { noHardcodedStyleLiterals } from './rules/no-hardcoded-style-literals.js';

/**
 * Engine-neutral plugin: rules only use the ESLint `create(context)` API, no
 * parser services, so ESLint and oxlint (`jsPlugins`) load the same object.
 * @type {import('eslint').ESLint.Plugin}
 */
export const plugin = {
  meta: { name: 'lumen' },
  rules: {
    'no-hardcoded-colors': noHardcodedColors,
    'no-hardcoded-style-literals': noHardcodedStyleLiterals,
  },
};

// oxlint loads a plugin file with `(await import(file)).default`.
// eslint-disable-next-line import/no-default-export
export default plugin;

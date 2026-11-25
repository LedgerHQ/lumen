import path from 'node:path';

const WORKSPACE_ROOT = path.resolve(import.meta.dirname, '../../..');

/**
 * The only place this project's paths are declared. Absolute, so the CLI
 * writes to the same folders whatever directory it runs from.
 */
export const automationConfig = {
  figmaTokensPath: path.join(
    WORKSPACE_ROOT,
    'internals/design-sources/tokens/figma',
  ),
  iconsPath: path.join(WORKSPACE_ROOT, 'internals/design-sources/icons'),
  /** Written by design-build; uploaded to Figma by `code-syntax`. */
  codeSyntaxPath: path.join(
    WORKSPACE_ROOT,
    'internals/design-build/generated/code-syntax.json',
  ),
};

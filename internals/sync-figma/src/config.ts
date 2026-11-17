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
  /** Published as is: see `ICONS_DIR` in design-sources. */
  iconsPath: path.join(WORKSPACE_ROOT, 'libs/design-core/symbols/icons'),
  /** Written by design-build; uploaded to Figma by `code-syntax`. */
  codeSyntaxPath: path.join(
    WORKSPACE_ROOT,
    'internals/design-build/generated/code-syntax.json',
  ),
};

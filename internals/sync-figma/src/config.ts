/**
 * Targets run without a `cwd`, so these are workspace-root-relative — and this
 * file is the only place this project's output paths are declared. Keep
 * it that way.
 */
export const automationConfig = {
  figmaTokensPath: 'internals/design-sources/tokens/figma/',
  iconsPath: 'internals/design-sources/icons/',
};

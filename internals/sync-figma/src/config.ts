/**
 * Targets run without a `cwd`, so these are workspace-root-relative — and this
 * file is the only place this project's coupling to `libs/*` is declared. Keep
 * it that way.
 */
export const automationConfig = {
  figmaTokensPath: 'internals/design-sources/tokens/figma/',
  symbolsOutputPath: 'libs/design-core/symbols/icons/',
  symbolsInputPath: 'libs/design-core/symbols/',
};

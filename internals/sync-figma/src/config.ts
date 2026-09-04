/**
 * Every path this project reads or writes, resolved from the workspace root.
 * All `sync-figma` targets run without a `cwd`, so this file is the single
 * place where the coupling to `libs/*` lives — keep it that way.
 */
export const automationConfig = {
  /** Raw Figma variable export; input to the token ETL. */
  figmaTokensPath: 'internals/sync-figma/tokens/',
  /** Generated CSS custom properties consumed by the Tailwind presets. */
  cssOutputPath: 'libs/design-core/src/lib/themes/css/',
  /** Where `figma-download-svgs` writes the raw SVGs. */
  symbolsPath: 'libs/design-core/symbols/icons/',
  /** Where the symbol codegen reads them back from. */
  symbolsInputPath: 'libs/design-core/symbols/',
};

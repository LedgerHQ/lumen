import type { IconModel, TokenModel } from '@lumen/design-sources';
import type { Target } from './core/target.js';
import { symbolComponentsTarget } from './icons/components.js';
import { svgTarget } from './icons/svg.js';
import { codeSyntaxTarget } from './tokens/codeSyntax.js';
import { cssTarget } from './tokens/css.js';
import { jsTarget } from './tokens/js.js';
import { tailwindTarget } from './tokens/tailwind.js';

/**
 * Every output folder, workspace-relative. This file is the only place the
 * build's coupling to `libs/*` (and to sync-figma's input) is declared.
 */
export const outputPaths = {
  css: 'libs/design-core/src/lib/generated/css',
  js: 'libs/design-core/src/lib/generated/js',
  tailwind: 'libs/design-core/src/lib/generated/tailwind',
  /** Read by sync-figma `code-syntax`, which uploads it to Figma. */
  codeSyntax: 'internals/design-build/generated',
  svgSymbols: 'libs/design-core/symbols/icons',
  reactSymbols: 'libs/ui-react/src/lib/Components/symbols',
  reactNativeSymbols: 'libs/ui-rnative/src/lib/Components/symbols',
};

export const tokenTargets: Target<TokenModel>[] = [
  cssTarget(outputPaths.css),
  jsTarget(outputPaths.js),
  tailwindTarget(outputPaths.tailwind),
  codeSyntaxTarget(outputPaths.codeSyntax),
];

export const iconTargets: Target<IconModel>[] = [
  svgTarget(outputPaths.svgSymbols),
  symbolComponentsTarget({
    name: 'react-symbols',
    outDir: outputPaths.reactSymbols,
    templatePath: `${outputPaths.reactSymbols}/utils/icon-template.ts`,
    native: false,
  }),
  symbolComponentsTarget({
    name: 'react-native-symbols',
    outDir: outputPaths.reactNativeSymbols,
    templatePath: `${outputPaths.reactNativeSymbols}/utils/icon-template.ts`,
    native: true,
  }),
];

import type { TokenModel } from '@lumen/design-sources';
import type { Target } from './core/target.js';
import { cssTarget } from './tokens/css.js';
import { jsTarget } from './tokens/js.js';
import { tailwindTarget } from './tokens/tailwind.js';

/**
 * Every output folder, workspace-relative. This file is the only place the
 * build's coupling to `libs/*` is declared.
 */
export const outputPaths = {
  css: 'libs/design-core/src/lib/generated/css',
  js: 'libs/design-core/src/lib/generated/js',
  tailwind: 'libs/design-core/src/lib/generated/tailwind',
};

export const tokenTargets: Target<TokenModel>[] = [
  cssTarget(outputPaths.css),
  jsTarget(outputPaths.js),
  tailwindTarget(outputPaths.tailwind),
];

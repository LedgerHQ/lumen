import type { TokenModel } from '@lumen/design-sources';
import type { Target } from './core/target.js';
import { cssTarget } from './tokens/css.js';

/**
 * Every output folder, workspace-relative. This file is the only place the
 * build's coupling to `libs/*` is declared.
 */
export const outputPaths = {
  css: 'libs/design-core/src/lib/generated/css',
};

export const tokenTargets: Target<TokenModel>[] = [cssTarget(outputPaths.css)];

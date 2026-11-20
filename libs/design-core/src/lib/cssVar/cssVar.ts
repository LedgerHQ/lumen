import type { CSSVarName } from '../generated/css/cssVarName.js';

export type { CSSVarName };
export type CSSVarRef = `var(${CSSVarName})`;

export const cssVar = (name: CSSVarRef): CSSVarRef => name;

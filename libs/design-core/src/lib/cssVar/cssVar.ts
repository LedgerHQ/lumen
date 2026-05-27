import type { allBrandsCSSTheme, primitivesTheme } from '../themes/css/index';

type PrimitiveKeys = keyof (typeof primitivesTheme)[':root'];
type SemanticKeys = keyof (typeof allBrandsCSSTheme)['.ledger-live'];

type FilterTokenKeys<T> = T extends
  | `--color-light-${string}`
  | `--color-dark-${string}`
  ? never
  : T extends `--${string}`
    ? T
    : never;

export type CSSVarName = FilterTokenKeys<PrimitiveKeys | SemanticKeys>;
export type CSSVarRef = `var(${CSSVarName})`;

export const cssVar = (name: CSSVarRef): CSSVarRef => name;

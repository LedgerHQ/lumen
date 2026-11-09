import {
  colorToHex,
  type DtcgDimension,
  type DtcgGroup,
  type DtcgToken,
  LUMEN_EXTENSION,
  type LumenExtension,
  referenceOf,
  type SourceFile,
  type TokenModel,
} from '@lumen/design-sources';
import { breakpointLayers, themeLayers } from './layers.js';
import { cssReference, cssVariableName } from './naming.js';

/** Custom property → value, in source order. */
export type Declarations = Record<string, string>;

export type CssLayers = {
  primitives: Declarations;
  themes: { brand: string; theme: string; declarations: Declarations }[];
  /** Base breakpoint first. */
  breakpoints: { breakpoint: string; declarations: Declarations }[];
};

export const cssValue = (type: string, value: unknown): string => {
  if (type === 'color') return colorToHex(value);
  if (type === 'dimension') {
    const { value: amount, unit } = value as DtcgDimension;
    return `${amount}${unit}`;
  }
  return String(value);
};

type TreeToken = DtcgToken & { path: string[] };

/** The tokens of a merged tree, in tree order: the order every output lists them in. */
const treeTokens = (tree: DtcgGroup, path: string[] = []): TreeToken[] =>
  Object.entries(tree).flatMap(([key, child]) => {
    if (key.startsWith('$') || typeof child !== 'object' || !child) return [];
    if ('$value' in child)
      return [{ ...(child as DtcgToken), path: [...path, key] }];
    return treeTokens(child as DtcgGroup, [...path, key]);
  });

/**
 * The declarations the `collections` of `files` build to. References stay
 * `var(--…)`, so a brand or theme switch only swaps the semantic layer. Two
 * tokens that normalize to one name would silently overwrite each other, so
 * that fails instead.
 */
export const cssDeclarations = (
  model: TokenModel,
  files: SourceFile[],
  collections: string[],
): Declarations => {
  const declarations: Declarations = {};
  const owners = new Map<string, string>();

  for (const token of treeTokens(model.tree(files))) {
    const { collection } = token.$extensions?.[
      LUMEN_EXTENSION
    ] as LumenExtension;
    if (!collections.includes(collection)) continue;

    const name = cssVariableName(token.path);
    const id = token.path.join('.');
    const owner = owners.get(name);
    if (owner && owner !== id) {
      throw new Error(
        `${owner} and ${id} both build to ${name}: rename one in Figma`,
      );
    }
    owners.set(name, id);

    const reference = referenceOf(token.$value);
    declarations[name] = reference
      ? cssReference(reference)
      : cssValue(token.$type, token.$value);
  }
  return declarations;
};

/** Every CSS layer: primitives, one per brand × theme, one per breakpoint. */
export const cssLayers = (
  model: TokenModel,
  breakpoints: string[],
): CssLayers => ({
  primitives: cssDeclarations(model, model.select(['primitives']), [
    'primitives',
  ]),
  themes: themeLayers(model).map(({ brand, theme, files, own }) => ({
    brand,
    theme,
    declarations: cssDeclarations(model, files, own),
  })),
  breakpoints: breakpointLayers(model, breakpoints).map(
    ({ breakpoint, files, own }) => ({
      breakpoint,
      declarations: cssDeclarations(model, files, own),
    }),
  ),
});

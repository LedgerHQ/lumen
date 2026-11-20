import {
  type DtcgColor,
  type DtcgDimension,
  type DtcgShadowLayer,
  referenceOf,
  type SourceFile,
  type Token,
  type TokenModel,
} from '@lumen/design-sources';
import { groupOf } from './groups.js';
import { breakpointLayers, themeLayers } from './modes.js';
import { cssReference, cssVariableName } from './naming.js';

/** Custom property → value, in source order. */
export type Declarations = Record<string, string>;

export type CssLayers = {
  primitives: Declarations;
  themes: { brand: string; theme: string; declarations: Declarations }[];
  /** Base breakpoint first. */
  breakpoints: { breakpoint: string; declarations: Declarations }[];
};

/** `#rrggbb`, or `#rrggbbaa` when translucent: the form every output writes. */
export const colorToHex = (color: unknown): string => {
  const { hex, alpha } = color as DtcgColor;
  if (alpha === undefined) return hex;
  return `${hex}${Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0')}`;
};

/** A value inside a composite token: a reference stays a variable, so the composite follows it. */
const cssPart = (type: string, value: unknown): string => {
  const reference = referenceOf(value);
  return reference ? cssReference(reference) : cssValue(type, value);
};

export const cssValue = (type: string, value: unknown): string => {
  if (type === 'color') return colorToHex(value);
  if (type === 'shadow') {
    return (value as DtcgShadowLayer[])
      .map((layer) =>
        [
          ...[layer.offsetX, layer.offsetY, layer.blur, layer.spread].map(
            (length) => cssPart('dimension', length),
          ),
          cssPart('color', layer.color),
        ].join(' '),
      )
      .join(', ');
  }
  if (type === 'dimension') {
    const { value: amount, unit } = value as DtcgDimension;
    return `${amount}${unit}`;
  }
  return String(value);
};

type TreeNode = Map<string, TreeNode | Token>;

/**
 * The tokens of `files` in merged-tree order, the order every output lists
 * them in: a later file's token joins its group where the group first
 * appeared, instead of going last.
 */
const treeOrder = (tokens: Token[]): Token[] => {
  const root: TreeNode = new Map();
  for (const token of tokens) {
    let node = root;
    for (const segment of token.path.slice(0, -1)) {
      let next = node.get(segment);
      if (!(next instanceof Map)) {
        next = new Map();
        node.set(segment, next);
      }
      node = next;
    }
    node.set(token.path[token.path.length - 1], token);
  }
  const ordered: Token[] = [];
  const walk = (node: TreeNode): void => {
    for (const child of node.values()) {
      if (child instanceof Map) walk(child);
      else ordered.push(child);
    }
  };
  walk(root);
  return ordered;
};

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

  for (const token of treeOrder(model.tokens(files))) {
    if (!collections.includes(token.source.collection)) continue;
    // Every group reaches the web; this fails on a token with no group.
    groupOf(token);

    const name = cssVariableName(token.path);
    const { id } = token;
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

/**
 * Every CSS layer: primitives (with the hand-written shadows, which Figma
 * variables can't hold), one per brand × theme, one per breakpoint.
 */
export const cssLayers = (
  model: TokenModel,
  breakpoints: string[],
): CssLayers => ({
  primitives: cssDeclarations(model, model.select(['primitives', 'shadow']), [
    'primitives',
    'shadow',
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

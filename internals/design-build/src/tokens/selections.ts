import type { SourceFile, TokenModel } from '@lumen/design-sources';

/**
 * The breakpoint modes, base first, ordered by their `screen.*` min-width.
 * Every target reads breakpoints from here, so a new Figma breakpoint either
 * builds everywhere or fails everywhere (until its min-width exists).
 */
export const orderedBreakpoints = (model: TokenModel): string[] => {
  const widths = new Map(
    model
      .tokens(model.sources.filter(({ collection }) => collection === 'screen'))
      .map((token) => [
        token.path[1],
        (model.resolve(token, model.sources) as { value: number }).value,
      ]),
  );
  const modes = model.modesOf('breakpoint');
  const missing = modes.filter((mode) => !widths.has(mode));
  if (missing.length) {
    throw new Error(
      `Breakpoint(s) ${missing.join(', ')} have no min-width: add them to tokens/code/screen.tokens.json`,
    );
  }
  return [...modes].sort(
    (a, b) => (widths.get(a) as number) - (widths.get(b) as number),
  );
};

/**
 * Every collection with a single file: the primitives, Figma's single-mode
 * collections (motion) and the hand-written code tokens. Selected by shape,
 * not by name, so renaming a Figma collection doesn't drop it.
 */
export const coreFiles = (model: TokenModel): SourceFile[] =>
  model.sources.filter(
    (source) =>
      model.sources.filter(({ collection }) => collection === source.collection)
        .length === 1,
  );

/** The multi-mode collections the targets combine: brand × theme, and breakpoints. */
export const BUILT_MODE_COLLECTIONS = ['theme', 'brand', 'breakpoint'];

/**
 * Multi-mode collections no output builds, and why. A new Figma collection
 * must land in one of the two lists: before this, `5.icon` and `6.spot` were
 * exported and silently never built.
 */
export const UNBUILT_COLLECTIONS: Record<string, string> = {
  icon: 'The size modes of the Figma Icon component. Its values point at per-size primitives (icon-width.*, icon-height.*…) that the outputs build, and components pick a size from props. Its few component-only values (icon-multiple, payment, dot-symbol) have no Lumen consumer yet.',
  spot: 'The size modes of the Figma Spot component. Every value points at a per-size primitive (spot-width.*, icon-width.*…) or a typography token that the outputs build.',
};

/** Throws when a multi-mode collection is neither built nor listed as unbuilt. */
export const assertEveryCollectionBuilt = (model: TokenModel): TokenModel => {
  const single = new Set(coreFiles(model).map(({ collection }) => collection));
  const unknown = model.collections
    .map(({ name }) => name)
    .filter(
      (name) =>
        !single.has(name) &&
        !BUILT_MODE_COLLECTIONS.includes(name) &&
        !(name in UNBUILT_COLLECTIONS),
    );
  if (unknown.length) {
    throw new Error(
      `No output builds the collection(s) ${unknown.join(', ')}: build them in design-build, or list them in UNBUILT_COLLECTIONS with the reason.`,
    );
  }
  return model;
};

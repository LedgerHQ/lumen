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

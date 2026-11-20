import type { SourceFile, Token, TokenModel } from '@lumen/design-sources';

/**
 * One combination of modes a target builds: the files to resolve against, and
 * the collections whose tokens belong to it (the rest are what it references).
 */
export type Layer = { files: SourceFile[]; own: string[] };
export type ThemeLayer = Layer & { brand: string; theme: string };
export type BreakpointLayer = Layer & { breakpoint: string };

/** Every output maps these two: `:root` and `.dark` on the web, `light` and `dark` in React Native. */
export const THEMES = ['dark', 'light'];

/**
 * Every brand × theme. Fails when Figma's themes aren't light and dark, rather
 * than leave an output without one.
 */
export const themeLayers = (model: TokenModel): ThemeLayer[] => {
  const themes = model.modesOf('theme');
  if (themes.join() !== THEMES.join()) {
    throw new Error(
      `The theme modes must be ${THEMES.join(' and ')}, Figma has ${themes.join(', ')}: every output builds a light and a dark theme`,
    );
  }
  return model.modesOf('brand').flatMap((brand) =>
    themes.map((theme) => ({
      brand,
      theme,
      files: model.select(['primitives', 'theme', 'brand'], { theme, brand }),
      own: ['theme', 'brand'],
    })),
  );
};

/** One layer per breakpoint, in the order given (base first). */
export const breakpointLayers = (
  model: TokenModel,
  breakpoints: string[],
): BreakpointLayer[] =>
  breakpoints.map((breakpoint) => ({
    breakpoint,
    files: model.select(['primitives', 'breakpoint'], { breakpoint }),
    own: ['breakpoint'],
  }));

/** The tokens a layer defines, without the ones it only references. */
export const layerTokens = (model: TokenModel, layer: Layer): Token[] =>
  model
    .tokens(layer.files)
    .filter(({ source }) => layer.own.includes(source.collection));

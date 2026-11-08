import type { TokenModel } from '@lumen/design-sources';
import type { OutputFile, Target } from '../core/target.js';
import { cssLayers, type Declarations } from './cssLayers.js';
import { camelKey } from './naming.js';
import { breakpointMinWidths, orderedBreakpoints } from './selections.js';

/** One selector → custom properties map, the shape the Tailwind plugins pass to `addBase`. */
const cssMap = (
  selector: string,
  declarations: Declarations,
  valueType: string,
): string => `/**
 * Do not edit directly, this file was auto-generated.
 */

export const tokens = ${JSON.stringify(Object.keys(declarations).length ? { [selector]: declarations } : {}, null, 2)} as const satisfies ${valueType};`;

const indexFile = (brands: string[], breakpoints: string[]): string => {
  const [base, ...rest] = breakpoints;
  const themeImport = (brand: string, theme: string): string =>
    `import { tokens as ${camelKey(brand)}${theme === 'dark' ? 'Dark' : 'Light'}ThemeTokens } from './${brand}/theme.${theme}-css.js';`;
  const typographyName = (breakpoint: string): string =>
    `typography${breakpoint[0].toUpperCase()}${camelKey(breakpoint.slice(1))}Tokens`;

  // Sorted by path, as the repo's import/order rule wants.
  const imports = [
    ...brands.flatMap((brand) => [
      themeImport(brand, 'dark'),
      themeImport(brand, 'light'),
    ]),
    `import { tokens as primitivesTokens } from './primitives-css.js';`,
    ...breakpoints.map(
      (breakpoint) =>
        `import { tokens as ${typographyName(breakpoint)} } from './typographies/typography.${breakpoint}-css.js';`,
    ),
  ].sort((a, b) => a.split('from')[1].localeCompare(b.split('from')[1]));

  return [
    ...imports,
    '',
    `export const primitivesTheme = {`,
    `  ':root': {`,
    `    ...primitivesTokens[':root'],`,
    `    ...${typographyName(base)}[':root'],`,
    ...rest.map((breakpoint) => `    ...${typographyName(breakpoint)},`),
    `  },`,
    `};`,
    '',
    ...brands.flatMap((brand) => [
      `export const ${camelKey(brand)}CSSTheme = {`,
      `  ...${camelKey(brand)}LightThemeTokens,`,
      `  ...${camelKey(brand)}DarkThemeTokens,`,
      `};`,
      '',
    ]),
    `export const allBrandsCSSTheme = {`,
    ...brands.flatMap((brand, index) => [
      ...(index ? [''] : []),
      `  '.${brand}': ${camelKey(brand)}LightThemeTokens[':root'],`,
      `  '.${brand}.dark': ${camelKey(brand)}DarkThemeTokens['.dark'],`,
    ]),
    `};`,
    '',
  ].join('\n');
};

/**
 * The CSS token maps: primitives, one semantic layer per brand × theme, and
 * one typography layer per breakpoint, plus the barrel that assembles them.
 * Brands, themes and breakpoints are read from the sources.
 */
export const cssTarget = (outDir: string): Target<TokenModel> => ({
  name: 'css',
  outDir,
  emit: (model) => {
    const breakpoints = orderedBreakpoints(model);
    const minWidths = breakpointMinWidths(model);
    const layers = cssLayers(model, breakpoints);
    const valueType = 'Record<string, Record<string, string | number>>';

    const files: OutputFile[] = [
      {
        path: 'primitives-css.ts',
        contents: cssMap(':root', layers.primitives, valueType),
      },
      ...layers.themes.map(({ brand, theme, declarations }) => ({
        path: `${brand}/theme.${theme}-css.ts`,
        contents: cssMap(
          theme === 'dark' ? '.dark' : ':root',
          declarations,
          'Record<string, Record<string, string>>',
        ),
      })),
      ...layers.breakpoints.map(({ breakpoint, declarations }, index) => ({
        path: `typographies/typography.${breakpoint}-css.ts`,
        contents: cssMap(
          index === 0
            ? ':root'
            : // Lumen's own min-width: `theme("screens.*")` resolved to
              // Tailwind's default rem screens, which drift from Lumen's px ones.
              `@media (min-width: ${minWidths.get(breakpoint)}px)`,
          declarations,
          valueType,
        ),
      })),
    ];

    files.push({
      path: 'index.ts',
      contents: indexFile(model.modesOf('brand'), breakpoints),
    });
    return files;
  },
});

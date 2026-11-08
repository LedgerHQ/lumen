import type { TokenModel } from '@lumen/design-sources';
import type { Target } from '../core/target.js';
import { jsTheme } from './js.js';
import { cssVariableName } from './naming.js';

/** Collections the CSS target builds: only their variables have a CSS name. */
const CSS_COLLECTIONS = new Set(['primitives', 'theme', 'brand', 'breakpoint']);

/**
 * What Dev Mode shows per platform: the CSS variable on web, the `t.*` theme
 * path on iOS and Android (React Native) when the token is on the theme.
 */
export type CodeSyntax = { WEB: string; iOS?: string; ANDROID?: string };

/** Figma collection (`2.theme`) → variable name (`color/background/canvas/default`) → code syntax. */
export type CodeSyntaxFile = Record<string, Record<string, CodeSyntax>>;

/** One variable per line: the file is long and only ever diffed. */
const serialize = (file: CodeSyntaxFile): string =>
  `{\n${Object.entries(file)
    .map(
      ([collection, variables]) =>
        `  ${JSON.stringify(collection)}: {\n${Object.entries(variables)
          .map(
            ([name, syntax]) =>
              `    ${JSON.stringify(name)}: ${JSON.stringify(syntax).replace(/,/g, ', ').replace(/":/g, '": ')}`,
          )
          .join(',\n')}\n  }`,
    )
    .join(',\n')}\n}\n`;

/**
 * The code syntax sync-figma uploads to Figma, built with the same naming
 * functions as the CSS and JS outputs, so Dev Mode and the code can't disagree
 * on a name. sync-figma reads this file; it never imports this project.
 */
export const codeSyntaxTarget = (outDir: string): Target<TokenModel> => ({
  name: 'code-syntax',
  outDir,
  format: false,
  emit: (model) => {
    const { themePaths } = jsTheme(model);
    const file: CodeSyntaxFile = {};
    for (const source of model.sources) {
      if (
        source.origin !== 'figma' ||
        !CSS_COLLECTIONS.has(source.collection)
      ) {
        continue;
      }
      const collection = `${source.order}.${source.collection}`;
      file[collection] ??= {};
      for (const token of model.tokens([source])) {
        const themePath = themePaths.get(`${source.collection}:${token.id}`);
        file[collection][token.path.join('/')] = {
          WEB: `var(${cssVariableName(token.path)});`,
          ...(themePath ? { iOS: themePath, ANDROID: themePath } : {}),
        };
      }
    }
    return [{ path: 'code-syntax.json', contents: serialize(file) }];
  },
});

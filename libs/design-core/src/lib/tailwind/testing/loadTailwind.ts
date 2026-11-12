import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { __unstable__loadDesignSystem, compile } from 'tailwindcss';

const require = createRequire(import.meta.url);
const tailwindDir = path.dirname(require.resolve('tailwindcss/package.json'));

/** The published Tailwind v4 files: `libs/design-core/tailwind/`. */
export const TAILWIND_CSS_DIR = path.resolve(
  import.meta.dirname,
  '../../../../tailwind',
);

/** Resolves `tailwindcss` and the files next to the Lumen CSS, as a consumer's bundler would. */
const options = {
  base: TAILWIND_CSS_DIR,
  loadStylesheet: async (
    id: string,
    base: string,
  ): Promise<{ path: string; base: string; content: string }> => {
    if (id === 'tailwindcss' || id.startsWith('tailwindcss/')) {
      const file =
        id === 'tailwindcss' ? 'index.css' : id.slice('tailwindcss/'.length);
      return {
        path: file,
        base: tailwindDir,
        content: readFileSync(path.join(tailwindDir, file), 'utf8'),
      };
    }
    const file = path.resolve(base, id);
    return {
      path: file,
      base: path.dirname(file),
      content: readFileSync(file, 'utf8'),
    };
  },
};

/** `@import "tailwindcss"`, plus a Lumen entry such as `ledger-live.css`. */
export const lumenCss = (entry?: string): string =>
  entry
    ? `@import "tailwindcss"; @import "./${entry}";`
    : '@import "tailwindcss";';

type DesignSystem = Awaited<ReturnType<typeof __unstable__loadDesignSystem>>;
type Compiler = Awaited<ReturnType<typeof compile>>;

export const loadDesignSystem = (css: string): Promise<DesignSystem> =>
  __unstable__loadDesignSystem(css, options);

export const compileCss = (css: string): Promise<Compiler> =>
  compile(css, options);

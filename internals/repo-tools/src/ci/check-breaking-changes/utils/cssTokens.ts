import { readFileSync } from 'node:fs';
import { filesUnder } from './files.ts';
import { readManifest } from './manifest.ts';

const declaration = /['"\s{;](--[a-z][a-z0-9-]*)['"]?\s*:/g;
const testCode = /\.(test|spec)\.js$/;
const definition = /@(utility|custom-variant)\s+([a-z][\w-]*\*?)/g;

/**
 * CSS custom properties declared in a CSS or JS source. A trailing dash is a
 * prefix plugins build names from, not a token.
 */
function declaredTokens(content: string): string[] {
  return [...content.matchAll(declaration)]
    .map(([, token]) => token)
    .filter((token) => !token.endsWith('-'));
}

/**
 * The package whose shipped JS declares the public tokens. Elsewhere, a
 * variable in JS is a component internal (`--donut-reveal`).
 */
const tokenPackage = '@ledgerhq/lumen-design-core';

/** Shipped files that declare public tokens: CSS, plus JS in the token package. */
function tokenFiles(root: string): string[] {
  const scanned =
    readManifest(root).name === tokenPackage ? /\.(css|js)$/ : /\.css$/;
  return filesUnder(root).filter(
    (path) => scanned.test(path) && !testCode.test(path),
  );
}

/**
 * Tailwind classes and variants a stylesheet defines by hand (`.scrollbar-none`,
 * `@dark`): consumers write them like tokens, but they declare no variable.
 */
function definedNames(content: string): string[] {
  return [...content.matchAll(definition)].map(([, kind, name]) =>
    kind === 'utility' ? `.${name}` : `@${name}`,
  );
}

/**
 * The names the package publishes as tokens: CSS custom properties, plus the
 * Tailwind utilities and variants its stylesheets define.
 */
export function cssTokens(root: string): string[] {
  const tokens = tokenFiles(root).flatMap((path) => {
    const content = readFileSync(path, 'utf8');
    return path.endsWith('.css')
      ? [...declaredTokens(content), ...definedNames(content)]
      : declaredTokens(content);
  });
  return [...new Set(tokens)].sort();
}

import { readFileSync } from 'node:fs';
import { filesUnder } from './files.ts';
import { readManifest } from './manifest.ts';

const declaration = /['"\s{;](--[a-z][a-z0-9-]*)['"]?\s*:/g;
const testCode = /\.(test|spec)\.js$/;

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

/** CSS custom properties the package publishes as tokens. */
export function cssTokens(root: string): string[] {
  const tokens = tokenFiles(root).flatMap((path) =>
    declaredTokens(readFileSync(path, 'utf8')),
  );
  return [...new Set(tokens)].sort();
}

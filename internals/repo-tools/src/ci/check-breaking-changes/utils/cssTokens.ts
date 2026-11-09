import { readFileSync } from 'node:fs';
import { filesUnder } from './files.ts';

const declaration = /['"\s{;](--[a-z][a-z0-9-]*)['"]?\s*:/g;
const shippedCode = /\.(css|js)$/;
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

/** CSS custom properties declared anywhere in the package's shipped code. */
export function cssTokens(root: string): string[] {
  const files = filesUnder(root).filter(
    (path) => shippedCode.test(path) && !testCode.test(path),
  );
  const tokens = files.flatMap((path) =>
    declaredTokens(readFileSync(path, 'utf8')),
  );
  return [...new Set(tokens)].sort();
}

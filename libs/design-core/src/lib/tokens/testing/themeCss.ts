import { readFileSync } from 'node:fs';
import path from 'node:path';
import { customProperties } from '../../tailwind/testing/cssFingerprint.js';

/** The published plain CSS themes: `libs/design-core/themes/css/`. */
const THEMES_CSS_DIR = path.resolve(
  import.meta.dirname,
  '../../../../themes/css',
);

/** A plain CSS theme file, as selector chain → custom property → value. */
export const themeCss = (
  file: string,
): Record<string, Record<string, string>> => {
  const css = readFileSync(path.join(THEMES_CSS_DIR, file), 'utf8').replace(
    /\/\*[\s\S]*?\*\//g,
    '',
  );
  const layers: Record<string, Record<string, string>> = {};
  for (const entry of customProperties(css)) {
    const [chain, declaration] = entry.split(' | ');
    const colon = declaration.indexOf(':');
    layers[chain] ??= {};
    layers[chain][declaration.slice(0, colon)] = declaration
      .slice(colon + 1)
      .trim();
  }
  return layers;
};

import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import {
  flattenTokens,
  ICONS_DIR,
  loadTokenSources,
  TOKENS_DIR,
} from '@lumen/design-sources';
import { type Diff, diffEntries, type Entries } from './core/diffReport.js';

/**
 * A token is identified per mode (`breakpoint/xl/font-style.body.1.size`), so
 * dropping a whole mode (a breakpoint, a brand) shows as removals, which
 * break consumers, not as value changes.
 */
export const tokenEntries = (tokensDir: string): Entries =>
  new Map(
    loadTokenSources(tokensDir).flatMap((source) =>
      flattenTokens(source).map((token) => [
        `${source.collection}/${source.mode ?? '-'}/${token.id}`,
        JSON.stringify({ $type: token.$type, $value: token.$value }),
      ]),
    ),
  );

export const iconEntries = (iconsDir: string): Entries => {
  if (!existsSync(iconsDir)) return new Map();
  return new Map(
    readdirSync(iconsDir)
      .filter((file) => file.endsWith('.svg'))
      .map((file) => [
        file.slice(0, -'.svg'.length),
        createHash('sha256')
          .update(readFileSync(path.join(iconsDir, file)))
          .digest('hex'),
      ]),
  );
};

/** Where the public names live, relative to a checkout root. */
const CODE_SYNTAX_FILE = 'internals/design-build/generated/code-syntax.json';
const TAILWIND_DIR = 'libs/design-core/tailwind';

/**
 * The names consumers write: CSS custom properties, Tailwind utilities, and
 * React Native theme paths. A change in design-build or `lumen.css` can
 * rename one without touching a source token, so the gate compares these too.
 */
export const publicNameEntries = (root: string): Entries => {
  const entries: Entries = new Map();

  const codeSyntax = path.join(root, CODE_SYNTAX_FILE);
  if (existsSync(codeSyntax)) {
    const collections = JSON.parse(readFileSync(codeSyntax, 'utf8')) as Record<
      string,
      Record<string, Record<string, string>>
    >;
    for (const variables of Object.values(collections)) {
      for (const names of Object.values(variables)) {
        for (const [platform, name] of Object.entries(names)) {
          if (platform === 'WEB') {
            entries.set(name.replace(/^var\(|\);?$/g, ''), 'css');
          } else entries.set(name, 'react-native');
        }
      }
    }
  }

  const tailwindDir = path.join(root, TAILWIND_DIR);
  if (existsSync(tailwindDir)) {
    for (const file of readdirSync(tailwindDir).filter((name) =>
      name.endsWith('.css'),
    )) {
      const css = readFileSync(path.join(tailwindDir, file), 'utf8');
      for (const [, name] of css.matchAll(/@utility\s+([\w-]+)/g)) {
        entries.set(`.${name}`, 'tailwind');
      }
      for (const [, name] of css.matchAll(/^\s*(--[\w-]+)\s*:/gm)) {
        entries.set(name, 'css');
      }
    }
  }
  return entries;
};

/** Public names in a checkout of the base branch that the working tree lost or renamed. */
export const publicNamesDiff = (beforeRoot: string, afterRoot: string): Diff =>
  diffEntries(publicNameEntries(beforeRoot), publicNameEntries(afterRoot));

/**
 * What changed between a copy of `internals/design-sources` and the working
 * tree. A kind missing from the copy is skipped: the tokens sync only keeps
 * `tokens/`.
 */
export const sourcesDiff = (beforeDir: string): Record<string, Diff> => {
  const sections: Record<string, Diff> = {};
  if (existsSync(path.join(beforeDir, 'tokens'))) {
    sections.Tokens = diffEntries(
      tokenEntries(path.join(beforeDir, 'tokens')),
      tokenEntries(TOKENS_DIR),
    );
  }
  if (existsSync(path.join(beforeDir, 'icons'))) {
    sections.Icons = diffEntries(
      iconEntries(path.join(beforeDir, 'icons')),
      iconEntries(ICONS_DIR),
    );
  }
  return sections;
};

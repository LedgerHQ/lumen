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

/**
 * What changed between a copy of the sources (`tokens/` from design-sources,
 * `icons/` from the published symbols) and the working tree. A kind missing
 * from the copy is skipped: the tokens sync only keeps `tokens/`.
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

import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  customProperties,
  normalizeCss as normalize,
} from './testing/cssFingerprint.js';
import {
  compileCss,
  loadDesignSystem,
  lumenCss,
} from './testing/loadTailwind.js';

/**
 * Freezes what Lumen adds to Tailwind: every class whose CSS differs from
 * vanilla Tailwind (hashed per utility family), the base layer (each custom
 * property with its selector and media condition) and a few variants. Hashes
 * are over normalized CSS, so formatting never changes them. The JS presets
 * gave the same snapshot before they were replaced by these CSS files.
 */

const VARIANT_SAMPLES = [
  'dark:bg-base',
  'dark:text-muted',
  'sm:p-16',
  'md:p-16',
  'lg:p-16',
  'xl:p-16',
  '2xl:p-16',
  'max-md:p-16',
  'hover:bg-base-hover',
  'group-hover:text-base',
];

const sha = (value: string): string =>
  createHash('sha256').update(value).digest('hex').slice(0, 16);

const utilityRoot = (className: string): string =>
  className
    .replace(/^-/, '')
    .split('-')
    .slice(0, className.startsWith('mask-') ? 3 : 1)
    .join('-');

type Footprint = {
  base: string;
  variants: string;
  utilities: Record<string, { count: number; hash: string }>;
};

const footprint = async (entry: string): Promise<Footprint> => {
  const lumen = await loadDesignSystem(lumenCss(entry));
  const vanilla = await loadDesignSystem(lumenCss());
  const compiler = await compileCss(lumenCss(entry));

  const byRoot = new Map<string, string[]>();
  for (const [className] of lumen.getClassList()) {
    const css = normalize(lumen.candidatesToCss([className])[0] ?? '');
    if (css === normalize(vanilla.candidatesToCss([className])[0] ?? '')) {
      continue;
    }
    const root = utilityRoot(className);
    byRoot.set(root, [...(byRoot.get(root) ?? []), css]);
  }

  return {
    base: sha(customProperties(compiler.build([])).join('\n')),
    variants: sha(
      lumen
        .candidatesToCss(VARIANT_SAMPLES)
        .map((css) => normalize(css ?? ''))
        .join('\n'),
    ),
    utilities: Object.fromEntries(
      [...byRoot.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([root, entries]) => [
          root,
          { count: entries.length, hash: sha(entries.sort().join('\n')) },
        ]),
    ),
  };
};

/** Snapshot key → entry, keyed as the presets they replace were. */
const entries = {
  enterprise: 'enterprise.css',
  ledgerLive: 'ledger-live.css',
  websites: 'websites.css',
  allBrands: 'all-brands.css',
};

describe('Tailwind snapshot', () => {
  it('freezes every class and token value Lumen adds to Tailwind', async () => {
    const results = Object.fromEntries(
      await Promise.all(
        Object.entries(entries).map(async ([name, entry]) => [
          name,
          await footprint(entry),
        ]),
      ),
    );

    await expect(`${JSON.stringify(results, null, 2)}\n`).toMatchFileSnapshot(
      '__snapshots__/tailwind.json',
    );
  }, 120_000);
});

import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import type { Config } from 'tailwindcss';
import { __unstable__loadDesignSystem, compile } from 'tailwindcss';
import { describe, expect, it } from 'vitest';
import {
  allBrandsPreset,
  enterprisePreset,
  ledgerLivePreset,
  websitesPreset,
} from './presets/index.js';
import {
  customProperties,
  normalizeCss as normalize,
} from './testing/cssFingerprint.js';

/**
 * Freezes what Lumen adds to Tailwind: every class whose CSS differs from
 * vanilla Tailwind (hashed per utility family), the base layer (each custom
 * property with its selector and media condition) and a few variants. Hashes
 * are over normalized CSS, so the same classes from another source (the v4
 * CSS files) give the same snapshot.
 */

const require = createRequire(import.meta.url);
const tailwindDir = path.dirname(require.resolve('tailwindcss/package.json'));

const loadStylesheet = async (
  id: string,
): Promise<{ path: string; base: string; content: string }> => {
  const file =
    id === 'tailwindcss' ? 'index.css' : id.replace('tailwindcss/', '');
  return {
    path: file,
    base: tailwindDir,
    content: readFileSync(path.join(tailwindDir, file), 'utf8'),
  };
};

const compileOptions = (preset?: Config) => ({
  base: '/',
  loadStylesheet,
  loadModule: async () => ({ path: 'preset', base: '/', module: preset ?? {} }),
});

const VANILLA = '@import "tailwindcss";';
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

const footprint = async (
  input: string,
  preset?: Config,
): Promise<Footprint> => {
  const lumen = await __unstable__loadDesignSystem(
    input,
    compileOptions(preset),
  );
  const vanilla = await __unstable__loadDesignSystem(VANILLA, compileOptions());
  const compiler = await compile(input, compileOptions(preset));

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

const presets = {
  enterprise: enterprisePreset,
  ledgerLive: ledgerLivePreset,
  websites: websitesPreset,
  allBrands: allBrandsPreset,
};

describe('Tailwind snapshot', () => {
  it('freezes every class and token value Lumen adds to Tailwind', async () => {
    const results = Object.fromEntries(
      await Promise.all(
        Object.entries(presets).map(async ([name, preset]) => [
          name,
          await footprint('@import "tailwindcss"; @config "./preset";', preset),
        ]),
      ),
    );

    await expect(`${JSON.stringify(results, null, 2)}\n`).toMatchFileSnapshot(
      '__snapshots__/tailwind.json',
    );
  }, 120_000);
});

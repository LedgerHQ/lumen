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
} from './index.js';

/**
 * Freezes what each preset adds to Tailwind, so the pipeline refactor (DLS-1177)
 * can prove it changed nothing. Only the classes whose CSS differs from vanilla
 * Tailwind are recorded: the preset's footprint.
 *
 * Color utilities (about 7,000 per preset, mostly `mask-*` combinations) are
 * recorded as a hash per utility root, and the base layer (token values) as one
 * hash, to keep the snapshot reviewable. Every other utility is written out in
 * full in `__snapshots__/tailwind-utilities.css`.
 */

const require = createRequire(import.meta.url);
const tailwindDir = path.dirname(require.resolve('tailwindcss/package.json'));

const loadStylesheet = async (
  id: string,
): Promise<{ path: string; base: string; content: string }> => {
  const file = id === 'tailwindcss' ? 'index.css' : id.replace('tailwindcss/', '');
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

const WITH_PRESET = '@import "tailwindcss"; @config "./preset";';
const VANILLA = '@import "tailwindcss";';
const COLOR_VARIABLE = /var\(--(background|text|border(?!-width)|color)-/;
const VARIANT_SAMPLES = [
  'dark:bg-base',
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
  utilities: Map<string, string>;
  colorUtilities: Record<string, { count: number; hash: string }>;
  base: string;
  variants: string;
};

const footprint = async (preset: Config): Promise<Footprint> => {
  const withPreset = await __unstable__loadDesignSystem(
    WITH_PRESET,
    compileOptions(preset),
  );
  const vanilla = await __unstable__loadDesignSystem(VANILLA, compileOptions());
  const compiler = await compile(WITH_PRESET, compileOptions(preset));

  const utilities = new Map<string, string>();
  const colorCss = new Map<string, string[]>();

  for (const [className] of withPreset.getClassList()) {
    const css = withPreset.candidatesToCss([className])[0] ?? '';
    if (css === (vanilla.candidatesToCss([className])[0] ?? '')) continue;

    if (COLOR_VARIABLE.test(css)) {
      const root = utilityRoot(className);
      colorCss.set(root, [...(colorCss.get(root) ?? []), `${className}${css}`]);
    } else {
      utilities.set(className, css);
    }
  }

  const colorUtilities = Object.fromEntries(
    [...colorCss.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([root, entries]) => [
        root,
        { count: entries.length, hash: sha(entries.sort().join('\n')) },
      ]),
  );

  return {
    utilities,
    colorUtilities,
    base: sha(compiler.build([])),
    variants: withPreset.candidatesToCss(VARIANT_SAMPLES).join(''),
  };
};

const presets = {
  enterprise: enterprisePreset,
  ledgerLive: ledgerLivePreset,
  websites: websitesPreset,
  allBrands: allBrandsPreset,
};

describe('preset snapshots', () => {
  it('freezes every utility and token each preset generates', async () => {
    const results = Object.fromEntries(
      await Promise.all(
        Object.entries(presets).map(async ([name, preset]) => [
          name,
          await footprint(preset),
        ]),
      ),
    ) as Record<keyof typeof presets, Footprint>;

    const reference = results.enterprise.utilities;
    const sorted = [...reference.entries()].sort(([a], [b]) =>
      a.localeCompare(b),
    );
    await expect(sorted.map(([, css]) => css).join('')).toMatchFileSnapshot(
      '__snapshots__/tailwind-utilities.css',
    );

    const perPreset = Object.fromEntries(
      Object.entries(results).map(([name, result]) => {
        const differsFromEnterprise = [...result.utilities.entries()]
          .filter(([className, css]) => reference.get(className) !== css)
          .map(([className, css]) => [className, sha(css)]);
        const missingFromPreset = [...reference.keys()].filter(
          (className) => !result.utilities.has(className),
        );

        return [
          name,
          {
            base: result.base,
            variants: sha(result.variants),
            differsFromEnterprise: Object.fromEntries(
              differsFromEnterprise.sort(([a], [b]) => a.localeCompare(b)),
            ),
            missingFromPreset,
            colorUtilities: result.colorUtilities,
          },
        ];
      }),
    );

    await expect(
      `${JSON.stringify(perPreset, null, 2)}\n`,
    ).toMatchFileSnapshot('__snapshots__/tailwind-presets.json');
    await expect(results.enterprise.variants).toMatchFileSnapshot(
      '__snapshots__/tailwind-variants.css',
    );
  }, 60_000);
});

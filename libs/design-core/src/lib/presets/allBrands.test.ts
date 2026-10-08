import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { __unstable__loadDesignSystem } from '@tailwindcss/node';
import tailwindcss from '@tailwindcss/postcss';
import postcss from 'postcss';
import { beforeAll, describe, expect, it } from 'vitest';
import { primitiveLayoutTokens } from '../themes/js/primitives/primitives.others';

const presetDir = dirname(fileURLToPath(import.meta.url));

const compile = async (
  classes: string[],
  theme: Record<string, unknown> = {},
): Promise<string> => {
  const configPath = join(
    mkdtempSync(join(tmpdir(), 'lumen-preset-')),
    'tailwind.config.ts',
  );
  writeFileSync(
    configPath,
    `import { allBrandsPreset } from '${join(presetDir, 'allBrands.ts')}';
export default { content: [], presets: [allBrandsPreset], theme: ${JSON.stringify(theme)} };`,
  );
  const input = `@import 'tailwindcss' source(none);
@config '${configPath}';
@source inline('${classes.join(' ')}');`;
  const { css } = await postcss([tailwindcss()]).process(input, {
    from: join(presetDir, 'preset.css'),
  });
  return css;
};

const escapeClassName = (className: string): string =>
  className
    .replace(/[@:/[\]()%.]/g, (char) => `\\${char}`)
    .replace(/^(\d)/, '\\3$1 ');

const getRule = (css: string, className: string): string | undefined => {
  const selector = `.${escapeClassName(className)} {`;
  const start = css.indexOf(selector);
  if (start === -1) return undefined;
  return css.slice(start + selector.length, css.indexOf('}', start)).trim();
};

describe('allBrandsPreset', () => {
  const breakpoints = Object.entries(primitiveLayoutTokens.breakpoints);
  const classes = [
    ...breakpoints.flatMap(([name]) => [`${name}:flex`, `max-${name}:flex`]),
    'w-md',
    'min-w-md',
    'max-w-md',
    'h-md',
    'size-md',
    'basis-md',
    'w-224',
    'max-w-prose',
    'columns-2',
    'columns-md',
    'z-toast',
    '@md:flex',
    '@max-md:flex',
    '@md/sidebar:flex',
    '@3xs:flex',
    '@7xl:flex',
    '@448:flex',
    'w-448',
    'max-w-400',
    'w-160',
  ];
  let css: string;

  beforeAll(async () => {
    css = await compile(classes);
  });

  it.each([
    { className: 'w-md', expected: 'width: var(--size-md)' },
    { className: 'min-w-md', expected: 'min-width: var(--size-md)' },
    { className: 'max-w-md', expected: 'max-width: var(--size-md)' },
    { className: 'h-md', expected: 'height: var(--size-md)' },
    { className: 'size-md', expected: 'width: var(--size-md)' },
    { className: 'basis-md', expected: 'flex-basis: var(--size-md)' },
    { className: 'w-224', expected: 'width: var(--size-224)' },
    { className: 'max-w-prose', expected: 'max-width: 65ch' },
    { className: 'columns-2', expected: 'columns: 2' },
    { className: 'columns-md', expected: 'columns: 448px' },
    { className: 'z-toast', expected: 'z-index: 150' },
  ])('should generate $className as $expected', ({ className, expected }) => {
    expect(getRule(css, className)).toContain(expected);
  });

  it.each([
    { className: '@md:flex', expected: '@container (width >= 448px)' },
    { className: '@max-md:flex', expected: '@container (width < 448px)' },
    {
      className: '@md/sidebar:flex',
      expected: '@container sidebar (width >= 448px)',
    },
    { className: '@3xs:flex', expected: '@container (width >= 256px)' },
    { className: '@7xl:flex', expected: '@container (width >= 1280px)' },
  ])(
    'should generate the $className container query from the size tokens',
    ({ className, expected }) => {
      expect(getRule(css, className)).toContain(expected);
    },
  );

  it.each(breakpoints)(
    'should generate the %s breakpoint from the JS theme value (%ipx)',
    (name, px) => {
      expect(getRule(css, `${name}:flex`)).toContain(
        `@media (width >= ${px}px)`,
      );
      expect(getRule(css, `max-${name}:flex`)).toContain(
        `@media (width < ${px}px)`,
      );
    },
  );

  it('should emit min-width container queries in ascending order', () => {
    const order = ['@3xs:flex', '@md:flex', '@7xl:flex'].map((className) =>
      css.indexOf(`.${escapeClassName(className)} {`),
    );

    expect(order).toEqual([...order].sort((a, b) => a - b));
  });

  it.each(['@448:flex', 'w-448', 'max-w-400', 'w-160'])(
    'should not generate %s',
    (className) => {
      expect(getRule(css, className)).toBeUndefined();
    },
  );

  it('should keep Lumen utilities when a consumer replaces the theme scales', async () => {
    const consumerCss = await compile(['z-toast', 'z-modal', 'h-md', 'w-md'], {
      zIndex: { modal: '500' },
      height: { brand: '1px' },
      width: { brand: '1px' },
    });

    expect(getRule(consumerCss, 'z-toast')).toContain('z-index: 150');
    expect(getRule(consumerCss, 'z-modal')).toContain('z-index: 500');
    expect(getRule(consumerCss, 'h-md')).toContain('height: var(--size-md)');
    expect(getRule(consumerCss, 'w-md')).toContain('width: var(--size-md)');
  });

  it.each(['sm', 'md', 'lg', 'xl', '2xl'] as const)(
    'should switch responsive typography at the Lumen %s breakpoint',
    (name) => {
      expect(css).toContain(
        `@media (min-width: ${primitiveLayoutTokens.breakpoints[name]}px)`,
      );
      expect(css).not.toMatch(/@media \(min-width: [\d.]+rem\)/);
    },
  );

  it('should emit responsive typography from the smallest to the largest breakpoint', () => {
    const widths = [...css.matchAll(/@media \(min-width: (\d+)px\)/g)].map(
      ([, px]) => Number(px),
    );

    expect(widths).toEqual([...widths].sort((a, b) => a - b));
  });

  it('should keep Lumen breakpoints when a consumer replaces screens', async () => {
    const consumerCss = await compile(
      breakpoints.map(([name]) => `${name}:flex`),
      { screens: { md: '900px' } },
    );

    for (const [name, px] of breakpoints) {
      expect(getRule(consumerCss, `${name}:flex`)).toContain(
        `@media (width >= ${px}px)`,
      );
    }
  });

  it('should only define Lumen breakpoints, with no Tailwind default left', async () => {
    const configPath = join(
      mkdtempSync(join(tmpdir(), 'lumen-preset-')),
      'tailwind.config.ts',
    );
    writeFileSync(
      configPath,
      `import { allBrandsPreset } from '${join(presetDir, 'allBrands.ts')}';
export default { content: [], presets: [allBrandsPreset] };`,
    );
    const designSystem = await __unstable__loadDesignSystem(
      `@import 'tailwindcss';\n@config '${configPath}';`,
      { base: presetDir },
    );

    expect(
      Object.fromEntries(designSystem.theme.namespace('--breakpoint')),
    ).toEqual(
      Object.fromEntries(breakpoints.map(([name, px]) => [name, `${px}px`])),
    );
  });
});

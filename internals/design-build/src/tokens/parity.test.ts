import { createTokenModel } from '@lumen/design-sources';
import { beforeAll, describe, expect, it } from 'vitest';
import type { OutputFile } from '../core/target.js';
import { cssTarget } from './css.js';
import { type JsTheme, jsTheme } from './js.js';
import { semanticKey } from './naming.js';
import { REACT_NATIVE_PENDING_DECISIONS } from './pendingDecisions.js';
import { hexToRgba, shadowUtilities } from './tailwind.js';

/**
 * `check` proves each output matches its generator; it can't prove two
 * generators agree. This compares, for every brand × theme and breakpoint,
 * the value the CSS target emits (resolved through its `var()` chain) with the
 * value the JS target emits for the same token.
 */

type CssMap = Record<string, string>;
type Json = Record<string, unknown>;

const parseConst = (file: OutputFile | undefined, name: string): Json => {
  const match = new RegExp(
    `export const ${name} = (\\{[\\s\\S]*?\\n\\}) as const`,
  ).exec(file?.contents ?? '');
  if (!match) throw new Error(`No ${name} in ${file?.path}`);
  return JSON.parse(match[1]) as Json;
};

const cssMap = (files: OutputFile[], path: string): CssMap =>
  Object.values(
    parseConst(
      files.find((f) => f.path === path),
      'tokens',
    ),
  )[0] as CssMap;

const resolve = (name: string, map: CssMap): string => {
  let value = map[name];
  for (let depth = 0; value?.startsWith('var('); depth++) {
    if (depth > 32) throw new Error(`Cycle at ${name}`);
    value = map[value.slice(4, -1)];
  }
  if (value === undefined) throw new Error(`Unresolved ${name}`);
  return value.toLowerCase();
};

const asPx = (value: string): number | string =>
  value.endsWith('px') ? Number(value.slice(0, -2)) : value;

const PENDING = new Set(
  REACT_NATIVE_PENDING_DECISIONS.map(({ path }) => path.join('.')),
);

describe('CSS and JS targets agree', () => {
  const model = createTokenModel();
  let css: OutputFile[];
  let js: JsTheme;

  beforeAll(async () => {
    css = await cssTarget('css').emit(model);
    js = jsTheme(model);
  });

  const COLOR_GROUPS: [string, string][] = [
    ['--background-', 'bg'],
    ['--text-', 'text'],
    ['--border-', 'border'],
    ['--color-crypto-', 'crypto'],
    ['--color-discover-', 'discover'],
  ];

  it.each(
    model
      .modesOf('brand')
      .flatMap((brand) =>
        model.modesOf('theme').map((theme) => [brand, theme]),
      ),
  )('%s %s colors', (brand, theme) => {
    const primitives = cssMap(css, 'primitives-css.ts');
    const semantic = cssMap(css, `${brand}/theme.${theme}-css.ts`);
    const merged = { ...primitives, ...semantic };
    const colors = js.colors[brand][theme] as Record<
      string,
      Record<string, string>
    >;

    const expected: Record<string, Record<string, string>> = {};
    for (const variable of Object.keys(semantic)) {
      if (variable.startsWith('--border-width')) continue;
      const group = COLOR_GROUPS.find(([prefix]) =>
        variable.startsWith(prefix),
      );
      if (!group) continue;
      expected[group[1]] ??= {};
      expected[group[1]][semanticKey(variable.slice(group[0].length))] =
        resolve(variable, merged);
    }

    const { gradients: _gradients, ...actual } = colors;
    expect(Object.keys(expected.bg ?? {}).length).toBeGreaterThan(50);
    expect(actual).toEqual(expected);
  });

  it('layout primitives, apart from the pending design decisions', () => {
    const primitives = cssMap(css, 'primitives-css.ts');
    const core = js.core;
    const groups: [string, string][] = [
      ['spacings', '--spacing-'],
      ['sizes', '--size-'],
      ['icon.width', '--icon-width-'],
      ['icon.height', '--icon-height-'],
      ['icon.borderWidth', '--icon-border-width-'],
      ['spot.width', '--spot-width-'],
      ['spot.height', '--spot-height-'],
      ['spinner.borderWidth', '--spinner-border-width-'],
      ['borderRadius', '--border-radius-'],
      ['stroke', '--stroke-'],
      ['blur', '--backdrop-blur-'],
    ];
    const issues: string[] = [];

    for (const [path, prefix] of groups) {
      const group = path
        .split('.')
        .reduce<Json>((node, key) => node[key] as Json, core);
      for (const [key, value] of Object.entries(group)) {
        const tokenPath = `${path}.${key}`;
        const variable = `${prefix}${key.replace(/^s(?=\d)/, '')}`;
        if (!(variable in primitives)) continue; // code-only, e.g. sizes.full
        const cssValue = asPx(resolve(variable, primitives));
        if (cssValue !== value && !PENDING.has(tokenPath)) {
          issues.push(`${tokenPath}: CSS=${cssValue}, JS=${String(value)}`);
        }
      }
      for (const variable of Object.keys(primitives)) {
        if (!variable.startsWith(prefix)) continue;
        const suffix = variable.slice(prefix.length);
        const key =
          /^\d/.test(suffix) && path !== 'borderRadius' ? `s${suffix}` : suffix;
        if (!(key in group)) issues.push(`${path}.${key}: missing in JS`);
      }
    }

    expect(issues).toEqual([]);
  });

  it.each(model.modesOf('breakpoint'))('%s typography', (breakpoint) => {
    const merged = {
      ...cssMap(css, 'primitives-css.ts'),
      ...cssMap(css, `typographies/typography.${breakpoint}-css.ts`),
    };
    const core = js.core;
    const groups = (core.typographies as Record<string, Record<string, Json>>)[
      breakpoint
    ];
    const issues: string[] = [];

    for (const styles of Object.values(groups)) {
      for (const [name, style] of Object.entries(styles) as [string, Json][]) {
        const base = `--font-style-${name
          .replace(/SemiBold$/, '')
          .replace(/([a-z])([A-Z])/g, '$1-$2')
          .replace(/([a-z])(\d)/g, '$1-$2')
          .toLowerCase()}`;
        const weight = base.startsWith('--font-style-responsive-')
          ? `${base}-weight`
          : `${base}-weight-${name.endsWith('SemiBold') ? 'semi-bold' : 'medium'}`;
        const expected = {
          fontFamily: resolve('--font-family-font', merged),
          fontSize: asPx(resolve(`${base}-size`, merged)),
          fontWeight: resolve(weight, merged),
          lineHeight: asPx(resolve(`${base}-line-height`, merged)),
          letterSpacing: asPx(resolve(`${base}-letter-spacing`, merged)),
        };
        const actual: Json = {
          ...style,
          fontFamily: String(style.fontFamily).toLowerCase(),
        };
        for (const [property, value] of Object.entries(expected)) {
          if (String(actual[property]) !== String(value)) {
            issues.push(
              `${name}.${property}: CSS=${value}, JS=${String(actual[property])}`,
            );
          }
        }
      }
    }

    expect(issues).toEqual([]);
  });

  it('web shadow utilities, apart from the pending design decisions', () => {
    const files = model.select([
      'primitives',
      ...model.collections
        .filter(({ name }) =>
          model.sources.some(
            (s) => s.collection === name && s.origin === 'code',
          ),
        )
        .map(({ name }) => name),
    ]);
    const web = shadowUtilities(model.tokens(files), (token) =>
      model.resolve(token, files),
    );
    const issues: string[] = [];

    for (const [size, layers] of Object.entries(
      js.core.shadows as Record<string, Json[]>,
    )) {
      const expected = layers.map((layer, index) => {
        const pending = PENDING.has(`shadows.${size}.${index}.color`);
        const length = (value: unknown): string =>
          value === 0 ? '0' : `${String(value)}px`;
        return pending
          ? null
          : `${length(layer.offsetX)} ${length(layer.offsetY)} ${length(layer.blurRadius)} ${length(layer.spreadDistance)} var(--tw-shadow-color, ${hexToRgba(String(layer.color))})`;
      });
      const actual =
        web[`.shadow-${size}`]?.['--tw-shadow']?.split(/(?<=\)\)),\s/);
      expected.forEach((layer, index) => {
        if (layer !== null && actual?.[index] !== layer) {
          issues.push(
            `shadows.${size}.${index}: web=${actual?.[index]}, JS=${layer}`,
          );
        }
      });
    }

    expect(issues).toEqual([]);
  });

  it('only overrides the values listed as pending decisions', () => {
    expect([...PENDING]).toEqual(['blur.lg', 'shadows.2xl.0.color']);
  });
});

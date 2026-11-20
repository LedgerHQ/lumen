import { createTokenModel } from '@lumen/design-sources';
import { beforeAll, describe, expect, it } from 'vitest';
import { type CssLayers, cssLayers } from './cssLayers.js';
import { GROUPS } from './groups.js';
import { type JsTheme, jsTheme } from './js.js';
import { orderedBreakpoints } from './modes.js';
import { cssVariableName, semanticKey, stepKey } from './naming.js';

/**
 * `check` proves each output matches its generator; it can't prove two
 * generators agree. This compares, for every brand × theme and breakpoint,
 * the value of the CSS layers every CSS output serializes (resolved through
 * its `var()` chain) with the value the JS target emits for the same token.
 */

type CssMap = Record<string, string>;
type Json = Record<string, unknown>;

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

describe('CSS and JS targets agree', () => {
  const model = createTokenModel();
  let css: CssLayers;
  let js: JsTheme;

  beforeAll(() => {
    css = cssLayers(model, orderedBreakpoints(model));
    js = jsTheme(model);
  });

  // CSS prefix → React Native color group, from the rows under `colors.`.
  const COLOR_GROUPS = Object.entries(GROUPS).flatMap(([key, group]) =>
    group.reactNative?.startsWith('colors.')
      ? [[`${cssVariableName(key.split('.'))}-`, group.reactNative.slice(7)]]
      : [],
  );

  it.each(
    model
      .modesOf('brand')
      .flatMap((brand) =>
        model.modesOf('theme').map((theme) => [brand, theme]),
      ),
  )('%s %s colors', (brand, theme) => {
    const primitives = css.primitives;
    const semantic =
      css.themes.find((layer) => layer.brand === brand && layer.theme === theme)
        ?.declarations ?? {};
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

  it('layout primitives', () => {
    const primitives = css.primitives;
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
        if (cssValue !== value) {
          issues.push(`${tokenPath}: CSS=${cssValue}, JS=${String(value)}`);
        }
      }
      for (const variable of Object.keys(primitives)) {
        if (!variable.startsWith(prefix)) continue;
        const suffix = variable.slice(prefix.length);
        const key = stepKey(suffix);
        if (!(key in group)) issues.push(`${path}.${key}: missing in JS`);
      }
    }

    expect(issues).toEqual([]);
  });

  it.each(model.modesOf('breakpoint'))('%s typography', (breakpoint) => {
    const merged = {
      ...css.primitives,
      ...css.breakpoints.find((layer) => layer.breakpoint === breakpoint)
        ?.declarations,
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

  it('shadows', () => {
    const variables = css.primitives;
    const issues: string[] = [];

    for (const [size, layers] of Object.entries(
      js.core.shadows as Record<string, Json[]>,
    )) {
      // Each layer of the CSS variable, with its color variable resolved.
      const web = (variables[`--shadow-${size}`] ?? '')
        .split(', ')
        .map((layer) =>
          layer.replace(/var\((--[^)]+)\)/g, (_, name: string) =>
            resolve(name, variables),
          ),
        );
      layers.forEach((layer, index) => {
        const expected = [
          layer.offsetX,
          layer.offsetY,
          layer.blurRadius,
          layer.spreadDistance,
        ]
          .map((length) => `${String(length)}px`)
          .concat(String(layer.color).toLowerCase())
          .join(' ');
        if (web[index] !== expected) {
          issues.push(
            `shadows.${size}.${index}: web=${web[index]}, JS=${expected}`,
          );
        }
      });
    }

    expect(issues).toEqual([]);
  });
});

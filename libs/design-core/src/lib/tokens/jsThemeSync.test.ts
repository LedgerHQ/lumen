import { describe, expect, it } from 'vitest';

import { tokens as enterpriseDarkCssTokens } from '../generated/css/enterprise/theme.dark-css.js';
import { tokens as enterpriseLightCssTokens } from '../generated/css/enterprise/theme.light-css.js';
import { tokens as ledgerLiveDarkCssTokens } from '../generated/css/ledger-live/theme.dark-css.js';
import { tokens as ledgerLiveLightCssTokens } from '../generated/css/ledger-live/theme.light-css.js';
import { tokens as primitivesCssTokens } from '../generated/css/primitives-css.js';
import { tokens as typographyLgCssTokens } from '../generated/css/typographies/typography.lg-css.js';
import { tokens as typographyMdCssTokens } from '../generated/css/typographies/typography.md-css.js';
import { tokens as typographySmCssTokens } from '../generated/css/typographies/typography.sm-css.js';
import { tokens as typographyXlCssTokens } from '../generated/css/typographies/typography.xl-css.js';
import { tokens as typographyXsCssTokens } from '../generated/css/typographies/typography.xs-css.js';
import { tokens as websitesDarkCssTokens } from '../generated/css/websites/theme.dark-css.js';
import { tokens as websitesLightCssTokens } from '../generated/css/websites/theme.light-css.js';
import { enterpriseDarkColorTokens } from '../generated/js/enterprise/theme.dark.js';
import { enterpriseThemes } from '../generated/js/enterprise/theme.js';
import { enterpriseLightColorTokens } from '../generated/js/enterprise/theme.light.js';
import { ledgerLiveDarkColorTokens } from '../generated/js/ledger-live/theme.dark.js';
import { ledgerLiveLightColorTokens } from '../generated/js/ledger-live/theme.light.js';
import type {
  ThemeColorTokens,
  TypographyDefinition,
} from '../generated/js/types.js';
import { websitesDarkColorTokens } from '../generated/js/websites/theme.dark.js';
import { websitesLightColorTokens } from '../generated/js/websites/theme.light.js';
import { createShadowPlugin } from '../tailwind/plugins/createCustomPlugin.js';

type CssTokenMap = Record<string, string>;
type ThemeGroup = keyof Pick<
  ThemeColorTokens,
  'bg' | 'text' | 'border' | 'crypto' | 'discover'
>;

const CSS_PREFIX_TO_GROUP: Record<string, ThemeGroup> = {
  '--background-': 'bg',
  '--text-': 'text',
  '--border-': 'border',
  '--color-crypto-': 'crypto',
  '--color-discover-': 'discover',
};

const kebabToCamel = (rest: string): string => {
  const parts = rest.split('-');

  return parts.reduce((result, part, index) => {
    if (/^\d+$/.test(part) && result.length > 0) {
      return `${result}${part}`;
    }

    if (index === 0) {
      return part;
    }

    return `${result}${part.charAt(0).toUpperCase()}${part.slice(1)}`;
  }, '');
};

const resolveCssVar = (
  name: string,
  tokenMap: CssTokenMap,
  visited = new Set<string>(),
): string => {
  const value = tokenMap[name];

  if (value === undefined) {
    throw new Error(`Unresolved CSS variable: ${name}`);
  }

  const varMatch = /^var\((--[a-z0-9-]+)\)$/.exec(value);

  if (!varMatch) {
    return value.toLowerCase();
  }

  const referencedVar = varMatch[1];

  if (visited.has(referencedVar)) {
    throw new Error(`Circular CSS variable reference: ${name}`);
  }

  visited.add(referencedVar);

  return resolveCssVar(referencedVar, tokenMap, visited);
};

const buildMergedCssMap = (themeTokens: CssTokenMap): CssTokenMap => ({
  ...primitivesCssTokens[':root'],
  ...themeTokens,
});

const extractExpectedFromCss = (
  themeTokens: CssTokenMap,
): Record<ThemeGroup, Record<string, string>> => {
  const mergedMap = buildMergedCssMap(themeTokens);
  const expected: Record<ThemeGroup, Record<string, string>> = {
    bg: {},
    text: {},
    border: {},
    crypto: {},
    discover: {},
  };

  for (const [cssKey, cssValue] of Object.entries(themeTokens)) {
    if (cssKey.startsWith('--border-width')) {
      continue;
    }

    const prefix = Object.keys(CSS_PREFIX_TO_GROUP).find((candidate) =>
      cssKey.startsWith(candidate),
    );

    if (!prefix) {
      continue;
    }

    const group = CSS_PREFIX_TO_GROUP[prefix];
    const rest = cssKey.slice(prefix.length);
    const jsKey = kebabToCamel(rest);

    if (cssValue.startsWith('var(')) {
      expected[group][jsKey] = resolveCssVar(cssKey, mergedMap);
      continue;
    }

    expected[group][jsKey] = cssValue.toLowerCase();
  }

  return expected;
};

type ThemeFixture = {
  brand: string;
  theme: 'light' | 'dark';
  cssTokens: Record<string, CssTokenMap>;
  jsColorTokens: ThemeColorTokens;
};

const themeFixtures: ThemeFixture[] = [
  {
    brand: 'enterprise',
    theme: 'light',
    cssTokens: enterpriseLightCssTokens,
    jsColorTokens: enterpriseLightColorTokens,
  },
  {
    brand: 'enterprise',
    theme: 'dark',
    cssTokens: enterpriseDarkCssTokens,
    jsColorTokens: enterpriseDarkColorTokens,
  },
  {
    brand: 'websites',
    theme: 'light',
    cssTokens: websitesLightCssTokens,
    jsColorTokens: websitesLightColorTokens,
  },
  {
    brand: 'websites',
    theme: 'dark',
    cssTokens: websitesDarkCssTokens,
    jsColorTokens: websitesDarkColorTokens,
  },
  {
    brand: 'ledger-live',
    theme: 'light',
    cssTokens: ledgerLiveLightCssTokens,
    jsColorTokens: ledgerLiveLightColorTokens,
  },
  {
    brand: 'ledger-live',
    theme: 'dark',
    cssTokens: ledgerLiveDarkCssTokens,
    jsColorTokens: ledgerLiveDarkColorTokens,
  },
];

const getThemeBlock = (fixture: ThemeFixture): CssTokenMap =>
  fixture.cssTokens[fixture.theme === 'light' ? ':root' : '.dark'];

const compareThemeSync = (fixture: ThemeFixture): string[] => {
  const themeBlock = getThemeBlock(fixture);
  const expectedByGroup = extractExpectedFromCss(themeBlock);
  const issues: string[] = [];

  const groups: ThemeGroup[] = ['bg', 'text', 'border', 'crypto', 'discover'];

  for (const group of groups) {
    const expected = expectedByGroup[group];
    const actual = fixture.jsColorTokens[group] as Record<string, string>;
    const expectedKeys = new Set(Object.keys(expected));
    const actualKeys = new Set(Object.keys(actual));

    for (const key of expectedKeys) {
      if (!actualKeys.has(key)) {
        issues.push(
          `[${fixture.brand}/${fixture.theme}] ${group}.${key}: missing in JS (CSS resolves to ${expected[key]})`,
        );
      }
    }

    for (const key of actualKeys) {
      if (!expectedKeys.has(key)) {
        issues.push(
          `[${fixture.brand}/${fixture.theme}] ${group}.${key}: extra in JS (not in CSS consumable layer)`,
        );
      }
    }

    for (const key of expectedKeys) {
      if (!actualKeys.has(key)) {
        continue;
      }

      const expectedValue = expected[key];
      const actualValue = actual[key].toLowerCase();

      if (expectedValue === actualValue) {
        continue;
      }

      issues.push(
        `[${fixture.brand}/${fixture.theme}] ${group}.${key}: value mismatch (CSS=${expectedValue}, JS=${actualValue})`,
      );
    }
  }

  return issues;
};

describe('jsThemeSync — CSS consumable tokens vs JS theme objects', () => {
  it.each(themeFixtures)(
    '$brand $theme theme is in sync with CSS',
    (fixture) => {
      const issues = compareThemeSync(fixture);

      expect(
        issues,
        issues.length > 0
          ? `JS theme drift detected — sync libs/design-core/src/lib/generated/js/:\n${issues.join('\n')}`
          : undefined,
      ).toEqual([]);
    },
  );
});

const primitiveCss: CssTokenMap = primitivesCssTokens[':root'];

const resolvePx = (cssName: string): number | string => {
  const value = resolveCssVar(cssName, primitiveCss);
  return value.endsWith('px') ? Number(value.slice(0, -2)) : value;
};

const LAYOUT_GROUPS: [path: string, cssPrefix: string][] = [
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

/** JS-only keys with no Figma variable: they move to `tokens/code/` (DLS-1181). */
const CODE_ONLY_LAYOUT_KEYS = new Set(['sizes.full']);

/**
 * Known drift, waiting for a design decision (DLS-1181): Figma says 16, the
 * hand-written theme 64, and `TabBar` uses it.
 */
const KNOWN_LAYOUT_DRIFT = new Set(['blur.lg']);

/** Figma variables React Native can't read yet; generating the theme adds them. */
const KNOWN_MISSING_IN_JS = [
  'blur.sm',
  'blur.xl',
  'borderRadius.xxs',
  'icon.borderWidth.s64',
  'icon.height.s64',
  'icon.width.s64',
  'spinner.borderWidth.s64',
  'spot.height.s40',
  'spot.width.s40',
  'stroke.s05',
  'stroke.s4',
];

const getPath = (object: object, path: string): Record<string, unknown> =>
  path
    .split('.')
    .reduce<
      Record<string, unknown>
    >((node, key) => node[key] as Record<string, unknown>, object as Record<string, unknown>);

/** `s16` ↔ `16`, `md` ↔ `md`, `s05` ↔ `05`. */
const toCssSuffix = (jsKey: string): string => jsKey.replace(/^s(?=\d)/, '');
const toJsKey = (cssSuffix: string, sampleKeys: string[]): string =>
  sampleKeys.some((key) => /^s\d/.test(key)) && /^\d/.test(cssSuffix)
    ? `s${cssSuffix}`
    : cssSuffix;

describe('jsThemeSync — layout primitives', () => {
  const layout = enterpriseThemes.light;
  const issues: string[] = [];
  const missingInJs: string[] = [];

  for (const [path, prefix] of LAYOUT_GROUPS) {
    const jsGroup = getPath(layout, path);
    const jsKeys = Object.keys(jsGroup);

    for (const [key, value] of Object.entries(jsGroup)) {
      const tokenPath = `${path}.${key}`;
      if (CODE_ONLY_LAYOUT_KEYS.has(tokenPath)) continue;

      const cssName = `${prefix}${toCssSuffix(key)}`;
      if (!(cssName in primitiveCss)) {
        issues.push(`${tokenPath}: extra in JS (no ${cssName})`);
        continue;
      }

      const cssValue = resolvePx(cssName);
      if (cssValue !== value && !KNOWN_LAYOUT_DRIFT.has(tokenPath)) {
        issues.push(`${tokenPath}: CSS=${cssValue}, JS=${String(value)}`);
      }
    }

    for (const cssName of Object.keys(primitiveCss)) {
      if (!cssName.startsWith(prefix)) continue;
      const suffix = cssName.slice(prefix.length);
      const jsKey = toJsKey(suffix, jsKeys);
      if (!(jsKey in jsGroup)) missingInJs.push(`${path}.${jsKey}`);
    }
  }

  it('matches the CSS primitives for every value React Native reads', () => {
    expect(issues).toEqual([]);
  });

  it('only lacks the known Figma variables React Native does not read yet', () => {
    expect(missingInJs.sort()).toEqual(KNOWN_MISSING_IN_JS);
  });

  it('keeps the known blur.lg drift visible until design decides', () => {
    expect(resolvePx('--backdrop-blur-lg')).toBe(16);
    expect(layout.blur.lg).toBe(64);
  });
});

const BREAKPOINT_CSS = {
  xs: typographyXsCssTokens,
  sm: typographySmCssTokens,
  md: typographyMdCssTokens,
  lg: typographyLgCssTokens,
  xl: typographyXlCssTokens,
} as const;

const typographyCssName = (
  jsName: string,
): { base: string; weight: string } => {
  const semiBold = jsName.endsWith('SemiBold');
  const base = jsName
    .replace(/SemiBold$/, '')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([a-z])(\d)/g, '$1-$2')
    .toLowerCase();
  const weight = base.startsWith('responsive-')
    ? `--font-style-${base}-weight`
    : `--font-style-${base}-weight-${semiBold ? 'semi-bold' : 'medium'}`;

  return { base: `--font-style-${base}`, weight };
};

describe('jsThemeSync — typography per breakpoint', () => {
  it.each(Object.keys(BREAKPOINT_CSS) as (keyof typeof BREAKPOINT_CSS)[])(
    '%s typography matches the CSS tokens',
    (breakpoint) => {
      const cssBlock = Object.values(
        BREAKPOINT_CSS[breakpoint],
      )[0] as CssTokenMap;
      const merged = { ...primitiveCss, ...cssBlock };
      const resolve = (name: string): number | string => {
        const value = resolveCssVar(name, merged);
        return value.endsWith('px') ? Number(value.slice(0, -2)) : value;
      };
      const issues: string[] = [];
      const groups = enterpriseThemes.light.typographies[breakpoint];

      for (const styles of Object.values(groups) as Record<
        string,
        TypographyDefinition
      >[]) {
        for (const [name, style] of Object.entries(styles)) {
          const { base, weight } = typographyCssName(name);
          const expected = {
            fontFamily: resolve('--font-family-font'),
            fontSize: resolve(`${base}-size`),
            fontWeight: resolve(weight),
            lineHeight: resolve(`${base}-line-height`),
            letterSpacing: resolve(`${base}-letter-spacing`),
          };
          const actual = {
            ...style,
            fontFamily: style.fontFamily.toLowerCase(),
          };

          for (const [property, value] of Object.entries(expected)) {
            const actualValue = actual[property as keyof typeof actual];
            if (String(actualValue) !== String(value)) {
              issues.push(
                `${name}.${property}: CSS=${value}, JS=${actualValue}`,
              );
            }
          }
        }
      }

      expect(issues).toEqual([]);
    },
  );
});

type ShadowLayer = {
  offsetX: number;
  offsetY: number;
  blurRadius: number;
  spreadDistance: number;
  color: string;
};

const hex8ToRgba = (hex: string): string => {
  const [r, g, b, a] = [1, 3, 5, 7].map((index) =>
    Number.parseInt(hex.slice(index, index + 2), 16),
  );
  return `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(2)})`;
};

const webShadows = (): Record<string, ShadowLayer[]> => {
  let utilities: Record<string, Record<string, string>> = {};
  const { handler } = createShadowPlugin();
  handler({
    addUtilities: (value: typeof utilities) => {
      utilities = value;
    },
    matchUtilities: () => undefined,
    theme: () => ({}),
  } as unknown as Parameters<typeof handler>[0]);

  return Object.fromEntries(
    Object.entries(utilities).map(([selector, declarations]) => [
      selector.replace('.shadow-', ''),
      declarations['--tw-shadow'].split(/(?<=\)\)),\s/).map((layer) => {
        const [offsetX, offsetY, blurRadius, spreadDistance] = layer
          .split(' ')
          .slice(0, 4)
          .map((part) => Number.parseFloat(part));
        const color = /var\(--tw-shadow-color, (rgba\([^)]+\))\)/.exec(
          layer,
        )?.[1];
        return {
          offsetX,
          offsetY,
          blurRadius,
          spreadDistance,
          color: color ?? '',
        };
      }),
    ]),
  );
};

/** Known drift, waiting for a design decision (DLS-1181): 25% on web, 20% on mobile. */
const KNOWN_SHADOW_DRIFT = new Set(['2xl.0.color']);

describe('jsThemeSync — shadows', () => {
  it('matches the web shadow utilities for every layer', () => {
    const web = webShadows();
    const issues: string[] = [];

    for (const [size, layers] of Object.entries(
      enterpriseThemes.light.shadows,
    )) {
      // The JS theme lists layers innermost first; Tailwind writes them in the same order.
      layers.forEach((layer: ShadowLayer, index: number) => {
        const expected = { ...layer, color: hex8ToRgba(layer.color) };
        const actual = web[size]?.[index];
        for (const property of Object.keys(expected) as (keyof ShadowLayer)[]) {
          const path = `${size}.${index}.${property}`;
          if (
            actual?.[property] !== expected[property] &&
            !KNOWN_SHADOW_DRIFT.has(path)
          ) {
            issues.push(
              `${path}: web=${actual?.[property]}, JS=${expected[property]}`,
            );
          }
        }
      });
    }

    expect(issues).toEqual([]);
    expect(Object.keys(web).sort()).toEqual(
      Object.keys(enterpriseThemes.light.shadows).sort(),
    );
  });
});

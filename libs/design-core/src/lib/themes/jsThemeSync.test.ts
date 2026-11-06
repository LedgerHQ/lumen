import { describe, expect, it } from 'vitest';

import { tokens as enterpriseDarkCssTokens } from './css/enterprise/theme.dark-css.js';
import { tokens as enterpriseLightCssTokens } from './css/enterprise/theme.light-css.js';
import { tokens as ledgerLiveDarkCssTokens } from './css/ledger-live/theme.dark-css.js';
import { tokens as ledgerLiveLightCssTokens } from './css/ledger-live/theme.light-css.js';
import { tokens as primitivesCssTokens } from './css/primitives-css.js';
import { tokens as websitesDarkCssTokens } from './css/websites/theme.dark-css.js';
import { tokens as websitesLightCssTokens } from './css/websites/theme.light-css.js';
import { enterpriseDarkColorTokens } from './js/enterprise/theme.dark.js';
import { enterpriseLightColorTokens } from './js/enterprise/theme.light.js';
import { ledgerLiveDarkColorTokens } from './js/ledger-live/theme.dark.js';
import { ledgerLiveLightColorTokens } from './js/ledger-live/theme.light.js';
import { primitiveLayoutTokens } from './js/primitives/primitives.others.js';
import type { ThemeColorTokens } from './js/types.js';
import { websitesDarkColorTokens } from './js/websites/theme.dark.js';
import { websitesLightColorTokens } from './js/websites/theme.light.js';

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

// `sizes.full` is a JS-only alias for `100%`, with no `--size-*` counterpart.
const JS_ONLY_LAYOUT_KEYS = new Set(['full']);

const toJsLayoutKey = (cssKey: string): string =>
  `s${cssKey.replace(/^(\d*)([a-z])/, (_, digits: string, letter: string) => digits + letter.toUpperCase())}`;

const compareLayoutSync = (
  prefix: string,
  jsTokens: Record<string, number | string>,
): string[] => {
  const issues: string[] = [];
  const cssTokens = Object.entries(primitivesCssTokens[':root']).filter(
    ([name]) => name.startsWith(prefix),
  );
  const expectedJsKeys = new Set<string>();

  for (const [name, value] of cssTokens) {
    const jsKey = toJsLayoutKey(name.slice(prefix.length));
    expectedJsKeys.add(jsKey);
    const cssValue = parseFloat(String(value));
    if (!(jsKey in jsTokens)) {
      issues.push(`${jsKey}: missing in JS (CSS ${name} = ${value})`);
    } else if (jsTokens[jsKey] !== cssValue) {
      issues.push(
        `${jsKey}: JS ${jsTokens[jsKey]} differs from CSS ${name} = ${value}`,
      );
    }
  }

  for (const jsKey of Object.keys(jsTokens)) {
    if (!expectedJsKeys.has(jsKey) && !JS_ONLY_LAYOUT_KEYS.has(jsKey)) {
      issues.push(`${jsKey}: in JS but not in CSS (${prefix}*)`);
    }
  }

  return issues;
};

describe('jsThemeSync — CSS layout primitives vs JS layout tokens', () => {
  it.each([
    { group: 'sizes', prefix: '--size-', tokens: primitiveLayoutTokens.sizes },
    {
      group: 'spacings',
      prefix: '--spacing-',
      tokens: primitiveLayoutTokens.spacings,
    },
  ])('$group are in sync with CSS', ({ prefix, tokens }) => {
    const issues = compareLayoutSync(prefix, tokens);

    expect(
      issues,
      issues.length > 0
        ? `JS layout drift detected — sync libs/design-core/src/lib/themes/js/primitives/primitives.others.ts:\n${issues.join('\n')}`
        : undefined,
    ).toEqual([]);
  });
});

describe('jsThemeSync — CSS consumable tokens vs JS theme objects', () => {
  it.each(themeFixtures)(
    '$brand $theme theme is in sync with CSS',
    (fixture) => {
      const issues = compareThemeSync(fixture);

      expect(
        issues,
        issues.length > 0
          ? `JS theme drift detected — sync libs/design-core/src/lib/themes/js/:\n${issues.join('\n')}`
          : undefined,
      ).toEqual([]);
    },
  );
});

import { describe, expect, it } from 'vitest';

import { tokens as enterpriseDarkCssTokens } from './css/enterprise/theme.dark-css';
import { tokens as enterpriseLightCssTokens } from './css/enterprise/theme.light-css';
import { tokens as ledgerLiveDarkCssTokens } from './css/ledger-live/theme.dark-css';
import { tokens as ledgerLiveLightCssTokens } from './css/ledger-live/theme.light-css';
import { tokens as primitivesCssTokens } from './css/primitives-css';
import { tokens as websitesDarkCssTokens } from './css/websites/theme.dark-css';
import { tokens as websitesLightCssTokens } from './css/websites/theme.light-css';
import { enterpriseDarkColorTokens } from './js/enterprise/theme.dark';
import { enterpriseLightColorTokens } from './js/enterprise/theme.light';
import { ledgerLiveDarkColorTokens } from './js/ledger-live/theme.dark';
import { ledgerLiveLightColorTokens } from './js/ledger-live/theme.light';
import type { ThemeColorTokens } from './js/types';
import { websitesDarkColorTokens } from './js/websites/theme.dark';
import { websitesLightColorTokens } from './js/websites/theme.light';

type CssTokenMap = Record<string, string>;
type ThemeGroup = keyof Pick<
  ThemeColorTokens,
  'bg' | 'text' | 'border' | 'crypto' | 'discover'
>;

type SyncException = {
  brand: string;
  theme: 'light' | 'dark';
  group: ThemeGroup;
  key: string;
  reason: string;
};

const BRANDS = ['enterprise', 'websites', 'ledger-live'] as const;

const forAllBrands = (
  themes: ('light' | 'dark')[],
  group: ThemeGroup,
  key: string,
  reason: string,
): SyncException[] =>
  BRANDS.flatMap((brand) =>
    themes.map((theme) => ({ brand, theme, group, key, reason })),
  );

/**
 * Pre-existing intentional diffs between CSS consumable tokens and JS themes.
 * Only add entries for quirks that predate this check — not for missing sync work.
 */
const KNOWN_EXCEPTIONS: SyncException[] = [
  ...forAllBrands(
    ['dark', 'light'],
    'border',
    'activeHover',
    'CSS --border-active-hover aliases to -pressed for enterprise only',
  ).filter(({ brand }) => brand === 'enterprise'),
  ...forAllBrands(
    ['dark', 'light'],
    'bg',
    'errorTransparent',
    'JS-only legacy alias; CSS consumable layer has errorTransparent0 only',
  ),
  ...forAllBrands(
    ['dark', 'light'],
    'bg',
    'successTransparent',
    'JS-only legacy alias; CSS consumable layer has successTransparent0 only',
  ),
  ...forAllBrands(
    ['dark', 'light'],
    'border',
    'whiteHover',
    'JS-only token; not exposed in CSS consumable layer',
  ),
  ...forAllBrands(
    ['dark', 'light'],
    'border',
    'whitePressed',
    'JS-only token; not exposed in CSS consumable layer',
  ),
  ...forAllBrands(
    ['light'],
    'bg',
    'surfaceTransparentHover',
    'JS references grey 950-10; CSS consumable resolves to grey 950-5',
  ),
  ...forAllBrands(
    ['light'],
    'bg',
    'surfaceTransparentPressed',
    'JS references grey 950-20; CSS consumable resolves to grey 950-10',
  ),
  ...forAllBrands(
    ['light'],
    'bg',
    'warningStrong',
    'JS primitive yellow-700 differs from CSS primitive (#ae731a vs #9b6109)',
  ),
  ...forAllBrands(
    ['light'],
    'text',
    'warning',
    'JS primitive yellow-700 differs from CSS primitive (#ae731a vs #9b6109)',
  ),
  ...forAllBrands(
    ['light'],
    'border',
    'warning',
    'JS primitive yellow-700 differs from CSS primitive (#ae731a vs #9b6109)',
  ),
  ...forAllBrands(
    ['light'],
    'bg',
    'gradient100',
    'JS uses grey-950; CSS light consumable resolves gradient-100 to grey-050',
  ),
  ...forAllBrands(
    ['light'],
    'bg',
    'gradient80',
    'JS uses grey-950-80; CSS light consumable resolves gradient-80 to grey-050-80',
  ),
  ...forAllBrands(
    ['light'],
    'bg',
    'gradient70',
    'JS uses grey-950-70; CSS light consumable resolves gradient-70 to grey-050-70',
  ),
  ...forAllBrands(
    ['light'],
    'bg',
    'gradient0',
    'JS uses grey-950-0; CSS light consumable resolves gradient-0 to grey-050-0',
  ),
];

const CSS_PREFIX_TO_GROUP: Record<string, ThemeGroup> = {
  '--background-': 'bg',
  '--text-': 'text',
  '--border-': 'border',
  '--color-crypto-': 'crypto',
  '--color-discover-': 'discover',
};

const isKnownException = (
  brand: string,
  theme: 'light' | 'dark',
  group: ThemeGroup,
  key: string,
  kind: 'missing' | 'extra' | 'mismatch',
): boolean =>
  KNOWN_EXCEPTIONS.some(
    (exception) =>
      exception.brand === brand &&
      exception.theme === theme &&
      exception.group === group &&
      exception.key === key &&
      (kind === 'mismatch' || kind === 'extra'),
  );

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
        if (
          isKnownException(fixture.brand, fixture.theme, group, key, 'extra')
        ) {
          continue;
        }

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

      if (
        isKnownException(fixture.brand, fixture.theme, group, key, 'mismatch')
      ) {
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
          ? `JS theme drift detected — sync libs/design-core/src/lib/themes/js/:\n${issues.join('\n')}`
          : undefined,
      ).toEqual([]);
    },
  );
});

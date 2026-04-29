import fs from 'fs';
import path from 'path';
import postcss from 'postcss';
import { describe, it, expect } from 'vitest';

import { tokens as enterpriseDarkTokens } from './enterprise/theme.dark-css';
import { tokens as enterpriseLightTokens } from './enterprise/theme.light-css';
import { tokens as llDarkTokens } from './ledger-live/theme.dark-css';
import { tokens as llLightTokens } from './ledger-live/theme.light-css';
import { tokens as primitivesTokens } from './primitives-css';
import { tokens as typographyLgTokens } from './typographies/typography.lg-css';
import { tokens as typographyMdTokens } from './typographies/typography.md-css';
import { tokens as typographySmTokens } from './typographies/typography.sm-css';
import { tokens as typographyXlTokens } from './typographies/typography.xl-css';
import { tokens as typographyXsTokens } from './typographies/typography.xs-css';
import { tokens as websitesDarkTokens } from './websites/theme.dark-css';
import { tokens as websitesLightTokens } from './websites/theme.light-css';

// -- Helpers ------------------------------------------------------------------

function parseCssDeclarations(cssContent: string): Map<string, string> {
  const root = postcss.parse(cssContent);
  const declarations = new Map<string, string>();

  root.walkDecls((decl) => {
    declarations.set(decl.prop, decl.value);
  });

  return declarations;
}

function readCssFile(relativePath: string): string {
  return fs.readFileSync(path.resolve(__dirname, relativePath), 'utf-8');
}

// -- CSS files: valid syntax --------------------------------------------------

const cssFiles = [
  'primitives.css',
  'ledger-live/variables.light.css',
  'ledger-live/variables.dark.css',
  'enterprise/variables.light.css',
  'enterprise/variables.dark.css',
  'websites/variables.light.css',
  'websites/variables.dark.css',
  'typographies/typography.xs.css',
  'typographies/typography.sm.css',
  'typographies/typography.md.css',
  'typographies/typography.lg.css',
  'typographies/typography.xl.css',
] as const;

describe('CSS files parse without errors', () => {
  it.each(cssFiles)('%s', (file) => {
    const content = readCssFile(`./${file}`);
    expect(() => postcss.parse(content)).not.toThrow();

    const declarations = parseCssDeclarations(content);
    expect(declarations.size).toBeGreaterThan(0);
  });
});

// -- TS token files: structural integrity -------------------------------------

const tsTokenFiles = [
  { name: 'primitives-css', tokens: primitivesTokens },
  { name: 'ledger-live/theme.light-css', tokens: llLightTokens },
  { name: 'ledger-live/theme.dark-css', tokens: llDarkTokens },
  { name: 'enterprise/theme.light-css', tokens: enterpriseLightTokens },
  { name: 'enterprise/theme.dark-css', tokens: enterpriseDarkTokens },
  { name: 'websites/theme.light-css', tokens: websitesLightTokens },
  { name: 'websites/theme.dark-css', tokens: websitesDarkTokens },
  { name: 'typographies/typography.xs-css', tokens: typographyXsTokens },
  { name: 'typographies/typography.sm-css', tokens: typographySmTokens },
  { name: 'typographies/typography.md-css', tokens: typographyMdTokens },
  { name: 'typographies/typography.lg-css', tokens: typographyLgTokens },
  { name: 'typographies/typography.xl-css', tokens: typographyXlTokens },
] as const;

describe.each(tsTokenFiles)('$name — TS token integrity', ({ tokens }) => {
  const topKey = Object.keys(tokens)[0];
  const tokenMap = (tokens as Record<string, Record<string, string | number>>)[
    topKey
  ];

  it('has exactly one top-level selector key', () => {
    expect(Object.keys(tokens)).toHaveLength(1);
  });

  it('token map is not empty', () => {
    expect(Object.keys(tokenMap).length).toBeGreaterThan(0);
  });

  it('all keys are valid CSS custom properties', () => {
    for (const key of Object.keys(tokenMap)) {
      expect(key, `"${key}" is not a valid CSS custom property`).toMatch(
        /^--[a-z0-9-]+$/,
      );
    }
  });

  it('no value is empty, undefined, or null', () => {
    for (const [key, value] of Object.entries(tokenMap)) {
      expect(value, `${key} is undefined/null`).toBeDefined();
      expect(String(value), `${key} is empty`).not.toBe('');
    }
  });
});

// -- Sanity checks on well-known primitive values -----------------------------

describe('primitives — core value sanity checks', () => {
  const root = primitivesTokens[':root'];

  it('light white is #ffffff', () => {
    expect(root['--color-light-constant-050']).toBe('#ffffff');
  });

  it('dark black is #000000', () => {
    expect(root['--color-dark-constant-950']).toBe('#000000');
  });

  it('spacing-0 is 0px', () => {
    expect(root['--spacing-0']).toBe('0px');
  });

  it('spacing-16 is 16px', () => {
    expect(root['--spacing-16']).toBe('16px');
  });

  it('border-radius-full is 10000px', () => {
    expect(root['--border-radius-full']).toBe('10000px');
  });

  it('font-family is Inter', () => {
    expect(root['--font-family-font']).toBe('Inter');
  });

  it('font-weight-bold is 700', () => {
    expect(root['--font-weight-bold']).toBe('700');
  });
});

// -- Sanity checks on well-known semantic theme values ------------------------

describe('ledger-live light theme — core value sanity checks', () => {
  const root = llLightTokens[':root'];

  it('canvas background references a light primitive', () => {
    expect(root['--color-background-canvas']).toMatch(
      /^var\(--color-light-.+\)$/,
    );
  });

  it('color-text-base references a light primitive', () => {
    expect(root['--color-text-base']).toMatch(/^var\(--color-light-.+\)$/);
  });

  it('text-base aliases to color-text-base', () => {
    expect(root['--text-base']).toBe('var(--color-text-base)');
  });
});

describe('ledger-live dark theme — core value sanity checks', () => {
  const dark = llDarkTokens['.dark'];

  it('canvas background references a dark primitive', () => {
    expect(dark['--color-background-canvas']).toMatch(
      /^var\(--color-dark-.+\)$/,
    );
  });

  it('color-text-base references a dark primitive', () => {
    expect(dark['--color-text-base']).toMatch(/^var\(--color-dark-.+\)$/);
  });

  it('text-base aliases to color-text-base', () => {
    expect(dark['--text-base']).toBe('var(--color-text-base)');
  });
});

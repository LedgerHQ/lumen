import type plugin from 'tailwindcss/plugin.js';
import { describe, expect, it, vi } from 'vitest';
import {
  createGradientPlugin,
  createScrollbarPlugin,
  createShadowPlugin,
  createThemePlugin,
  createTypographyPlugin,
} from './createCustomPlugin.js';

type TailwindPlugin = ReturnType<typeof plugin>;
type PluginAPI = Parameters<TailwindPlugin['handler']>[0];

const runHandler = (
  { handler }: TailwindPlugin,
  themeValues: Record<string, unknown> = {},
) => {
  const api = {
    addBase: vi.fn(),
    addUtilities: vi.fn(),
    matchUtilities: vi.fn(),
    theme: (key: string) => themeValues[key],
  };
  handler(api as unknown as PluginAPI);
  return api;
};

const registeredUtilities = (
  addUtilities: ReturnType<typeof vi.fn>,
): Record<string, unknown> =>
  Object.assign({}, ...addUtilities.mock.calls.map(([utilities]) => utilities));

const brandTheme = {
  ':root': {
    '--background-base': 'var(--color-light-grey-050)',
    '--text-base': 'var(--color-light-grey-950)',
    '--border-muted': 'var(--color-light-grey-200)',
    '--border-width-thin': '1px',
    '--color-crypto-bitcoin': 'var(--color-light-crypto-bitcoin)',
    '--color-crypto-bitcoin-0': 'var(--color-light-crypto-bitcoin-0)',
    '--color-discover-blue': 'var(--color-light-discover-blue)',
  },
  '.dark': {
    '--color-crypto-ethereum': 'var(--color-dark-crypto-ethereum)',
    '--color-crypto-ethereum-0': 'var(--color-dark-crypto-ethereum-0)',
    '--color-crypto-bitcoin': 'var(--color-dark-crypto-bitcoin)',
  },
};

const defaultColors = {
  transparent: 'transparent',
  inherit: 'inherit',
  current: 'currentColor',
};

describe('createThemePlugin', () => {
  const themePlugin = createThemePlugin(brandTheme);
  const theme = themePlugin.config?.theme ?? {};

  it('should register the brand tokens as base styles', () => {
    const { addBase } = runHandler(themePlugin);

    expect(addBase).toHaveBeenCalledTimes(1);
    expect(addBase).toHaveBeenCalledWith(brandTheme);
  });

  it('should expose the background, crypto and discover tokens as background colors', () => {
    expect(theme.backgroundColor).toEqual({
      base: 'var(--background-base)',
      ...defaultColors,
      'crypto-bitcoin': 'var(--color-crypto-bitcoin)',
      'crypto-bitcoin-0': 'var(--color-crypto-bitcoin-0)',
      'crypto-ethereum': 'var(--color-crypto-ethereum)',
      'crypto-ethereum-0': 'var(--color-crypto-ethereum-0)',
      'discover-blue': 'var(--color-discover-blue)',
    });
  });

  it('should expose the text tokens as text colors', () => {
    expect(theme.textColor).toEqual({
      base: 'var(--text-base)',
      ...defaultColors,
    });
  });

  it('should expose the border tokens as border colors without the border widths', () => {
    expect(theme.borderColor).toEqual({
      muted: 'var(--border-muted)',
      ...defaultColors,
    });
  });

  it.each([
    'gradientColorStops',
    'accentColor',
    'selectionColor',
    'boxShadowColor',
    'fill',
  ])('should reuse the background colors for %s', (key) => {
    expect(theme[key]).toEqual(theme.backgroundColor);
  });

  it.each(['caretColor', 'placeholderColor'])(
    'should reuse the text colors for %s',
    (key) => {
      expect(theme[key]).toEqual(theme.textColor);
    },
  );

  it.each([
    'stroke',
    'ringColor',
    'outlineColor',
    'ringOffsetColor',
    'textDecorationColor',
  ])('should reuse the border colors for %s', (key) => {
    expect(theme[key]).toEqual(theme.borderColor);
  });
});

describe('createTypographyPlugin', () => {
  const utilities = registeredUtilities(
    runHandler(createTypographyPlugin()).addUtilities,
  );

  it.each([
    ...[1, 2, 3, 4].map((level) => `responsive-display-${level}`),
    ...[0, 1, 2, 3, 4, 5].flatMap((level) => [
      `heading-${level}`,
      `heading-${level}-semi-bold`,
    ]),
    ...[1, 2, 3, 4].flatMap((level) => [
      `body-${level}`,
      `body-${level}-semi-bold`,
    ]),
  ])('should register the .%s utility', (name) => {
    expect(utilities[`.${name}`]).toMatchObject({
      'font-family': 'var(--font-family-font)',
      '-webkit-font-smoothing': 'antialiased',
      '-moz-osx-font-smoothing': 'grayscale',
    });
  });

  it('should use the medium weight by default and the semi-bold weight for the semi-bold variant', () => {
    expect(utilities['.body-2']).toMatchObject({
      'font-size': 'var(--font-style-body-2-size)',
      'font-weight': 'var(--font-style-body-2-weight-medium)',
    });
    expect(utilities['.body-2-semi-bold']).toMatchObject({
      'font-size': 'var(--font-style-body-2-size)',
      'font-weight': 'var(--font-style-body-2-weight-semi-bold)',
    });
  });
});

describe('createGradientPlugin', () => {
  const baseGradients = [
    '.bg-gradient-top',
    '.bg-gradient-bottom',
    '.bg-gradient-error',
    '.bg-gradient-success',
    '.bg-gradient-muted',
  ];

  it('should register only the base gradients without a brand theme', () => {
    const { addUtilities } = runHandler(createGradientPlugin());

    expect(addUtilities).toHaveBeenCalledTimes(1);
    expect(Object.keys(registeredUtilities(addUtilities))).toEqual(
      baseGradients,
    );
  });

  it('should add one gradient per crypto color of the brand theme', () => {
    const utilities = registeredUtilities(
      runHandler(createGradientPlugin(brandTheme)).addUtilities,
    );

    expect(Object.keys(utilities)).toEqual([
      ...baseGradients,
      '.bg-gradient-bitcoin',
      '.bg-gradient-ethereum',
    ]);
    expect(utilities['.bg-gradient-bitcoin']).toEqual({
      'background-image':
        'linear-gradient(161deg, var(--color-crypto-bitcoin) 0%, var(--color-crypto-bitcoin-0) 100%)',
    });
  });
});

describe('createShadowPlugin', () => {
  const boxShadowColor = { muted: 'var(--background-muted)' };

  it.each(['sm', 'md', 'lg', 'xl', '2xl'])(
    'should register the .shadow-%s utility with an overridable color',
    (size) => {
      const utilities = registeredUtilities(
        runHandler(createShadowPlugin(), { boxShadowColor }).addUtilities,
      );

      expect(utilities[`.shadow-${size}`]).toMatchObject({
        '--tw-shadow': expect.stringContaining('var(--tw-shadow-color, '),
        'box-shadow': 'var(--tw-shadow)',
      });
    },
  );

  it('should register shadow color utilities from the boxShadowColor theme', () => {
    const { matchUtilities } = runHandler(createShadowPlugin(), {
      boxShadowColor,
    });

    expect(matchUtilities).toHaveBeenCalledTimes(1);
    const [utilities, options] = matchUtilities.mock.calls[0];
    expect(options).toEqual({ values: boxShadowColor });
    expect(utilities.shadow('var(--background-muted)')).toEqual({
      '--tw-shadow-color': 'var(--background-muted)',
    });
  });
});

describe('createScrollbarPlugin', () => {
  const utilities = registeredUtilities(
    runHandler(createScrollbarPlugin()).addUtilities,
  );

  it.each([
    ['.scrollbar-gutter-auto', 'auto'],
    ['.scrollbar-gutter-stable', 'stable'],
    ['.scrollbar-gutter-stable-both-edges', 'stable both-edges'],
  ])('should register the %s utility', (name, value) => {
    expect(utilities[name]).toEqual({ 'scrollbar-gutter': value });
  });

  it('should hide the scrollbar in every engine with .scrollbar-none', () => {
    expect(utilities['.scrollbar-none']).toEqual({
      'scrollbar-width': 'none',
      '&::-webkit-scrollbar': { display: 'none' },
    });
  });

  it('should style the scrollbar in every engine with .scrollbar-custom', () => {
    expect(utilities['.scrollbar-custom']).toMatchObject({
      'scrollbar-width': 'thin',
      'scrollbar-color': 'var(--background-muted-strong) transparent',
      '&::-webkit-scrollbar-thumb': expect.objectContaining({
        'background-color': 'var(--background-muted-strong)',
      }),
    });
  });
});

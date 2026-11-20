import plugin from 'tailwindcss/plugin.js';
import {
  shadowUtilities,
  typographyUtilities,
} from '../../generated/tailwind/index.js';
import { getThemeUtilsByPrefix } from './getThemeUtilsByPrefix.js';

type TailwindPlugin = ReturnType<typeof plugin>;

const DEFAULT_COLOR_VALUES = {
  transparent: 'transparent',
  inherit: 'inherit',
  current: 'currentColor',
} as const;

function extendWithDefaultColors<T extends Record<string, string>>(colors: T) {
  return {
    ...colors,
    ...DEFAULT_COLOR_VALUES,
  };
}

export function createThemePlugin(
  brandTheme: Record<string, Record<string, string>>,
): TailwindPlugin {
  const cryptoColor = getThemeUtilsByPrefix(brandTheme, '--color-crypto-', {
    customPrefix: 'crypto-',
  });
  const discoveryColor = getThemeUtilsByPrefix(
    brandTheme,
    '--color-discover-',
    {
      customPrefix: 'discover-',
    },
  );
  const backgroundColor = getThemeUtilsByPrefix(brandTheme, '--background-');
  const textColor = getThemeUtilsByPrefix(brandTheme, '--text-');
  const borderColor = getThemeUtilsByPrefix(brandTheme, '--border-', {
    exclude: ['--border-width'],
  });

  const extendedBackgroundColor = {
    ...extendWithDefaultColors(backgroundColor),
    ...cryptoColor,
    ...discoveryColor,
  };

  return plugin(
    function ({ addBase }) {
      addBase(brandTheme);
    },
    {
      theme: {
        textColor: extendWithDefaultColors(textColor),
        borderColor: extendWithDefaultColors(borderColor),
        backgroundColor: extendedBackgroundColor,
        gradientColorStops: extendedBackgroundColor,
        accentColor: extendedBackgroundColor,
        selectionColor: extendedBackgroundColor,
        boxShadowColor: extendedBackgroundColor,
        fill: extendedBackgroundColor,
        stroke: extendWithDefaultColors(borderColor),
        caretColor: extendWithDefaultColors(textColor),
        placeholderColor: extendWithDefaultColors(textColor),
        ringColor: extendWithDefaultColors(borderColor),
        outlineColor: extendWithDefaultColors(borderColor),
        ringOffsetColor: extendWithDefaultColors(borderColor),
        textDecorationColor: extendWithDefaultColors(borderColor),
      },
    },
  );
}

export function createTypographyPlugin(): TailwindPlugin {
  return plugin(function ({ addUtilities }) {
    addUtilities(typographyUtilities);
  });
}

function cryptoGradientStyles(crypto: string) {
  return {
    [`.bg-gradient-${crypto}`]: {
      'background-image': `linear-gradient(161deg, var(--color-crypto-${crypto}) 0%, var(--color-crypto-${crypto}-0) 100%)`,
    },
  };
}

function extractCryptoNames(
  brandTheme: Record<string, Record<string, string>>,
): string[] {
  const cryptoNames = new Set<string>();

  for (const themeKey in brandTheme) {
    if (
      typeof brandTheme[themeKey] === 'object' &&
      brandTheme[themeKey] !== null
    ) {
      for (const key in brandTheme[themeKey]) {
        if (key.startsWith('--color-crypto-') && !key.endsWith('-0')) {
          const cryptoName = key.substring('--color-crypto-'.length);
          cryptoNames.add(cryptoName);
        }
      }
    }
  }

  return Array.from(cryptoNames).sort();
}

export function createGradientPlugin(
  brandTheme?: Record<string, Record<string, string>>,
): TailwindPlugin {
  return plugin(function ({ addUtilities }) {
    const gradientStyles = {
      '.bg-gradient-top': {
        'background-image':
          'linear-gradient(180deg, var(--background-gradient-80) 0%, var(--background-gradient-70) 60%, var(--background-gradient-0) 100%)',
      },
      '.bg-gradient-bottom': {
        'background-image':
          'linear-gradient(180deg, var(--background-gradient-0) 0%, var(--background-gradient-70) 40%, var(--background-gradient-80) 100%)',
      },
      '.bg-gradient-error': {
        background:
          'radial-gradient(43.56% 33.06% at 50.47% 0.14%, var(--background-error-strong) 0%, var(--background-error-transparent-0) 100%)',
        opacity: '0.3',
      },
      '.bg-gradient-success': {
        background:
          'radial-gradient(43.56% 33.06% at 50.47% 0.14%, var(--background-success-strong) 0%, var(--background-success-transparent-0) 100%)',
        opacity: '0.3',
      },
      '.bg-gradient-muted': {
        background:
          'radial-gradient(43.56% 33.06% at 50.47% 0.14%, var(--background-muted-strong) 0%, var(--background-muted-transparent-0) 100%)',
        opacity: '0.3',
      },
    };

    if (brandTheme) {
      const cryptoNames = extractCryptoNames(brandTheme);
      cryptoNames.forEach((cryptoName) => {
        Object.assign(gradientStyles, cryptoGradientStyles(cryptoName));
      });
    }

    addUtilities(gradientStyles);
  });
}

export function createShadowPlugin(): TailwindPlugin {
  return plugin(function ({ theme, addUtilities, matchUtilities }) {
    addUtilities(shadowUtilities);
    matchUtilities(
      { shadow: (value) => ({ '--tw-shadow-color': value }) },
      { values: theme('boxShadowColor') },
    );
  });
}

export function createScrollbarPlugin(): TailwindPlugin {
  return plugin(function ({ addUtilities }) {
    addUtilities({
      '.scrollbar-gutter-auto': {
        'scrollbar-gutter': 'auto',
      },
      '.scrollbar-gutter-stable': {
        'scrollbar-gutter': 'stable',
      },
      '.scrollbar-gutter-stable-both-edges': {
        'scrollbar-gutter': 'stable both-edges',
      },
      '.scrollbar-none': {
        'scrollbar-width': 'none',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      },
      '.scrollbar-custom': {
        'scrollbar-width': 'thin',
        'scrollbar-color': 'var(--background-muted-strong) transparent',
        '&::-webkit-scrollbar': {
          width: 'var(--size-10)',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          'background-color': 'var(--background-muted-strong)',
          'border-radius': 'var(--border-radius-full)',
          border: 'var(--size-2) solid transparent',
          'background-clip': 'padding-box',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          'background-color': 'var(--background-muted-strong-hover)',
          border: 'var(--size-2) solid transparent',
        },
        '&::-webkit-scrollbar-thumb:active': {
          'background-color': 'var(--background-muted-strong-hover)',
          border: 'var(--size-2) solid transparent',
        },
      },
    });
  });
}

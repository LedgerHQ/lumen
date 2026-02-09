import plugin from 'tailwindcss/plugin.js';
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
    const fontSmoothing = {
      '-webkit-font-smoothing': 'antialiased',
      '-moz-osx-font-smoothing': 'grayscale',
    };

    const displayStyles = {
      '.responsive-display-1': {
        'font-family': 'var(--font-family-font)',
        'font-size': 'var(--font-style-responsive-display-1-size)',
        'font-weight': 'var(--font-style-responsive-display-1-weight)',
        'line-height': 'var(--font-style-responsive-display-1-line-height)',
        'letter-spacing':
          'var(--font-style-responsive-display-1-letter-spacing)',
        ...fontSmoothing,
      },
      '.responsive-display-2': {
        'font-family': 'var(--font-family-font)',
        'font-size': 'var(--font-style-responsive-display-2-size)',
        'font-weight': 'var(--font-style-responsive-display-2-weight)',
        'line-height': 'var(--font-style-responsive-display-2-line-height)',
        'letter-spacing':
          'var(--font-style-responsive-display-2-letter-spacing)',
        ...fontSmoothing,
      },
      '.responsive-display-3': {
        'font-family': 'var(--font-family-font)',
        'font-size': 'var(--font-style-responsive-display-3-size)',
        'font-weight': 'var(--font-style-responsive-display-3-weight)',
        'line-height': 'var(--font-style-responsive-display-3-line-height)',
        'letter-spacing':
          'var(--font-style-responsive-display-3-letter-spacing)',
        ...fontSmoothing,
      },
      '.responsive-display-4': {
        'font-family': 'var(--font-family-font)',
        'font-size': 'var(--font-style-responsive-display-4-size)',
        'font-weight': 'var(--font-style-responsive-display-4-weight)',
        'line-height': 'var(--font-style-responsive-display-4-line-height)',
        'letter-spacing':
          'var(--font-style-responsive-display-4-letter-spacing)',
        ...fontSmoothing,
      },
    };

    const headingStyles = {
      '.heading-0': {
        'font-family': 'var(--font-family-font)',
        'font-size': 'var(--font-style-heading-0-size)',
        'font-weight': 'var(--font-style-heading-0-weight-medium)',
        'line-height': 'var(--font-style-heading-0-line-height)',
        'letter-spacing': 'var(--font-style-heading-0-letter-spacing)',
        ...fontSmoothing,
      },
      '.heading-0-semi-bold': {
        'font-family': 'var(--font-family-font)',
        'font-size': 'var(--font-style-heading-0-size)',
        'font-weight': 'var(--font-style-heading-0-weight-semi-bold)',
        'line-height': 'var(--font-style-heading-0-line-height)',
        'letter-spacing': 'var(--font-style-heading-0-letter-spacing)',
        ...fontSmoothing,
      },
      '.heading-1': {
        'font-family': 'var(--font-family-font)',
        'font-size': 'var(--font-style-heading-1-size)',
        'font-weight': 'var(--font-style-heading-1-weight-medium)',
        'line-height': 'var(--font-style-heading-1-line-height)',
        'letter-spacing': 'var(--font-style-heading-1-letter-spacing)',
        ...fontSmoothing,
      },
      '.heading-1-semi-bold': {
        'font-family': 'var(--font-family-font)',
        'font-size': 'var(--font-style-heading-1-size)',
        'font-weight': 'var(--font-style-heading-1-weight-semi-bold)',
        'line-height': 'var(--font-style-heading-1-line-height)',
        'letter-spacing': 'var(--font-style-heading-1-letter-spacing)',
        ...fontSmoothing,
      },
      '.heading-2': {
        'font-family': 'var(--font-family-font)',
        'font-size': 'var(--font-style-heading-2-size)',
        'font-weight': 'var(--font-style-heading-2-weight-medium)',
        'line-height': 'var(--font-style-heading-2-line-height)',
        'letter-spacing': 'var(--font-style-heading-2-letter-spacing)',
        ...fontSmoothing,
      },
      '.heading-2-semi-bold': {
        'font-family': 'var(--font-family-font)',
        'font-size': 'var(--font-style-heading-2-size)',
        'font-weight': 'var(--font-style-heading-2-weight-semi-bold)',
        'line-height': 'var(--font-style-heading-2-line-height)',
        'letter-spacing': 'var(--font-style-heading-2-letter-spacing)',
        ...fontSmoothing,
      },
      '.heading-3': {
        'font-family': 'var(--font-family-font)',
        'font-size': 'var(--font-style-heading-3-size)',
        'font-weight': 'var(--font-style-heading-3-weight-medium)',
        'line-height': 'var(--font-style-heading-3-line-height)',
        'letter-spacing': 'var(--font-style-heading-3-letter-spacing)',
        ...fontSmoothing,
      },
      '.heading-3-semi-bold': {
        'font-family': 'var(--font-family-font)',
        'font-size': 'var(--font-style-heading-3-size)',
        'font-weight': 'var(--font-style-heading-3-weight-semi-bold)',
        'line-height': 'var(--font-style-heading-3-line-height)',
        'letter-spacing': 'var(--font-style-heading-3-letter-spacing)',
        ...fontSmoothing,
      },
      '.heading-4': {
        'font-family': 'var(--font-family-font)',
        'font-size': 'var(--font-style-heading-4-size)',
        'font-weight': 'var(--font-style-heading-4-weight-medium)',
        'line-height': 'var(--font-style-heading-4-line-height)',
        'letter-spacing': 'var(--font-style-heading-4-letter-spacing)',
        ...fontSmoothing,
      },
      '.heading-4-semi-bold': {
        'font-family': 'var(--font-family-font)',
        'font-size': 'var(--font-style-heading-4-size)',
        'font-weight': 'var(--font-style-heading-4-weight-semi-bold)',
        'line-height': 'var(--font-style-heading-4-line-height)',
        'letter-spacing': 'var(--font-style-heading-4-letter-spacing)',
        ...fontSmoothing,
      },
      '.heading-5': {
        'font-family': 'var(--font-family-font)',
        'font-size': 'var(--font-style-heading-5-size)',
        'font-weight': 'var(--font-style-heading-5-weight-medium)',
        'line-height': 'var(--font-style-heading-5-line-height)',
        'letter-spacing': 'var(--font-style-heading-5-letter-spacing)',
        ...fontSmoothing,
      },
      '.heading-5-semi-bold': {
        'font-family': 'var(--font-family-font)',
        'font-size': 'var(--font-style-heading-5-size)',
        'font-weight': 'var(--font-style-heading-5-weight-semi-bold)',
        'line-height': 'var(--font-style-heading-5-line-height)',
        'letter-spacing': 'var(--font-style-heading-5-letter-spacing)',
        ...fontSmoothing,
      },
    };

    const bodyStyles = {
      '.body-1': {
        'font-family': 'var(--font-family-font)',
        'font-size': 'var(--font-style-body-1-size)',
        'font-weight': 'var(--font-style-body-1-weight-medium)',
        'line-height': 'var(--font-style-body-1-line-height)',
        'letter-spacing': 'var(--font-style-body-1-letter-spacing)',
        ...fontSmoothing,
      },
      '.body-1-semi-bold': {
        'font-family': 'var(--font-family-font)',
        'font-size': 'var(--font-style-body-1-size)',
        'font-weight': 'var(--font-style-body-1-weight-semi-bold)',
        'line-height': 'var(--font-style-body-1-line-height)',
        'letter-spacing': 'var(--font-style-body-1-letter-spacing)',
        ...fontSmoothing,
      },
      '.body-2': {
        'font-family': 'var(--font-family-font)',
        'font-size': 'var(--font-style-body-2-size)',
        'font-weight': 'var(--font-style-body-2-weight-medium)',
        'line-height': 'var(--font-style-body-2-line-height)',
        'letter-spacing': 'var(--font-style-body-2-letter-spacing)',
        ...fontSmoothing,
      },
      '.body-2-semi-bold': {
        'font-family': 'var(--font-family-font)',
        'font-size': 'var(--font-style-body-2-size)',
        'font-weight': 'var(--font-style-body-2-weight-semi-bold)',
        'line-height': 'var(--font-style-body-2-line-height)',
        'letter-spacing': 'var(--font-style-body-2-letter-spacing)',
        ...fontSmoothing,
      },
      '.body-3': {
        'font-family': 'var(--font-family-font)',
        'font-size': 'var(--font-style-body-3-size)',
        'font-weight': 'var(--font-style-body-3-weight-medium)',
        'line-height': 'var(--font-style-body-3-line-height)',
        'letter-spacing': 'var(--font-style-body-3-letter-spacing)',
        ...fontSmoothing,
      },
      '.body-3-semi-bold': {
        'font-family': 'var(--font-family-font)',
        'font-size': 'var(--font-style-body-3-size)',
        'font-weight': 'var(--font-style-body-3-weight-semi-bold)',
        'line-height': 'var(--font-style-body-3-line-height)',
        'letter-spacing': 'var(--font-style-body-3-letter-spacing)',
        ...fontSmoothing,
      },
      '.body-4': {
        'font-family': 'var(--font-family-font)',
        'font-size': 'var(--font-style-body-4-size)',
        'font-weight': 'var(--font-style-body-4-weight-medium)',
        'line-height': 'var(--font-style-body-4-line-height)',
        'letter-spacing': 'var(--font-style-body-4-letter-spacing)',
        ...fontSmoothing,
      },
      '.body-4-semi-bold': {
        'font-family': 'var(--font-family-font)',
        'font-size': 'var(--font-style-body-4-size)',
        'font-weight': 'var(--font-style-body-4-weight-semi-bold)',
        'line-height': 'var(--font-style-body-4-line-height)',
        'letter-spacing': 'var(--font-style-body-4-letter-spacing)',
        ...fontSmoothing,
      },
    };

    addUtilities(displayStyles);
    addUtilities(headingStyles);
    addUtilities(bodyStyles);
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
          'radial-gradient(43.56% 33.06% at 50.47% 0.14%, var(--background-error-strong) 0%, var(--background-error-transparent) 100%)',
        opacity: '0.3',
      },
      '.bg-gradient-success': {
        background:
          'radial-gradient(43.56% 33.06% at 50.47% 0.14%, var(--background-success-strong) 0%, var(--background-success-transparent) 100%)',
        opacity: '0.3',
      },
      '.bg-gradient-muted': {
        background:
          'radial-gradient(43.56% 33.06% at 50.47% 0.14%, var(--background-muted-strong) 0%, var(--background-muted-transparent) 100%)',
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
    const defaultColor = 'rgba(0, 0, 0, 0.10)';
    const strongDefaultColor = 'rgba(0, 0, 0, 0.25)';

    const shadows = {
      '.shadow-sm': {
        '--tw-shadow': `0 1px 2px -1px var(--tw-shadow-color, ${defaultColor}), 0 1px 3px 0 var(--tw-shadow-color, ${defaultColor})`,
        'box-shadow': 'var(--tw-shadow)',
      },
      '.shadow-md': {
        '--tw-shadow': `0 2px 4px -2px var(--tw-shadow-color, ${defaultColor}), 0 4px 6px -1px var(--tw-shadow-color, ${defaultColor})`,
        'box-shadow': 'var(--tw-shadow)',
      },
      '.shadow-lg': {
        '--tw-shadow': `0 4px 6px -4px var(--tw-shadow-color, ${defaultColor}), 0 10px 15px -3px var(--tw-shadow-color, ${defaultColor})`,
        'box-shadow': 'var(--tw-shadow)',
      },
      '.shadow-xl': {
        '--tw-shadow': `0 8px 10px -6px var(--tw-shadow-color, ${defaultColor}), 0 20px 25px -5px var(--tw-shadow-color, ${defaultColor})`,
        'box-shadow': 'var(--tw-shadow)',
      },
      '.shadow-2xl': {
        '--tw-shadow': `0 25px 50px -12px var(--tw-shadow-color, ${strongDefaultColor})`,
        'box-shadow': 'var(--tw-shadow)',
      },
    };

    addUtilities(shadows);
    matchUtilities(
      { shadow: (value) => ({ '--tw-shadow-color': value }) },
      { values: theme('boxShadowColor') },
    );
  });
}

export function createScrollbarPlugin(): TailwindPlugin {
  return plugin(function ({ addUtilities }) {
    addUtilities({
      '.scrollbar-none': {
        'scrollbar-width': 'none',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      },
    });
  });
}

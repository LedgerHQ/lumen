import { useLayoutEffect } from 'react';
import { COLOR_SCHEMES, ColorSchemeName } from './ThemeProvider.types';

export const LIGHT_MODE = 'light';
export const DARK_MODE = 'dark';
export const SYSTEM_MODE = 'system';

/**
 * Updates the root element className when the theme mode changes.
 * This allows the design-system theme config to be applied
 */
export const useRootColorModeSideEffect = ({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) => {
  useLayoutEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(LIGHT_MODE, DARK_MODE);

    if (colorScheme === COLOR_SCHEMES.system) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const applySystemTheme = () => {
        root.classList.remove(LIGHT_MODE, DARK_MODE);
        root.classList.add(mediaQuery.matches ? DARK_MODE : LIGHT_MODE);
      };

      applySystemTheme();
      mediaQuery.addEventListener('change', applySystemTheme);

      return () => {
        mediaQuery.removeEventListener('change', applySystemTheme);
      };
    }

    root.classList.add(colorScheme);
    return () => {
      // return empty
    };
  }, [colorScheme]);
};

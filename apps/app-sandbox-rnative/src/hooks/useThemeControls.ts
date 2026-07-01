import type { SupportedLocale } from '@ledgerhq/lumen-ui-rnative';
import { createContext, useContext } from 'react';
import type { ColorSchemeName } from 'react-native';

type ThemeControls = {
  colorScheme: ColorSchemeName;
  setColorScheme: (colorScheme: ColorSchemeName) => void;
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
};

const ThemeControlsContext = createContext<ThemeControls | null>(null);

export const ThemeControlsProvider = ThemeControlsContext.Provider;

export const useThemeControls = () => {
  const context = useContext(ThemeControlsContext);

  if (!context) {
    throw new Error(
      'useThemeControls must be used within a ThemeControlsProvider',
    );
  }

  return context;
};

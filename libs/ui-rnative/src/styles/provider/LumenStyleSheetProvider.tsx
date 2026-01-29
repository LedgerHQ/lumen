import { createSafeContext } from '@ledgerhq/lumen-utils-shared';
import { useMemo } from 'react';
import {
  ColorSchemeName,
  useColorScheme as useReactNativeColorScheme,
} from 'react-native';
import { createStylesheetTheme } from '../theme/createStylesheetTheme';
import { type LumenStyleSheetTheme } from '../types';
import { COLOR_SCHEMES, type LumenStyleSheetProviderProps } from './types';

const DEFAULT_COLOR_SCHEME = COLOR_SCHEMES.dark;

export type LumenStyleSheetContextValue = {
  theme: LumenStyleSheetTheme;
  colorScheme: ColorSchemeName;
};

const [LumenStyleSheetContextProvider, _useLumenStyleSheetContext] =
  createSafeContext<LumenStyleSheetContextValue>('LumenStyleSheetProvider');

export const useLumenStyleSheetContext = _useLumenStyleSheetContext;

export const LumenStyleSheetProvider = ({
  themes,
  colorScheme,
  children,
}: LumenStyleSheetProviderProps) => {
  const nativeColorScheme = useReactNativeColorScheme();
  const currentColorScheme =
    colorScheme ?? nativeColorScheme ?? DEFAULT_COLOR_SCHEME;

  const contextValue = useMemo(() => {
    const currentTheme =
      themes[currentColorScheme as keyof typeof COLOR_SCHEMES];
    return {
      theme: createStylesheetTheme(currentTheme),
      colorScheme: currentColorScheme,
    };
  }, [themes, currentColorScheme]);

  return (
    <LumenStyleSheetContextProvider value={contextValue}>
      {children}
    </LumenStyleSheetContextProvider>
  );
};

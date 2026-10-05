import type {
  LedgerLiveDarkTheme,
  LedgerLiveLightTheme,
} from '@ledgerhq/lumen-design-core';
import { createSafeContext } from '@ledgerhq/lumen-utils-shared';
import type { FC } from 'react';
import { useMemo } from 'react';
import { TranslationsProvider } from '../../../../translations';
import type { ThemeProviderProps } from './ThemeProvider.types';
import { COLOR_SCHEMES } from './ThemeProvider.types';
import {
  useResolvedColorScheme,
  useRootColorModeSideEffect,
} from './useRootColorModeSideEffect';

type ThemeProviderState = {
  theme: LedgerLiveDarkTheme | LedgerLiveLightTheme;
  colorScheme: 'light' | 'dark';
};

const [ThemeProviderContext, useThemeContext] =
  createSafeContext<ThemeProviderState>('ThemeProvider');

export const ThemeProvider: FC<ThemeProviderProps> = ({
  children,
  colorScheme = COLOR_SCHEMES.system,
  locale,
}) => {
  const resolvedColorScheme = useResolvedColorScheme(colorScheme);
  useRootColorModeSideEffect(resolvedColorScheme);

  const value = useMemo(
    () => ({
      colorScheme: resolvedColorScheme,
    }),
    [resolvedColorScheme],
  );

  return (
    <ThemeProviderContext value={value as ThemeProviderState}>
      <TranslationsProvider locale={locale}>{children}</TranslationsProvider>
    </ThemeProviderContext>
  );
};

export const useTheme = () => {
  const theme = useThemeContext({
    consumerName: 'useTheme',
    contextRequired: true,
  });

  return theme;
};

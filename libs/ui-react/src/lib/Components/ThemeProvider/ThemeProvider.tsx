import type {
  LedgerLiveDarkTheme,
  LedgerLiveLightTheme,
} from '@ledgerhq/lumen-design-core';
import { createSafeContext } from '@ledgerhq/lumen-utils-shared';
import type { FC } from 'react';
import { useMemo } from 'react';
import { I18nProvider } from '../../../i18n';
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
  themes,
  children,
  colorScheme = COLOR_SCHEMES.system,
  locale,
}) => {
  const resolvedColorScheme = useResolvedColorScheme(colorScheme);
  useRootColorModeSideEffect(resolvedColorScheme);

  const resolvedTheme = themes?.[resolvedColorScheme];

  const value = useMemo(
    () => ({
      theme: resolvedTheme,
      colorScheme: resolvedColorScheme,
    }),
    [resolvedTheme, resolvedColorScheme],
  );

  return (
    <ThemeProviderContext value={value as ThemeProviderState}>
      <I18nProvider locale={locale}>{children}</I18nProvider>
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

import { createSafeContext } from '@ledgerhq/lumen-utils-shared';
import { FC, useMemo } from 'react';
import { I18nProvider } from '../../../i18n';
import { COLOR_SCHEMES, ThemeProviderProps } from './ThemeProvider.types';
import { useRootColorModeSideEffect } from './useRootColorModeSideEffect';

type ThemeProviderState = {
  locale: ThemeProviderProps['locale'];
};

const [ThemeProviderContext] =
  createSafeContext<ThemeProviderState>('ThemeProvider');

export const ThemeProvider: FC<ThemeProviderProps> = ({
  children,
  colorScheme = COLOR_SCHEMES.system,
  locale,
}) => {
  useRootColorModeSideEffect({ colorScheme });

  const value = useMemo(
    () => ({
      colorScheme,
      locale,
    }),
    [colorScheme, locale],
  );

  return (
    <ThemeProviderContext value={value}>
      <I18nProvider locale={locale}>{children}</I18nProvider>
    </ThemeProviderContext>
  );
};

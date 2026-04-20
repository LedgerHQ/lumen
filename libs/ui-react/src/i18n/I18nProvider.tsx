import type { FC, PropsWithChildren } from 'react';
import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { i18n, switchLanguage } from './i18n';
import { DEFAULT_LANGUAGE, type SupportedLocale } from './languages';

type I18nProviderProps = PropsWithChildren & {
  locale?: SupportedLocale;
};

export const I18nProvider: FC<I18nProviderProps> = ({
  locale = DEFAULT_LANGUAGE,
  children,
}) => {
  useEffect(() => {
    switchLanguage(locale);
  }, [locale]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

import type { FC, ReactNode } from 'react';
import { createContext, useContext, useMemo } from 'react';
import { getObjectPath } from '../getObjectPath';
import { interpolate } from './interpolate';
import { resolveLocale } from './resolveLocale';
import type {
  PartialTranslationDictionary,
  Translate,
  TranslationDictionary,
  TranslationKey,
  TranslationParams,
} from './types';

type CreateTranslationsOptions<
  Locale extends string,
  Dictionary extends TranslationDictionary,
> = {
  dictionaries: Record<Locale, PartialTranslationDictionary<Dictionary>>;
  /** Used when no locale is given, or when the given one isn't supported. */
  defaultLocale: Locale;
  /** Where a key missing from the current locale is looked up. */
  fallbackLocale?: Locale;
};

type TranslationsContextValue<
  Locale extends string,
  Dictionary extends TranslationDictionary,
> = {
  locale: Locale;
  t: Translate<Dictionary>;
};

type TranslationsProviderProps<Locale extends string> = {
  locale?: Locale;
  children: ReactNode;
};

type Translations<
  Locale extends string,
  Dictionary extends TranslationDictionary,
> = {
  TranslationsProvider: FC<TranslationsProviderProps<Locale>>;
  useTranslations: () => TranslationsContextValue<Locale, Dictionary>;
  translate: (
    locale: Locale,
    key: TranslationKey<Dictionary>,
    params?: TranslationParams,
  ) => string;
};

const lookup = (
  dictionary: TranslationDictionary | undefined,
  key: string,
): string | undefined => {
  const value = getObjectPath(dictionary ?? {}, key.split('.'));
  return typeof value === 'string' ? value : undefined;
};

/**
 * Creates a self-contained translation layer: its own context, no global state
 * and nothing shared with the consumer's own i18n setup. Each library calls it
 * once with its dictionaries.
 *
 * A key resolves through the current locale, then the fallback locale, and
 * renders the key itself when neither has it.
 *
 * @example
 * const { TranslationsProvider, useTranslations } = createTranslations<
 *   'en' | 'fr',
 *   typeof en
 * >({ dictionaries: { en, fr }, defaultLocale: 'en' });
 *
 * const { t } = useTranslations();
 * t('components.pagination.pageAriaLabel', { page: 2 });
 */
export const createTranslations = <
  Locale extends string,
  Dictionary extends TranslationDictionary,
>({
  dictionaries,
  defaultLocale,
  fallbackLocale = defaultLocale,
}: CreateTranslationsOptions<Locale, Dictionary>): Translations<
  Locale,
  Dictionary
> => {
  const supportedLocales = Object.keys(dictionaries) as Locale[];

  const translate = (
    locale: Locale,
    key: TranslationKey<Dictionary>,
    params?: TranslationParams,
  ): string => {
    const template =
      lookup(dictionaries[locale] as TranslationDictionary, key) ??
      lookup(dictionaries[fallbackLocale] as TranslationDictionary, key) ??
      key;

    return interpolate(template, params);
  };

  const createContextValue = (
    locale: Locale,
  ): TranslationsContextValue<Locale, Dictionary> => ({
    locale,
    t: (key, params) => translate(locale, key, params),
  });

  // Without a provider, keys render as-is (as i18next does before resources
  // load), so tests and stories can render components without any setup.
  const TranslationsContext = createContext<
    TranslationsContextValue<Locale, Dictionary>
  >({ locale: defaultLocale, t: (key) => key });

  const TranslationsProvider: FC<TranslationsProviderProps<Locale>> = ({
    locale,
    children,
  }) => {
    const resolvedLocale = resolveLocale(
      locale,
      supportedLocales,
      defaultLocale,
    );
    const value = useMemo(
      () => createContextValue(resolvedLocale),
      [resolvedLocale],
    );

    return (
      <TranslationsContext.Provider value={value}>
        {children}
      </TranslationsContext.Provider>
    );
  };

  TranslationsProvider.displayName = 'TranslationsProvider';

  const useTranslations = (): TranslationsContextValue<Locale, Dictionary> =>
    useContext(TranslationsContext);

  return { TranslationsProvider, useTranslations, translate };
};

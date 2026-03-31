import i18next, { type i18n as I18nInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import {
  DEFAULT_LANGUAGE,
  I18N_DEFAULT_NAMESPACE,
  SupportedLocale,
} from './languages';

const loadedLocales = new Set<SupportedLocale>();

const initializeI18n = (): I18nInstance => {
  const instance = i18next.createInstance();

  instance
    .use(initReactI18next)
    .init({
      resources: {},
      lng: DEFAULT_LANGUAGE,
      defaultNS: I18N_DEFAULT_NAMESPACE,
      fallbackLng: DEFAULT_LANGUAGE,
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    })
    .catch((error: unknown) => {
      // eslint-disable-next-line no-console
      console.error('Failed to initialize i18next:', error);
    });

  return instance;
};

export const i18n = initializeI18n();

/**
 * Loads the translations for a given locale.
 */
export const loadLocale = async (locale: SupportedLocale): Promise<void> => {
  if (loadedLocales.has(locale)) {
    return;
  }

  try {
    const translations = await import(`./locales/${locale}.json`);
    i18n.addResourceBundle(
      locale,
      I18N_DEFAULT_NAMESPACE,
      translations.default,
      true,
      true,
    );

    loadedLocales.add(locale);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Failed to load locale ${locale}`, error);
    throw error;
  }
};

/**
 * Switches the language to the given locale.
 */
export const switchLanguage = async (
  locale: SupportedLocale,
): Promise<void> => {
  await loadLocale(locale);
  await i18n.changeLanguage(locale);
};

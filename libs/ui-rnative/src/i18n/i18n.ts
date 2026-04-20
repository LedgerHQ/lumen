import i18next, { type i18n as I18nInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import type { SupportedLocale } from './languages';
import { DEFAULT_LANGUAGE, I18N_DEFAULT_NAMESPACE } from './languages';

import de from './locales/de.json';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import pt from './locales/pt.json';
import ru from './locales/ru.json';
import th from './locales/th.json';
import tr from './locales/tr.json';
import zh from './locales/zh.json';

const localeResources = {
  de,
  en,
  es,
  fr,
  ja,
  ko,
  pt,
  ru,
  th,
  tr,
  zh,
};

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
 * In React Native, we bundle all locales, so this just adds the resource bundle.
 */
export const loadLocale = async (locale: SupportedLocale): Promise<void> => {
  if (loadedLocales.has(locale)) {
    return;
  }

  try {
    const translations = localeResources[locale];
    i18n.addResourceBundle(
      locale,
      I18N_DEFAULT_NAMESPACE,
      translations,
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

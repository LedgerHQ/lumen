/**
 * Mapping from languages to their respective infos.
 */
export const Languages = {
  de: {
    id: 'de',
  },
  en: {
    id: 'en',
  },
  es: {
    id: 'es',
  },
  fr: {
    id: 'fr',
  },
  ja: {
    id: 'ja',
  },
  ko: {
    id: 'ko',
  },
  pt: {
    id: 'pt',
  },
  ru: {
    id: 'ru',
  },
  th: {
    id: 'th',
  },
  tr: {
    id: 'tr',
  },
  zh: {
    id: 'zh',
  },
} as const satisfies Record<string, { id: string }>;

/**
 * Default loaded language
 */
export const DEFAULT_LANGUAGE = Languages.en.id;

/**
 * Supported locales type
 */
export type SupportedLocale = keyof typeof Languages;

/**
 * Default namespace for i18n
 * Currently there is only one namespace
 */
export const I18N_DEFAULT_NAMESPACE = 'common';

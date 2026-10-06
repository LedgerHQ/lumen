import { createTranslations } from '@ledgerhq/lumen-utils-shared';
import { DEFAULT_LANGUAGE, type SupportedLocale } from './languages';
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

export const dictionaries = { de, en, es, fr, ja, ko, pt, ru, th, tr, zh };

export const { TranslationsProvider, useTranslations: useCommonTranslation } =
  createTranslations<SupportedLocale, typeof en>({
    dictionaries,
    defaultLocale: DEFAULT_LANGUAGE,
  });

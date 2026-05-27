import type { PropsWithChildren } from 'react';
import type { ColorSchemeName } from 'react-native';
import type { SupportedLocale } from '../../../i18n/languages';
import type { LumenThemes } from '../../../styles';

export type ThemeProviderProps = PropsWithChildren & {
  /**
   * The colors scheme of the theme.
   */
  colorScheme?: ColorSchemeName;
  /**
   * The locale to use for translations.
   * When changed, translations will be lazy-loaded automatically.
   * @default 'en'
   */
  locale?: SupportedLocale;
  /**
   * Themes containing design-tokens for the app.
   */
  themes: LumenThemes;
};

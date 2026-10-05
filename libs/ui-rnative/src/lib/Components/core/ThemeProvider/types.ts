import type { PropsWithChildren } from 'react';
import type { ColorSchemeName } from 'react-native';
import type { LumenThemes } from '../../../../styles';
import type { SupportedLocale } from '../../../../translations/languages';

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

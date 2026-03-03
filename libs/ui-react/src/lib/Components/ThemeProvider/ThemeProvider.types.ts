import { PropsWithChildren } from 'react';
import { type SupportedLocale } from '../../../i18n';

export const COLOR_SCHEMES = {
  light: 'light',
  dark: 'dark',
  system: 'system',
} as const;

export type ColorSchemeName =
  (typeof COLOR_SCHEMES)[keyof typeof COLOR_SCHEMES];

export type ThemeProviderProps = PropsWithChildren & {
  /**
   * The default mode of the theme.
   * @default 'system'
   */
  colorScheme?: ColorSchemeName;
  /**
   * The locale to use for translations.
   * When changed, translations will be lazy-loaded automatically.
   * @default 'en'
   */
  locale?: SupportedLocale;
};

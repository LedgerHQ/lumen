import type { PropsWithChildren } from 'react';
import { type SupportedLocale } from '../../../i18n';

export const COLOR_SCHEMES = {
  light: 'light',
  dark: 'dark',
  system: 'system',
} as const;

export type ColorSchemeName = keyof typeof COLOR_SCHEMES;

export type ThemeProviderProps = PropsWithChildren & {
  /**
   * The color scheme of the theme.
   * system will follow the user's OS preference via `prefers-color-scheme`.
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

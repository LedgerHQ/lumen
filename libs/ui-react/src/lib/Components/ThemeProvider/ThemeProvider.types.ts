import type { LedgerLiveThemes } from '@ledgerhq/lumen-design-core';
import type { PropsWithChildren } from 'react';
import { type SupportedLocale } from '../../../i18n';

export const COLOR_SCHEMES = {
  light: 'light',
  dark: 'dark',
  system: 'system',
} as const;

export type ColorSchemeName = keyof typeof COLOR_SCHEMES;

export type LumenThemes = LedgerLiveThemes;

export type ThemeProviderProps = PropsWithChildren & {
  /**
   * Themes containing design-tokens for the app.
   */
  themes?: LumenThemes;
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

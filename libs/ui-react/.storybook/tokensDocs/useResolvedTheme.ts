import {
  enterpriseThemes,
  ledgerLiveThemes,
  type ThemeColorTokens,
  type ThemeCoreTokens,
  websitesThemes,
} from '@ledgerhq/lumen-design-core';
import { useSyncExternalStore } from 'react';

type ResolvedTheme = ThemeCoreTokens & { colors: ThemeColorTokens };

const themesByBrand = {
  'ledger-live': ledgerLiveThemes,
  enterprise: enterpriseThemes,
  websites: websitesThemes,
} as const;

type Brand = keyof typeof themesByBrand;

const BRANDS = Object.keys(themesByBrand) as Brand[];

/**
 * The Storybook decorator mirrors the active brand and color scheme as classes
 * on the `<html>` element. Subscribing to its class changes lets the token docs
 * re-render (and re-read the JS theme) whenever the toolbar brand or dark-mode
 * toggle changes.
 */
const subscribe = (callback: () => void): (() => void) => {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
  return () => observer.disconnect();
};

const getSnapshot = (): string => document.documentElement.className;

export const useResolvedTheme = (): ResolvedTheme => {
  useSyncExternalStore(subscribe, getSnapshot, () => '');

  const classes = document.documentElement.classList;
  const brand = BRANDS.find((b) => classes.contains(b)) ?? 'ledger-live';
  const mode = classes.contains('dark') ? 'dark' : 'light';

  return themesByBrand[brand][mode] as ResolvedTheme;
};

import {
  enterpriseThemes,
  ledgerLiveThemes,
  websitesThemes,
} from '@ledgerhq/lumen-design-core';
import { useDarkMode } from 'storybook-dark-mode';

export function useSampleAccentColor(): string {
  return useResolvedTheme().colors.bg.accent;
}

function getGlobalsOverride() {
  const params = new URLSearchParams(window.location.search).get('globals');

  return Object.fromEntries(
    params?.split(';').map((param) => param.split(':')) ?? [],
  ) as {
    brand?: 'ledger-live' | 'enterprise' | 'websites';
    mode?: 'light' | 'dark';
  };
}

export function useResolvedTheme() {
  const isDark = useDarkMode();
  const { brand, mode } = getGlobalsOverride();

  const theme = {
    'ledger-live': ledgerLiveThemes,
    enterprise: enterpriseThemes,
    websites: websitesThemes,
  }[brand || 'ledger-live'];

  return theme[mode ?? (isDark ? 'dark' : 'light')];
}

import {
  enterpriseThemes,
  ledgerLiveThemes,
  websitesThemes,
} from '@ledgerhq/lumen-design-core';

export function getSampleAccentColor(): string {
  return resolveTheme().colors.bg.accent;
}

function getGlobals() {
  const params = new URLSearchParams(window.location.search).get('globals');

  return Object.fromEntries(
    params?.split(';').map((param) => param.split(':')) ?? [],
  );
}

export function resolveTheme() {
  const { brand, mode } = getGlobals() as {
    brand?: 'ledger-live' | 'enterprise' | 'websites';
    mode?: 'light' | 'dark';
  };

  const theme = {
    'ledger-live': ledgerLiveThemes,
    enterprise: enterpriseThemes,
    websites: websitesThemes,
  }[brand || 'ledger-live'];

  return theme[mode || 'light'];
}

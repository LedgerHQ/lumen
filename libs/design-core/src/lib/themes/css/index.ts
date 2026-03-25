import { tokens as enterpriseDarkThemeTokens } from './enterprise/theme.dark-css';
import { tokens as enterpriseLightThemeTokens } from './enterprise/theme.light-css';
import { tokens as ledgerLiveDarkThemeTokens } from './ledger-live/theme.dark-css';
import { tokens as ledgerLiveLightThemeTokens } from './ledger-live/theme.light-css';

import { tokens as primitivesTokens } from './primitives-css';
import { tokens as typographyLgTokens } from './typographies/typography.lg-css';
import { tokens as typographyMdTokens } from './typographies/typography.md-css';
import { tokens as typographySmTokens } from './typographies/typography.sm-css';
import { tokens as typographyXlTokens } from './typographies/typography.xl-css';
import { tokens as typographyXsTokens } from './typographies/typography.xs-css';
import { tokens as websitesDarkThemeTokens } from './websites/theme.dark-css';
import { tokens as websitesLightThemeTokens } from './websites/theme.light-css';

export const primitivesTheme = {
  ':root': {
    ...primitivesTokens[':root'],
    ...typographyXsTokens[':root'],
    ...typographySmTokens,
    ...typographyLgTokens,
    ...typographyMdTokens,
    ...typographyXlTokens,
  },
};

export const enterpriseCSSTheme = {
  ...enterpriseLightThemeTokens,
  ...enterpriseDarkThemeTokens,
};

export const ledgerLiveCSSTheme = {
  ...ledgerLiveLightThemeTokens,
  ...ledgerLiveDarkThemeTokens,
};

export const websitesCSSTheme = {
  ...websitesLightThemeTokens,
  ...websitesDarkThemeTokens,
};

export const allBrandsCSSTheme = {
  '.ledger-live': ledgerLiveLightThemeTokens[':root'],
  '.ledger-live.dark': ledgerLiveDarkThemeTokens['.dark'],

  '.enterprise': enterpriseLightThemeTokens[':root'],
  '.enterprise.dark': enterpriseDarkThemeTokens['.dark'],

  '.websites': websitesLightThemeTokens[':root'],
  '.websites.dark': websitesDarkThemeTokens['.dark'],
};

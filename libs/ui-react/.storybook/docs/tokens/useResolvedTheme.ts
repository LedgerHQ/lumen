import {
  enterpriseThemes,
  ledgerLiveThemes,
  type ThemeColorTokens,
  type ThemeCoreTokens,
  websitesThemes,
} from '@ledgerhq/lumen-design-core';
import { useContext } from 'react';
import { ThemeDocsContext, type Brand } from '../../Decorator';

type ResolvedTheme = ThemeCoreTokens & { colors: ThemeColorTokens };

const themesByBrand = {
  'ledger-live': ledgerLiveThemes,
  enterprise: enterpriseThemes,
  websites: websitesThemes,
} satisfies Record<Brand, unknown>;

export const useResolvedTheme = (): ResolvedTheme => {
  const { brand, mode } = useContext(ThemeDocsContext);

  return themesByBrand[brand][mode] as ResolvedTheme;
};

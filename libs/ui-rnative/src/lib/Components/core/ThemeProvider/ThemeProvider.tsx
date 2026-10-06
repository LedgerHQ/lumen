import { createSafeContext } from '@ledgerhq/lumen-utils-shared';

import { LumenStyleSheetProvider } from '../../../../styles';
import { TranslationsProvider } from '../../../../translations';

import { GlobalTooltipProvider } from '../Tooltip/GlobalTooltipContext';
import type { ThemeProviderProps } from './types';

const [ThemeContextProvider] = createSafeContext('ThemeProvider');

const ThemeProvider = ({
  colorScheme,
  themes,
  children,
  locale,
}: ThemeProviderProps) => {
  return (
    <ThemeContextProvider value={{}}>
      <LumenStyleSheetProvider colorScheme={colorScheme} themes={themes}>
        <TranslationsProvider locale={locale}>
          <GlobalTooltipProvider>{children}</GlobalTooltipProvider>
        </TranslationsProvider>
      </LumenStyleSheetProvider>
    </ThemeContextProvider>
  );
};

export { ThemeProvider };

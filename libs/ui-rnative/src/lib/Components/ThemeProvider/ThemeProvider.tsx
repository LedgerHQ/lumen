import { createSafeContext } from '@ledgerhq/lumen-utils-shared';

import { I18nProvider } from '../../../i18n';
import { LumenStyleSheetProvider } from '../../../styles';

import { GlobalSelectProvider } from '../Select/GlobalSelectContext';
import { GlobalTooltipProvider } from '../Tooltip/GlobalTooltipContext';
import { ThemeProviderProps } from './types';

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
        <I18nProvider locale={locale}>
          <GlobalSelectProvider>
            <GlobalTooltipProvider>{children}</GlobalTooltipProvider>
          </GlobalSelectProvider>
        </I18nProvider>
      </LumenStyleSheetProvider>
    </ThemeContextProvider>
  );
};

export { ThemeProvider };

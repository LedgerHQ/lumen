import {
  enterpriseThemes,
  ledgerLiveThemes,
  websitesThemes,
} from '@ledgerhq/lumen-design-core';
import {
  DocsContainer,
  DocsContainerProps,
} from '@storybook/addon-docs/blocks';
import type { Decorator } from '@storybook/react-native-web-vite';
import { PropsWithChildren, ReactNode } from 'react';

import { ColorSchemeName } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '../src/lib/Components';

type BrandThemes = typeof ledgerLiveThemes;

const mappingThemes: Record<string, BrandThemes> = {
  'ledger-live': ledgerLiveThemes,
  enterprise: enterpriseThemes as unknown as BrandThemes,
  websites: websitesThemes as unknown as BrandThemes,
};

const getThemeFromGlobals = (
  mode?: ColorSchemeName | string,
  brand?: string,
): { mode: ColorSchemeName; theme: BrandThemes } => ({
  mode: (mode as ColorSchemeName) ?? 'light',
  theme: mappingThemes[brand ?? 'ledger-live'] ?? mappingThemes['ledger-live'],
});

type StorybookProvidersProps = PropsWithChildren<{
  mode: ColorSchemeName;
  theme: BrandThemes;
}>;

const StorybookProviders = ({
  mode,
  theme,
  children,
}: StorybookProvidersProps) => (
  <ThemeProvider colorScheme={mode} themes={theme}>
    <GestureHandlerRootView
      style={{ flex: 1, width: '100%', alignItems: 'flex-start' }}
    >
      {children}
    </GestureHandlerRootView>
  </ThemeProvider>
);

const createThemeDecorator = (
  globalName: string,
  themeClasses: string[],
): Decorator => {
  return (Story, context) => {
    const selectedValue = context.globals[globalName] as string | undefined;
    const htmlElement = document.documentElement;

    htmlElement.classList.remove(...themeClasses);

    if (selectedValue) {
      htmlElement.classList.add(selectedValue);
    }

    return <Story />;
  };
};

export const withBrandDecorator = createThemeDecorator('brand', [
  'ledger-live',
  'enterprise',
  'websites',
]);

export const withModeDecorator = createThemeDecorator('mode', [
  'light',
  'dark',
]);

export const withProvidersDecorator: Decorator = (Story, context) => {
  const { mode, theme } = getThemeFromGlobals(
    context.globals.mode,
    context.globals.brand,
  );

  return (
    <StorybookProviders mode={mode} theme={theme}>
      <Story />
    </StorybookProviders>
  );
};

type DocsContainerContext = {
  store: {
    globals: {
      globals: {
        mode?: ColorSchemeName;
        brand?: string;
      };
    };
  };
};

export const withProvidersDocsContainer = ({
  children,
  context,
  ...rest
}: PropsWithChildren<DocsContainerProps>): ReactNode => {
  const docsContext = context as unknown as DocsContainerContext;
  const { mode, theme } = getThemeFromGlobals(
    docsContext.store?.globals?.globals?.mode,
    docsContext.store?.globals?.globals?.brand,
  );

  return (
    <DocsContainer context={context} {...rest}>
      <StorybookProviders mode={mode} theme={theme}>
        {children}
      </StorybookProviders>
    </DocsContainer>
  );
};

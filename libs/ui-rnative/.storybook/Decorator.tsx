import {
  enterpriseThemes,
  ledgerLiveThemes,
  websitesThemes,
} from '@ledgerhq/lumen-design-core';
import type { DocsContainerProps } from '@storybook/addon-docs/blocks';
import { DocsContainer } from '@storybook/addon-docs/blocks';
import type { Decorator } from '@storybook/react-native-web-vite';
import type { PropsWithChildren, ReactNode } from 'react';
import { useEffect, useState } from 'react';

import type { ColorSchemeName } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { addons } from 'storybook/preview-api';
import { DARK_MODE_EVENT_NAME, useDarkMode } from 'storybook-dark-mode';
import { BottomSheetModalProvider, ThemeProvider } from '../src/lib/Components';
import { darkTheme, lightTheme } from './theme';

type BrandThemes = typeof ledgerLiveThemes;

const BRAND_CLASSES = ['ledger-live', 'enterprise', 'websites'] as const;
const DEFAULT_BRAND = 'ledger-live';

const mappingThemes: Record<string, BrandThemes> = {
  'ledger-live': ledgerLiveThemes,
  enterprise: enterpriseThemes as unknown as BrandThemes,
  websites: websitesThemes as unknown as BrandThemes,
};

const getThemeFromBrand = (brand?: string): BrandThemes =>
  mappingThemes[brand ?? DEFAULT_BRAND] ?? mappingThemes[DEFAULT_BRAND];

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
      <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
    </GestureHandlerRootView>
  </ThemeProvider>
);

const BrandClassManager = ({ brand }: { brand: string }) => {
  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.classList.remove(...BRAND_CLASSES);
    htmlElement.classList.add(brand);
  }, [brand]);

  return null;
};

export const withBrandDecorator: Decorator = (Story, context) => {
  const brand = (context.globals.brand as string) || DEFAULT_BRAND;

  return (
    <>
      <BrandClassManager brand={brand} />
      <Story />
    </>
  );
};

const ProvidersDecorator = ({
  children,
  brand,
}: PropsWithChildren<{ brand?: string }>) => {
  const isDark = useDarkMode();
  const mode: ColorSchemeName = isDark ? 'dark' : 'light';
  const theme = getThemeFromBrand(brand);

  return (
    <StorybookProviders mode={mode} theme={theme}>
      {children}
    </StorybookProviders>
  );
};

export const withProvidersDecorator: Decorator = (Story, context) => (
  <ProvidersDecorator brand={context.globals.brand as string | undefined}>
    <Story />
  </ProvidersDecorator>
);

const channel = addons.getChannel();

type DocsContainerContext = {
  store: {
    globals: {
      globals: {
        brand?: string;
      };
    };
  };
};

export const WithProvidersDocsContainer = ({
  children,
  context,
  ...rest
}: PropsWithChildren<DocsContainerProps>): ReactNode => {
  const [isDark, setIsDark] = useState(false);
  const docsContext = context as unknown as DocsContainerContext;
  const brand = docsContext.store?.globals?.globals?.brand;

  useEffect(() => {
    channel.on(DARK_MODE_EVENT_NAME, setIsDark);
    return () => {
      channel.off(DARK_MODE_EVENT_NAME, setIsDark);
    };
  }, []);

  return (
    <DocsContainer
      context={context}
      {...rest}
      theme={isDark ? darkTheme : lightTheme}
    >
      <StorybookProviders
        mode={isDark ? 'dark' : 'light'}
        theme={getThemeFromBrand(brand)}
      >
        {children}
      </StorybookProviders>
    </DocsContainer>
  );
};

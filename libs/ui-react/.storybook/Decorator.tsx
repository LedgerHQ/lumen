import type { Decorator } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createContext, type ReactNode } from 'react';
import { useEffect } from 'react';
import { useDarkMode } from 'storybook-dark-mode';
import { ThemeProvider } from '../src/lib/Components/ThemeProvider';

export type Brand = 'ledger-live' | 'enterprise' | 'websites';
export type Mode = 'light' | 'dark';

const BRAND_CLASSES: Brand[] = ['ledger-live', 'enterprise', 'websites'];
export type ThemeDocsContextValue = { brand: Brand; mode: Mode };

export const ThemeDocsContext = createContext<ThemeDocsContextValue>({
  brand: 'ledger-live',
  mode: 'light',
});

const DEFAULT_BRAND: Brand = 'ledger-live';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const ThemeDecorator = ({
  brand,
  children,
}: {
  brand: Brand;
  children: ReactNode;
}) => {
  const mode = useDarkMode() ? 'dark' : 'light';

  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.classList.remove(...BRAND_CLASSES);
    htmlElement.classList.add(brand);
  }, [brand]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider colorScheme={mode}>
        <ThemeDocsContext value={{ brand, mode }}>{children}</ThemeDocsContext>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export const withStorybookProviders: Decorator = (Story, context) => {
  const brand = (context.globals.brand as Brand) || DEFAULT_BRAND;

  return (
    <ThemeDecorator brand={brand}>
      <Story />
    </ThemeDecorator>
  );
};

import type { Decorator } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useDarkMode } from 'storybook-dark-mode';
import { ThemeProvider } from '../src/lib/Components/ThemeProvider';

const BRAND_CLASSES = ['ledger-live', 'enterprise', 'websites'] as const;
const DEFAULT_BRAND = 'ledger-live';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const ThemeDecorator: React.FC<{
  brandClass: string;
  children: React.ReactNode;
}> = ({ brandClass, children }) => {
  const colorScheme = useDarkMode() ? 'dark' : 'light';

  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.classList.remove(...BRAND_CLASSES);
    htmlElement.classList.add(brandClass);
  }, [brandClass]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider colorScheme={colorScheme}>{children}</ThemeProvider>
    </QueryClientProvider>
  );
};

export const withStorybookProviders: Decorator = (Story, context) => {
  const brand = (context.globals.brand as string) || DEFAULT_BRAND;

  return (
    <ThemeDecorator brandClass={brand}>
      <Story />
    </ThemeDecorator>
  );
};

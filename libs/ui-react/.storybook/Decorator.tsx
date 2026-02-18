import type { Decorator } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeMode, ThemeProvider } from '../src/lib/Components/ThemeProvider';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

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

    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultMode={context.globals.mode as ThemeMode}>
          <Story />
        </ThemeProvider>
      </QueryClientProvider>
    );
  };
};

export const withBrandDecorator = createThemeDecorator('brand', [
  'ledger-live',
  'enterprise',
  'websites',
]);

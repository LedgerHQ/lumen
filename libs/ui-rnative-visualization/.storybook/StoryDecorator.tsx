import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { ThemeProvider } from '@ledgerhq/lumen-ui-rnative';
import type { ReactNode } from 'react';
import type { ColorSchemeName } from 'react-native';
import { useDarkMode } from 'storybook-dark-mode';

export const StoryDecorator = ({
  children,
}: {
  children: ReactNode;
  context?: unknown;
}) => {
  const colorScheme: ColorSchemeName = useDarkMode() ? 'dark' : 'light';

  return (
    <ThemeProvider themes={ledgerLiveThemes} colorScheme={colorScheme}>
      {children}
    </ThemeProvider>
  );
};

import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { ThemeProvider } from '@ledgerhq/lumen-ui-rnative';
import type { StoryContext } from '@storybook/react-native-web-vite';
import React from 'react';
import type { ColorSchemeName } from 'react-native';

export const StoryDecorator = ({
  children,
  context,
}: {
  children: React.ReactNode;
  context: StoryContext;
}) => {
  return (
    <ThemeProvider
      themes={ledgerLiveThemes}
      colorScheme={context.globals.mode as ColorSchemeName}
    >
      {children}
    </ThemeProvider>
  );
};

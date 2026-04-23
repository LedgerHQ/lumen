import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { ThemeProvider } from '@ledgerhq/lumen-ui-react';
import type { StoryContext } from '@storybook/react-vite';
import React from 'react';

export const StoryDecorator = ({
  children,
  context,
}: {
  children: React.ReactNode;
  context: StoryContext;
}) => {
  return (
    <ThemeProvider themes={ledgerLiveThemes} colorScheme={context.globals.mode}>
      {children}
    </ThemeProvider>
  );
};

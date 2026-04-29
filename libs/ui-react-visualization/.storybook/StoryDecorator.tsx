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
    <ThemeProvider colorScheme={context.globals.mode}>{children}</ThemeProvider>
  );
};

import { ThemeProvider } from '@ledgerhq/lumen-ui-react';
import React from 'react';
import { useDarkMode } from 'storybook-dark-mode';

export const StoryDecorator = ({
  children,
}: {
  children: React.ReactNode;
  context?: unknown;
}) => {
  const colorScheme = useDarkMode() ? 'dark' : 'light';

  return (
    <ThemeProvider colorScheme={colorScheme}>
      <div className='p-32'>{children}</div>
    </ThemeProvider>
  );
};

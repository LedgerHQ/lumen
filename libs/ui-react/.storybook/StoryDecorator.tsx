import React from 'react';
import { useDarkMode } from 'storybook-dark-mode';
import { ThemeProvider } from '../src/lib/Components/core/ThemeProvider';

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

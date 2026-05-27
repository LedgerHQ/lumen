import type { DocsContainerProps } from '@storybook/addon-docs/blocks';
import { DocsContainer } from '@storybook/addon-docs/blocks';
import type { Preview } from '@storybook/react-vite';
import type { PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';
import { addons } from 'storybook/preview-api';
import { DARK_MODE_EVENT_NAME } from 'storybook-dark-mode';
import { withStorybookProviders } from './Decorator';
import { darkTheme, lightTheme } from './theme';
import '../src/styles.css';
import './font.css';

const channel = addons.getChannel();

const ThemedDocsContainer = ({
  children,
  ...props
}: PropsWithChildren<DocsContainerProps>) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    channel.on(DARK_MODE_EVENT_NAME, setIsDark);
    return () => {
      channel.off(DARK_MODE_EVENT_NAME, setIsDark);
    };
  }, []);

  return (
    <DocsContainer {...props} theme={isDark ? darkTheme : lightTheme}>
      {children}
    </DocsContainer>
  );
};

const preview: Preview = {
  globalTypes: {
    brand: {
      name: 'Brand',
      description: 'Global brand theme for components',
      defaultValue: 'ledger-live',
      toolbar: {
        icon: 'paintbrush',
        title: 'Brand',
        items: ['ledger-live', 'enterprise', 'websites'],

        dynamicTitle: true,
      },
    },
  },

  parameters: {
    darkMode: {
      light: lightTheme,
      dark: darkTheme,
      classTarget: 'html',
      stylePreview: true,
      darkClass: 'dark',
      lightClass: 'light',
    },
    docs: {
      codePanel: true,
      container: ThemedDocsContainer,
    },
    options: {
      storySort: {
        order: [
          'Getting Started',
          ['Introduction', 'Setup', 'Setup Tailwind', 'Changelog'],
          'Foundations',
          ['Docs', 'Colors', 'Border', 'Spacing', 'Size', 'Height', 'Width'],
          'Symbols',
          'Action',
          [
            'Button',
            'CardButton',
            'IconButton',
            'MediaButton',
            'TileButton',
            'Link',
            'InteractiveIcon',
          ],
          'Input',
          ['TextInput', 'SearchInput', 'AddressInput', 'AmountInput'],
          'Communication',
          'Containment',
          ['Dialog', 'ListItem', 'Tile'],
          'Selection',
          'Visualization',
        ],
      },
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },

  decorators: [withStorybookProviders],
};

export default preview;

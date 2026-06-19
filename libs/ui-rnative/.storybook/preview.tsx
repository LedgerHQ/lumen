import type { Preview } from '@storybook/react-native-web-vite';

import {
  WithProvidersDocsContainer,
  withBrandDecorator,
  withProvidersDecorator,
} from './Decorator';
import { darkTheme, lightTheme } from './theme';
import './font.css';

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
    options: {
      storySort: {
        order: [
          'Getting Started',
          ['Setup', 'Changelog'],
          'Style System',
          ['Style System', 'useTheme', 'useStyleSheet', 'lx'],
          'Symbols',
          'Primitives',
          'Core',
          'Visualization',
        ],
      },
    },
    tags: ['autodocs'],
    docs: {
      container: WithProvidersDocsContainer,
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },

  decorators: [withBrandDecorator, withProvidersDecorator],
};

export default preview;

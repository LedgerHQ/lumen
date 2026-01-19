import type { Preview } from '@storybook/react-vite';
import { withBrandDecorator } from './Decorator';
import '../src/styles.css';
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
    mode: {
      name: 'Mode',
      description: 'Color scheme for components',
      defaultValue: 'light',
      toolbar: {
        icon: 'sun',
        title: 'Mode',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },

  parameters: {
    backgrounds: {
      options: {
        dark: { name: 'Dark', value: '#191919' },
        light: { name: 'Light', value: '#fafafa' },
      },
    },
    initialGlobals: {
      backgrounds: { value: 'light' },
    },

    options: {
      storySort: {
        order: [
          'Getting Started',
          ['Introduction', 'Quick Start', 'Setup Tailwind', 'Changelog'],
          'Foundations',
          ['Docs', 'Colors', 'Border', 'Spacing', 'Size', 'Height', 'Width'],
          'Symbols',
          'Action',
          [
            'Button',
            'CardButton',
            'IconButton',
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

  decorators: [withBrandDecorator],
};

export default preview;

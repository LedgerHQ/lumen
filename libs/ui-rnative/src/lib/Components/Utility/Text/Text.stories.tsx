import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Text } from './Text';
import { TextProps } from './types';

const meta: Meta<TextProps> = {
  component: Text,
  title: 'Utility/Text',
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'code',
      },
    },
  },
};

export default meta;
type Story = StoryObj<TextProps>;

export const Base: Story = {
  args: {
    typography: 'body1',
    lx: { color: 'base' },
    children: 'Hello World',
  },
  parameters: {
    docs: {
      source: {
        code: `
<Text typography='body1' lx={{ color: 'base' }}>
  Hello World
</Text>
`,
      },
    },
  },
};

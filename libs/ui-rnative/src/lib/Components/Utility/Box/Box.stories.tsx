import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Box } from './Box';

const meta: Meta<typeof Box> = {
  component: Box,
  title: 'Primitives/Box',
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
type Story = StoryObj<typeof Box>;

export const Base: Story = {
  args: {
    lx: {
      height: 's48',
      width: 's48',
      backgroundColor: 'accent',
      borderRadius: 'md',
    },
  },
  parameters: {
    docs: {
      source: {
        code: `
<Box
  lx={{
    height: 's48',
    width: 's48',
    backgroundColor: 'accent',
    borderRadius: 'md',
    alignSelf: 'center',
  }}
/>
`,
      },
    },
  },
};

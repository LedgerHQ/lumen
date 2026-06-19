import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Pressable } from './Pressable';

const meta: Meta<typeof Pressable> = {
  component: Pressable,
  title: 'Primitives/Pressable',
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
type Story = StoryObj<typeof Pressable>;

export const Base: Story = {
  args: {
    lx: {
      height: 's48',
      width: 's48',
      backgroundColor: 'accent',
      borderRadius: 'md',
      alignSelf: 'center',
    },
    style: ({ pressed }) => ({ opacity: pressed ? 0.5 : 1 }),
  },
  render: (args) => <Pressable {...args} />,
  parameters: {
    docs: {
      source: {
        code: `
<Pressable
  style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
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

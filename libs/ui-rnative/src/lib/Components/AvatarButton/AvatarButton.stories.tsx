import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { AvatarButton } from './AvatarButton';

const meta = {
  component: AvatarButton,
  id: 'rnative-avatar-button',
  title: 'Core/AvatarButton',
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'code',
      },
    },
  },
} satisfies Meta<typeof AvatarButton>;

export default meta;
type Story = StoryObj<typeof meta>;

const exampleSrc =
  'https://plus.unsplash.com/premium_photo-1689551670902-19b441a6afde?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

export const Base: Story = {
  args: {
    src: exampleSrc,
    size: 'md',
    alt: 'Open user menu',
    onPress: () => ({}),
  },
  render: (args) => <AvatarButton {...args} />,
  parameters: {
    docs: {
      source: {
        code: `<AvatarButton src="https://example.com" alt="Open user menu" onPress={openMenu} />`,
      },
    },
  },
};

export const Fallback: Story = {
  args: {
    alt: 'Open user menu',
  },
  render: (args) => <AvatarButton {...args} />,
};

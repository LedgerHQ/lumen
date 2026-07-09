import type { Meta, StoryObj } from '@storybook/react-vite';
import { AvatarButton } from './AvatarButton';

const meta = {
  component: AvatarButton,
  id: 'react-avatar-button',
  title: 'Core/AvatarButton',
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
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
    onClick: () => ({}),
  },
  parameters: {
    docs: {
      source: {
        code: `<AvatarButton src="https://example.com" alt="Open user menu" onClick={openMenu} />`,
      },
    },
  },
};

export const Fallback: Story = {
  args: {
    alt: 'Open user menu',
    fallbackText: 'AB',
  },
};

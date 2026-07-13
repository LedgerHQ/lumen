import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { ColorTable } from './ColorTable';

const meta: Meta = {
  id: 'rnative-colors',
  title: 'Style System/Theme/Colors',
};

export default meta;
type Story = StoryObj;

export const Background: Story = {
  render: () => <ColorTable category='bg' />,
};

export const Text: Story = {
  render: () => <ColorTable category='text' />,
};

export const Border: Story = {
  render: () => <ColorTable category='border' />,
};

export const Crypto: Story = {
  render: () => <ColorTable category='crypto' />,
};

export const Discover: Story = {
  render: () => <ColorTable category='discover' />,
};

import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { SizeTable } from './SizeTable';

const meta: Meta = {
  id: 'rnative-sizes',
  title: 'Style System/Theme/Sizes',
};

export default meta;
type Story = StoryObj;

export const Sizes: Story = {
  render: () => <SizeTable />,
};

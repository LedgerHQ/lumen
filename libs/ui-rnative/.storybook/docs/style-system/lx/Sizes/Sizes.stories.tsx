import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { SizeTable } from './SizeTable';

const meta = {
  id: 'rnative-sizes',
  title: 'Style System/Theme/Sizes',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sizes: Story = {
  render: () => <SizeTable />,
};

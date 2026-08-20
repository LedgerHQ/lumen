import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { BorderWidthTable } from './BorderWidthTable';

const meta = {
  id: 'rnative-borderwidth',
  title: 'Style System/Theme/Border Width',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Width: Story = {
  render: () => <BorderWidthTable />,
};

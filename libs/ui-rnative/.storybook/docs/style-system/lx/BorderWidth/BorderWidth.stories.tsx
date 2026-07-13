import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { BorderWidthTable } from './BorderWidthTable';

const meta: Meta = {
  id: 'rnative-borderwidth',
  title: 'Style System/Theme/Border Width',
};

export default meta;
type Story = StoryObj;

export const Width: Story = {
  render: () => <BorderWidthTable />,
};

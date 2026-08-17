import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { BorderRadiusTable } from './BorderRadiusTable';

const meta = {
  id: 'rnative-borderradius',
  title: 'Style System/Theme/Border Radius',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Radius: Story = {
  render: () => <BorderRadiusTable />,
};

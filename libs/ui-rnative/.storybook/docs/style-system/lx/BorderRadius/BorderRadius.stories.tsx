import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { BorderRadiusTable } from './BorderRadiusTable';

const meta: Meta = {
  id: 'rnative-borderradius',
  title: 'Style System/Theme/Border Radius',
};

export default meta;
type Story = StoryObj;

export const Radius: Story = {
  render: () => <BorderRadiusTable />,
};

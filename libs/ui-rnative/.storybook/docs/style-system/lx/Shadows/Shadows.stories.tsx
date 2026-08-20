import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { ShadowTable } from './ShadowTable';

const meta = {
  id: 'rnative-shadows',
  title: 'Style System/Theme/Shadows',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Shadows: Story = {
  render: () => <ShadowTable />,
};

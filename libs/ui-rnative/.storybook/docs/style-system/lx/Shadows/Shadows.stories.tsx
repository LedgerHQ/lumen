import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { ShadowTable } from './ShadowTable';

const meta: Meta = {
  id: 'rnative-shadows',
  title: 'Style System/Theme/Shadows',
};

export default meta;
type Story = StoryObj;

export const Shadows: Story = {
  render: () => <ShadowTable />,
};

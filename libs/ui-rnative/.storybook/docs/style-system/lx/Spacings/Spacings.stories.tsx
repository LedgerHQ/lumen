import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { SpacingTable } from './SpacingTable';

const meta: Meta = {
  id: 'rnative-spacings',
  title: 'Style System/Theme/Spacings',
};

export default meta;
type Story = StoryObj;

export const Spacings: Story = {
  render: () => <SpacingTable />,
};

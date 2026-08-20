import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { SpacingTable } from './SpacingTable';

const meta = {
  id: 'rnative-spacings',
  title: 'Style System/Theme/Spacings',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Spacings: Story = {
  render: () => <SpacingTable />,
};

import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { BreakpointTable } from './BreakpointTable';

const meta = {
  id: 'rnative-breakpoints',
  title: 'Style System/Theme/Breakpoints',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Breakpoints: Story = {
  render: () => <BreakpointTable />,
};

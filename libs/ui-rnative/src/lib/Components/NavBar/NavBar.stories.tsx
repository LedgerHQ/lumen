import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Box } from '../Utility';
import { NavBar } from './NavBar';

const meta: Meta<typeof NavBar> = {
  title: 'React Native/Navigation/NavBar',
  component: NavBar,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  decorators: [
    (Story) => (
      <Box lx={{ width: 'full' }}>
        <Story />
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NavBar>;

export const Base: Story = {
  args: {
    children: 'NavBar',
  },
};

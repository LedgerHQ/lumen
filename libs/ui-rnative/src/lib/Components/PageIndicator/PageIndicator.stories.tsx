import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { PageIndicator } from './PageIndicator';

const meta = {
  title: 'React Native/Components/PageIndicator',
  component: PageIndicator,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  argTypes: {},
} satisfies Meta<typeof PageIndicator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {},
};

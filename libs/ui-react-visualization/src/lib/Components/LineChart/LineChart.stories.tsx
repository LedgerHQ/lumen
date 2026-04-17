import type { Meta, StoryObj } from '@storybook/react-vite';
import { LineChart } from './LineChart';

const meta: Meta<typeof LineChart> = {
  component: LineChart,
  title: 'Visualization/LineChart',
  tags: ['experimental'],
};

export default meta;
type Story = StoryObj<typeof LineChart>;

export const Base: Story = {
  args: {
    series: [],
  },
};

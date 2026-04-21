import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { LineChart } from './LineChart';

const meta: Meta<typeof LineChart> = {
  component: LineChart,
  title: 'Visualization/LineChart',
  tags: ['experimental'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    series: [],
  },
};

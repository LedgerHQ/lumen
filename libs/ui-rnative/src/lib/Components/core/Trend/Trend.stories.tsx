import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Box } from '../../primitives/Box';
import { Trend } from './Trend';

const meta = {
  component: Trend,
  id: 'rnative-trend',
  title: 'Core/Trend',
  argTypes: {
    value: {
      control: 'number',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md'],
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Trend>;

export default meta;

type Story = StoryObj<typeof Trend>;

export const Base: Story = {
  args: {
    value: 5.25,
    size: 'md',
    disabled: false,
  },
};

export const VariantShowcase: Story = {
  args: {
    value: 5.25,
  },
  render: () => (
    <Box lx={{ flexDirection: 'column', gap: 's8' }}>
      <Trend value={5.25} />
      <Trend value={-3.14} />
      <Trend value={0} />
    </Box>
  ),
};

export const SizeShowcase: Story = {
  args: {
    value: 5.25,
  },
  render: () => (
    <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's16' }}>
      <Trend value={5.25} size='md' />
      <Trend value={5.25} size='sm' />
    </Box>
  ),
};

export const DisabledShowcase: Story = {
  args: {
    value: 5.25,
  },
  render: () => (
    <Box lx={{ flexDirection: 'column', gap: 's8' }}>
      <Trend value={5.25} disabled />
      <Trend value={-3.14} disabled />
      <Trend value={0} disabled />
    </Box>
  ),
};

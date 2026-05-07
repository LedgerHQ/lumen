import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Box } from '../Utility/Box';
import { Trend } from './Trend';

const meta: Meta<typeof Trend> = {
  component: Trend,
  title: 'Communication/Trend',
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
};

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
  render: () => (
    <Box lx={{ flexDirection: 'column', gap: 's8' }}>
      <Trend value={5.25} />
      <Trend value={-3.14} />
      <Trend value={0} />
    </Box>
  ),
};

export const SizeShowcase: Story = {
  render: () => (
    <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's16' }}>
      <Trend value={5.25} size='md' />
      <Trend value={5.25} size='sm' />
    </Box>
  ),
};

export const DisabledShowcase: Story = {
  render: () => (
    <Box lx={{ flexDirection: 'column', gap: 's8' }}>
      <Trend value={5.25} disabled />
      <Trend value={-3.14} disabled />
      <Trend value={0} disabled />
    </Box>
  ),
};

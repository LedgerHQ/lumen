import type { Meta, StoryObj } from '@storybook/react-vite';
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
    <div className='flex flex-col gap-8'>
      <Trend value={5.25} />
      <Trend value={-3.14} />
      <Trend value={0} />
    </div>
  ),
};

export const SizeShowcase: Story = {
  render: () => (
    <div className='flex flex-row items-center gap-16'>
      <Trend value={5.25} size='md' />
      <Trend value={5.25} size='sm' />
    </div>
  ),
};

export const DisabledShowcase: Story = {
  render: () => (
    <div className='flex flex-col gap-8'>
      <Trend value={5.25} disabled />
      <Trend value={-3.14} disabled />
      <Trend value={0} disabled />
    </div>
  ),
};

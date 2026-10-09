import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from './Switch';

const meta = {
  id: 'react-switch',
  title: 'Core/Switch',
  component: Switch,
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    selected: { control: 'boolean' },
    defaultSelected: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'code',
      },
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof Switch>;

export const Base: Story = {
  args: {
    size: 'md',
    disabled: false,
  },
  render: (args) => <Switch aria-label='Toggle example' {...args} />,
};

export const StatesShowcase: Story = {
  render: () => (
    <div className='flex items-center gap-32'>
      <Switch aria-label='Toggle' selected={false} />
      <Switch aria-label='Toggle' selected={true} />
      <Switch aria-label='Toggle' disabled />
      <Switch aria-label='Toggle' disabled selected={true} />
    </div>
  ),
};

export const SizesShowcase: Story = {
  render: () => (
    <div className='flex items-center gap-32'>
      <Switch aria-label='Toggle' size='sm' />
      <Switch aria-label='Toggle' size='md' />
    </div>
  ),
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  component: Switch,
  id: 'react-switch',
  title: 'Core/Switch',
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'code',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Base: Story = {
  args: {},
  parameters: {
    docs: {
      source: {
        code: `<Switch />`,
      },
    },
  },
  render: () => <Switch aria-label='Toggle example' />,
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

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  component: Switch,
  title: 'Selection/Switch',
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
};

export const StatesShowcase: Story = {
  render: () => (
    <div className='flex items-center gap-32'>
      <Switch selected={false} />
      <Switch selected={true} />
      <Switch disabled />
      <Switch disabled selected={true} />
    </div>
  ),
};

export const SizesShowcase: Story = {
  render: () => (
    <div className='flex items-center gap-32'>
      <Switch size='sm' />
      <Switch size='md' />
    </div>
  ),
};

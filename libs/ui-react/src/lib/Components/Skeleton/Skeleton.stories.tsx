import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Communication/Skeleton',
  component: Skeleton,
  parameters: {
    backgrounds: { default: 'light' },
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className='rounded-md bg-canvas p-16'>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    component: {
      control: 'select',
      options: [undefined, 'list-item', 'tile'],
      description: 'Pre-built skeleton component variant',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    className: 'h-16 w-256',
  },
  render: (args) => (
    <Skeleton
      component={args.component}
      className={args.component ? undefined : args.className}
    />
  ),
};
export const WithListItem: Story = {
  render: () => <Skeleton component='list-item' className='w-320' />,
};

export const WithTile: Story = {
  render: () => <Skeleton component='tile' />,
};

export const WithTable: Story = {
  render: () => <Skeleton component='table' className='w-560' />,
};

export const SizeShowcase: Story = {
  render: () => (
    <div className='space-y-4'>
      <Skeleton className='h-40 w-56' />
      <Skeleton className='h-12 w-112' />
      <Skeleton className='h-128 w-256' />
    </div>
  ),
};

export const ShapeShowcase: Story = {
  render: () => (
    <div className='space-y-4'>
      <Skeleton className='h-40 w-256 rounded-none' />
      <Skeleton className='h-40 w-256 rounded-lg' />
      <Skeleton className='size-48 rounded-full' />
      <Skeleton className='size-48 rounded-md' />
    </div>
  ),
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { DotIndicator } from './DotIndicator';

const meta = {
  component: DotIndicator,
  title: 'Communication/DotIndicator',
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'code',
      },
    },
  },
  argTypes: {
    size: {
      control: 'radio',
      options: ['xs', 'sm', 'md'],
    },
    appearance: {
      control: 'radio',
      options: ['base', 'red'],
    },
  },
} satisfies Meta<typeof DotIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    appearance: 'base',
  },
};

export const SizeShowcase: Story = {
  render: () => (
    <div className='flex items-center gap-12'>
      <DotIndicator size='xs' />
      <DotIndicator size='sm' />
      <DotIndicator size='md' />
    </div>
  ),
};

export const AppearanceShowcase: Story = {
  render: () => (
    <div className='flex items-center gap-12'>
      <DotIndicator appearance='base' />
      <DotIndicator appearance='red' />
      <DotIndicator disabled />
    </div>
  ),
};

export const WithChildren: Story = {
  render: () => (
    <div className='flex items-center gap-12'>
      <DotIndicator appearance='red'>
        <Button size='sm'>Submit</Button>
      </DotIndicator>
    </div>
  ),
};

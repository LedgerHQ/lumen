import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Avatar } from '../Avatar';
import { MediaImage } from '../MediaImage';
import { SegmentedControl, SegmentedControlButton } from '../SegmentedControl';
import { DotCount } from './DotCount';

const meta = {
  component: DotCount,
  title: 'Communication/DotCount',
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
      options: ['lg', 'md'],
    },
    appearance: {
      control: 'radio',
      options: ['base', 'red'],
    },
    value: {
      control: 'number',
    },
    max: {
      control: 'number',
    },
  },
} satisfies Meta<typeof DotCount>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    value: 3,
    size: 'lg',
    appearance: 'base',
  },
};

export const SizeShowcase: Story = {
  args: { value: 5 },
  render: () => (
    <div className='flex items-center gap-12'>
      <DotCount value={5} size='lg' />
      <DotCount value={5} size='md' />
    </div>
  ),
};

export const AppearanceShowcase: Story = {
  args: { value: 3 },
  render: () => (
    <div className='flex items-center gap-12'>
      <DotCount value={3} size='lg' appearance='base' />
      <DotCount value={3} size='lg' appearance='red' />
      <DotCount value={3} size='lg' disabled />
    </div>
  ),
};

export const OverflowShowcase: Story = {
  args: { value: 100 },
  render: () => (
    <div className='flex items-center gap-12'>
      <DotCount value={100} size='lg' />
      <DotCount value={100} max={50} size='lg' />
      <DotCount value={0} size='lg' />
    </div>
  ),
};

export const WithChildren: Story = {
  args: { value: 5 },
  render: () => {
    const [fitState, setFitState] = useState('preview');

    return (
      <div className='flex flex-col gap-24'>
        <div className='flex items-center gap-12'>
          <DotCount value={5} size='md'>
            <MediaImage
              src='https://crypto-icons.ledger.com/BTC.png'
              alt='Bitcoin'
              size={40}
              shape='circle'
            />
          </DotCount>
          <DotCount value={100} size='md'>
            <Avatar
              src='https://plus.unsplash.com/premium_photo-1689551670902-19b441a6afde?q=80&w=774&auto=format&fit=crop'
              size='md'
            />
          </DotCount>
        </div>
        <SegmentedControl
          selectedValue={fitState}
          onSelectedChange={setFitState}
          tabLayout='fit'
          aria-label='Fit layout'
        >
          <SegmentedControlButton value='preview'>
            <span className='flex items-center gap-6'>
              Preview
              <DotCount value={3} size='md' />
            </span>
          </SegmentedControlButton>
          <SegmentedControlButton value='raw'>Raw</SegmentedControlButton>
          <SegmentedControlButton value='blame'>Blame</SegmentedControlButton>
        </SegmentedControl>
      </div>
    );
  },
};

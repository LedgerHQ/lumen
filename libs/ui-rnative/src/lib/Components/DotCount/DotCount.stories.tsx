import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { Avatar } from '../Avatar/Avatar';
import { MediaImage } from '../MediaImage/MediaImage';
import {
  SegmentedControl,
  SegmentedControlButton,
} from '../SegmentedControl/SegmentedControl';
import { Box } from '../Utility/Box';
import { DotCount } from './DotCount';

const meta = {
  component: DotCount,
  title: 'Communication/DotCount',
  parameters: {
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
    <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's12' }}>
      <DotCount value={5} size='lg' />
      <DotCount value={5} size='md' />
    </Box>
  ),
};

export const AppearanceShowcase: Story = {
  args: { value: 3 },
  render: () => (
    <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's12' }}>
      <DotCount value={3} size='lg' appearance='base' />
      <DotCount value={3} size='lg' appearance='red' />
      <DotCount value={3} size='lg' disabled />
    </Box>
  ),
};

export const OverflowShowcase: Story = {
  args: { value: 100 },
  render: () => (
    <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's12' }}>
      <DotCount value={100} size='lg' />
      <DotCount value={100} max={50} size='lg' />
      <DotCount value={0} size='lg' />
    </Box>
  ),
};

export const WithChildren: Story = {
  args: { value: 5 },
  render: () => {
    const [fitState, setFitState] = useState('preview');

    return (
      <Box lx={{ gap: 's24' }}>
        <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's12' }}>
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
        </Box>
        <SegmentedControl
          selectedValue={fitState}
          onSelectedChange={setFitState}
          tabLayout='fit'
          accessibilityLabel='Fit layout'
        >
          <SegmentedControlButton value='preview'>
            Preview
            <DotCount value={3} size='md' style={{ marginLeft: 6 }} />
          </SegmentedControlButton>
          <SegmentedControlButton value='raw'>Raw</SegmentedControlButton>
          <SegmentedControlButton value='blame'>Blame</SegmentedControlButton>
        </SegmentedControl>
      </Box>
    );
  },
};

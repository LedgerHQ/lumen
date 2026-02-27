import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useState } from 'react';
import { Coins, Nft, TransferHorizontal, Settings } from '../../Symbols';
import { SegmentedControl, SegmentedControlButton } from './SegmentedControl';

const meta = {
  title: 'Navigation/SegmentedControl',
  component: SegmentedControl,
  subcomponents: {
    SegmentedControlButton,
  },
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  argTypes: {
    onSelectedChange: {
      action: 'change',
    },
    disabled: {
      control: 'boolean',
    },
    selectedValue: {
      control: 'text',
    },
    children: {
      control: false,
    },
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {} as React.ComponentProps<typeof SegmentedControl>,
  render: () => {
    const [state, setState] = useState('send');

    return (
      <div className='w-256'>
        <SegmentedControl selectedValue={state} onSelectedChange={setState}>
          <SegmentedControlButton value='send'>Send</SegmentedControlButton>
          <SegmentedControlButton value='receive'>
            Receive
          </SegmentedControlButton>
          <SegmentedControlButton value='buy'>Buy</SegmentedControlButton>
        </SegmentedControl>
      </div>
    );
  },
};

export const WithIcons: Story = {
  args: {} as React.ComponentProps<typeof SegmentedControl>,
  render: () => {
    const [state, setState] = useState('tokens');

    return (
      <SegmentedControl selectedValue={state} onSelectedChange={setState}>
        <SegmentedControlButton value='tokens' icon={Coins}>
          Tokens
        </SegmentedControlButton>
        <SegmentedControlButton value='nfts' icon={Nft}>
          NFTs
        </SegmentedControlButton>
        <SegmentedControlButton value='activity' icon={TransferHorizontal}>
          Activity
        </SegmentedControlButton>
        <SegmentedControlButton value='settings' icon={Settings}>
          Settings
        </SegmentedControlButton>
      </SegmentedControl>
    );
  },
};

export const Disabled: Story = {
  args: {} as React.ComponentProps<typeof SegmentedControl>,
  render: () => (
    <div className='w-256'>
      <SegmentedControl
        selectedValue='receive'
        onSelectedChange={() => {
          /* empty */
        }}
        disabled
      >
        <SegmentedControlButton value='send'>Send</SegmentedControlButton>
        <SegmentedControlButton value='receive'>Receive</SegmentedControlButton>
        <SegmentedControlButton value='buy'>Buy</SegmentedControlButton>
      </SegmentedControl>
    </div>
  ),
};

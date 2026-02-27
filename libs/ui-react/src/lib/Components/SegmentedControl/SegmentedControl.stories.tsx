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
      description: 'Callback when the selected value changes',
      table: {
        type: { summary: '(value: string) => void' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'When true, the entire control is disabled',
      table: {
        type: { summary: 'boolean' },
      },
    },
    selectedValue: {
      control: 'text',
      description:
        'The value of the currently selected segment (drives the sliding pill)',
      table: {
        type: { summary: 'string' },
      },
    },
    children: {
      control: false,
      description: 'SegmentedControlButton elements',
      table: {
        type: { summary: 'ReactNode' },
      },
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

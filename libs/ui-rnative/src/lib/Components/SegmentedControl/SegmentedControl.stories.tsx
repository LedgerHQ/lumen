import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import React, { useState } from 'react';
import { Coins, Nft, TransferHorizontal, Settings } from '../../Symbols';
import { Box } from '../Utility';
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
    accessibilityLabel: {
      control: 'text',
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
      <Box lx={{ width: 's256' }}>
        <SegmentedControl
          selectedValue={state}
          onSelectedChange={setState}
          accessibilityLabel='Transaction type'
        >
          <SegmentedControlButton value='send'>Send</SegmentedControlButton>
          <SegmentedControlButton value='receive'>
            Receive
          </SegmentedControlButton>
          <SegmentedControlButton value='buy'>Buy</SegmentedControlButton>
        </SegmentedControl>
      </Box>
    );
  },
};

export const WithIcons: Story = {
  args: {} as React.ComponentProps<typeof SegmentedControl>,
  render: () => {
    const [state, setState] = useState('tokens');

    return (
      <SegmentedControl
        selectedValue={state}
        onSelectedChange={setState}
        accessibilityLabel='Asset section'
      >
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
    <Box lx={{ width: 's256' }}>
      <SegmentedControl
        selectedValue='receive'
        onSelectedChange={() => {
          /* empty */
        }}
        accessibilityLabel='Transaction type (disabled)'
        disabled
      >
        <SegmentedControlButton value='send'>Send</SegmentedControlButton>
        <SegmentedControlButton value='receive'>Receive</SegmentedControlButton>
        <SegmentedControlButton value='buy'>Buy</SegmentedControlButton>
      </SegmentedControl>
    </Box>
  ),
};

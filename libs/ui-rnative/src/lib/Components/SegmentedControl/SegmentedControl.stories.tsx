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
    accessibilityLabel: {
      control: 'text',
      description: 'Accessible label for the control',
      table: {
        type: { summary: 'string' },
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

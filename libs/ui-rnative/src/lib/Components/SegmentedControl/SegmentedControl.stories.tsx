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
    appearance: {
      options: ['background', 'no-background'],
      control: 'radio',
    },
    tabLayout: {
      options: ['hug', 'fixed'],
      control: 'radio',
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
  args: {
    appearance: 'background',
    tabLayout: 'hug',
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {} as React.ComponentProps<typeof SegmentedControl>,
  render: (args) => {
    const [state, setState] = useState('send');

    return (
      <SegmentedControl
        {...args}
        selectedValue={state}
        onSelectedChange={setState}
        accessibilityLabel='Transaction type'
      >
        <SegmentedControlButton value='send'>Send</SegmentedControlButton>
        <SegmentedControlButton value='receive'>Receive</SegmentedControlButton>
        <SegmentedControlButton value='buy'>Buy</SegmentedControlButton>
      </SegmentedControl>
    );
  },
};

export const WithIcons: Story = {
  args: {} as React.ComponentProps<typeof SegmentedControl>,
  render: (args) => {
    const [state, setState] = useState('tokens');

    return (
      <SegmentedControl
        {...args}
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

export const TabLayoutShowcase: Story = {
  args: {} as React.ComponentProps<typeof SegmentedControl>,
  render: (args) => {
    const [hugState, setHugState] = useState('send');
    const [fixedState, setFixedState] = useState('send');

    return (
      <Box lx={{ width: 's400', gap: 's24' }}>
        <SegmentedControl
          {...args}
          tabLayout='hug'
          selectedValue={hugState}
          onSelectedChange={setHugState}
          accessibilityLabel='Hug layout'
        >
          <SegmentedControlButton value='send'>Send</SegmentedControlButton>
          <SegmentedControlButton value='receive'>
            Receive
          </SegmentedControlButton>
          <SegmentedControlButton value='buy'>Buy</SegmentedControlButton>
        </SegmentedControl>
        <SegmentedControl
          {...args}
          tabLayout='fixed'
          selectedValue={fixedState}
          onSelectedChange={setFixedState}
          accessibilityLabel='Fixed layout'
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

export const Disabled: Story = {
  args: {} as React.ComponentProps<typeof SegmentedControl>,
  render: (args) => (
    <SegmentedControl
      {...args}
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
  ),
};

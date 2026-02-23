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
    onChange: {
      action: 'change',
      description: 'Callback when the selected index changes',
      table: {
        type: { summary: '(index: number) => void' },
      },
    },
    accessibilityLabel: {
      control: 'text',
      description: 'Accessible label for the control',
      table: {
        type: { summary: 'string' },
      },
    },
    selectedIndex: {
      control: 'number',
      description:
        'The currently selected segment index (drives the sliding pill)',
      table: {
        type: { summary: 'number' },
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
    const [selectedIndex, setSelectedIndex] = useState(0);
    const handleChange = (i: number) => setSelectedIndex(i);

    return (
      <Box lx={{ width: 's256' }}>
        <SegmentedControl
          selectedIndex={selectedIndex}
          accessibilityLabel='Transaction type'
          onChange={handleChange}
        >
          <SegmentedControlButton selected={selectedIndex === 0}>
            Send
          </SegmentedControlButton>
          <SegmentedControlButton selected={selectedIndex === 1}>
            Receive
          </SegmentedControlButton>
          <SegmentedControlButton selected={selectedIndex === 2}>
            Buy
          </SegmentedControlButton>
        </SegmentedControl>
      </Box>
    );
  },
};

export const WithIcons: Story = {
  args: {} as React.ComponentProps<typeof SegmentedControl>,
  render: () => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const handleChange = (i: number) => setSelectedIndex(i);

    return (
      <SegmentedControl
        selectedIndex={selectedIndex}
        accessibilityLabel='Asset section'
        onChange={handleChange}
      >
        <SegmentedControlButton selected={selectedIndex === 0} icon={Coins}>
          Tokens
        </SegmentedControlButton>
        <SegmentedControlButton selected={selectedIndex === 1} icon={Nft}>
          NFTs
        </SegmentedControlButton>
        <SegmentedControlButton
          selected={selectedIndex === 2}
          icon={TransferHorizontal}
        >
          Activity
        </SegmentedControlButton>
        <SegmentedControlButton selected={selectedIndex === 3} icon={Settings}>
          Settings
        </SegmentedControlButton>
      </SegmentedControl>
    );
  },
};

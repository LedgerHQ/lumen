import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import React, { useState } from 'react';
import { Eye, EyeCross, Code } from '../../Symbols';
import { SegmentedControl, SegmentedControlButton } from './SegmentedControl';

const meta = {
  title: 'Navigation/SegmentedControl',
  component: SegmentedControl,
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
      description: 'The currently selected segment index (drives the sliding pill)',
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
    const handleChange = (i: number) => {
      setSelectedIndex(i);
    };

    return (
      <SegmentedControl
        selectedIndex={selectedIndex}
        accessibilityLabel='File view'
        onChange={handleChange}
      >
        <SegmentedControlButton selected={selectedIndex === 0}>
          Preview
        </SegmentedControlButton>
        <SegmentedControlButton selected={selectedIndex === 1}>
          Raw
        </SegmentedControlButton>
        <SegmentedControlButton selected={selectedIndex === 2}>
          Blame
        </SegmentedControlButton>
      </SegmentedControl>
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
        accessibilityLabel='View mode'
        onChange={handleChange}
      >
        <SegmentedControlButton
          selected={selectedIndex === 0}
          icon={Eye}
        >
          Preview
        </SegmentedControlButton>
        <SegmentedControlButton
          selected={selectedIndex === 1}
          icon={Code}
        >
          Raw
        </SegmentedControlButton>
        <SegmentedControlButton
          selected={selectedIndex === 2}
          icon={EyeCross}
        >
          Blame
        </SegmentedControlButton>
      </SegmentedControl>
    );
  },
};

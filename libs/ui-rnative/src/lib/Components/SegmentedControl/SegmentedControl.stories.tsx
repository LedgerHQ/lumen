import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import React, { useState } from 'react';
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

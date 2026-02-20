import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { Text } from '../Utility';
import { SegmentedControl } from './SegmentedControl';

const meta = {
  title: 'Navigation/SegmentedControl',
  component: SegmentedControl,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'The currently selected segment value',
      table: {
        type: { summary: 'string' },
      },
    },
    onValueChange: {
      action: 'value changed',
      description: 'Callback when a segment is selected',
      table: {
        type: { summary: '(value: string) => void' },
      },
    },
    children: {
      control: false,
      description: 'Segment items',
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
    const [value, setValue] = useState('one');
    return (
      <SegmentedControl value={value} onValueChange={setValue}>
        <Text>Segment 1</Text>
        <Text>Segment 2</Text>
        <Text>Segment 3</Text>
      </SegmentedControl>
    );
  },
};

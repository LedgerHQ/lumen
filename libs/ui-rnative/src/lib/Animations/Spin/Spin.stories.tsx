import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { Spinner } from '../../Components/Spinner';
import { Box, Text } from '../../Components/Utility';
import { Spin } from './Spin';

const meta: Meta<typeof Spin> = {
  title: 'Animations/Spin',
  component: Spin,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Spin>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    timing: { duration: 1000, easing: 'linear' },
    children: (
      <Box lx={{ width: 's48', height: 's48', backgroundColor: 'accent' }} />
    ),
  },
};

export const DurationShowcase: Story = {
  args: {
    timing: { duration: 1000, easing: 'linear' },
    children: (
      <Box lx={{ width: 's48', height: 's48', backgroundColor: 'accent' }} />
    ),
  },
  render: (args) => (
    <View style={{ flexDirection: 'row', gap: 24, alignItems: 'center' }}>
      <View style={{ alignItems: 'center', gap: 8 }}>
        <Spin timing={{ ...args.timing, duration: 500 }}>{args.children}</Spin>
        <Text typography='body4' lx={{ color: 'muted' }}>
          500ms
        </Text>
      </View>
      <View style={{ alignItems: 'center', gap: 8 }}>
        <Spin timing={{ ...args.timing, duration: 1000 }}>{args.children}</Spin>
        <Text typography='body4' lx={{ color: 'muted' }}>
          1000ms
        </Text>
      </View>
      <View style={{ alignItems: 'center', gap: 8 }}>
        <Spin timing={{ ...args.timing, duration: 2000 }}>{args.children}</Spin>
        <Text typography='body4' lx={{ color: 'muted' }}>
          2000ms
        </Text>
      </View>
    </View>
  ),
};

export const WithSpinner: Story = {
  render: () => {
    return (
      <View style={{ flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <Spinner size={40} />
      </View>
    );
  },
};

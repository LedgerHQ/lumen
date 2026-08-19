import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { AmountDisplay } from '../../core/AmountDisplay';
import { type FormattedValue } from '../../core/AmountDisplay/types';
import { Box, Text } from '../../primitives';
import { Pulse } from './Pulse';

const usdFormatter = (value: number): FormattedValue => {
  const [integerPart, decimalPart] = value.toFixed(2).split(/\.|,/);

  return {
    integerPart,
    decimalPart,
    currencyText: '$',
    decimalSeparator: '.',
    currencyPosition: 'start',
  };
};

const meta = {
  id: 'rnative-pulse',
  title: 'Primitives/Pulse',
  component: Pulse,
} satisfies Meta<typeof Pulse>;

export default meta;
type Story = StoryObj<typeof Pulse>;

export const Base: Story = {
  args: {
    timing: { duration: 1000, easing: 'linear' },
    animate: true,
    children: (
      <Box lx={{ width: 's48', height: 's48', backgroundColor: 'accent' }} />
    ),
  },
};

export const DurationShowcase: Story = {
  args: {
    timing: { duration: 1000, easing: 'linear' },
    animate: true,
    children: (
      <Box lx={{ width: 's48', height: 's48', backgroundColor: 'accent' }} />
    ),
  },
  render: (args) => (
    <View style={{ flexDirection: 'row', gap: 24, alignItems: 'center' }}>
      <View style={{ alignItems: 'center', gap: 8 }}>
        <Pulse timing={{ ...args.timing, duration: 700 }} animate={true}>
          {args.children}
        </Pulse>
        <Text typography='body4' lx={{ color: 'muted' }}>
          700ms
        </Text>
      </View>
      <View style={{ alignItems: 'center', gap: 8 }}>
        <Pulse timing={{ ...args.timing, duration: 1000 }} animate={true}>
          {args.children}
        </Pulse>
        <Text typography='body4' lx={{ color: 'muted' }}>
          1000ms
        </Text>
      </View>
      <View style={{ alignItems: 'center', gap: 8 }}>
        <Pulse timing={{ ...args.timing, duration: 2000 }} animate={true}>
          {args.children}
        </Pulse>
        <Text typography='body4' lx={{ color: 'muted' }}>
          2000ms
        </Text>
      </View>
    </View>
  ),
};

export const WithAmountDisplay: Story = {
  args: {
    children: (
      <Box lx={{ width: 's48', height: 's48', backgroundColor: 'accent' }} />
    ),
  },
  render: () => {
    return (
      <View style={{ flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <AmountDisplay
          formatter={usdFormatter}
          value={1234.56}
          loading={true}
        />
      </View>
    );
  },
};

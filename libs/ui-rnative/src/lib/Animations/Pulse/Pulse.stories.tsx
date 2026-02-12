import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { AmountDisplay } from '../../Components/AmountDisplay';
import { type FormattedValue } from '../../Components/AmountDisplay/types';
import { Box, Text } from '../../Components/Utility';
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

const meta: Meta<typeof Pulse> = {
  title: 'Animations/Pulse',
  component: Pulse,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Pulse>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    duration: 2000,
    animate: true,
    children: (
      <Box lx={{ width: 's48', height: 's48', backgroundColor: 'accent' }} />
    ),
  },
};

export const DurationShowcase: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 24, alignItems: 'center' }}>
      <View style={{ alignItems: 'center', gap: 8 }}>
        <Pulse duration={1000} animate={true}>
          <Box
            lx={{ width: 's48', height: 's48', backgroundColor: 'accent' }}
          />
        </Pulse>
        <Text typography='body4' lx={{ color: 'muted' }}>
          1000ms
        </Text>
      </View>
      <View style={{ alignItems: 'center', gap: 8 }}>
        <Pulse duration={2000} animate={true}>
          <Box
            lx={{ width: 's48', height: 's48', backgroundColor: 'accent' }}
          />
        </Pulse>
        <Text typography='body4' lx={{ color: 'muted' }}>
          2000ms
        </Text>
      </View>
      <View style={{ alignItems: 'center', gap: 8 }}>
        <Pulse duration={3000} animate={true}>
          <Box
            lx={{ width: 's48', height: 's48', backgroundColor: 'accent' }}
          />
        </Pulse>
        <Text typography='body4' lx={{ color: 'muted' }}>
          3000ms
        </Text>
      </View>
    </View>
  ),
};

export const WithAmountDisplay: Story = {
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

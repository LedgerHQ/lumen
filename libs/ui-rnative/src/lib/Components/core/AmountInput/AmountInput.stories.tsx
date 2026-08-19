import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View } from 'react-native';
import { AmountInput } from './AmountInput';
import {
  type AmountInputAlign,
  type AmountInputProps,
  type AmountInputSize,
} from './types';

const ALIGNMENTS: AmountInputAlign[] = ['start', 'center', 'end'];

const SIZES: { size: AmountInputSize; value: string }[] = [
  { size: 'md', value: '1234.56' },
  { size: 'sm', value: '55 555' },
];

const meta = {
  component: AmountInput,
  id: 'rnative-amountinput',
  title: 'Core/AmountInput',
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'code',
      },
    },
  },
  argTypes: {
    isInvalid: {
      control: 'boolean',
      description: 'Marks the input as invalid for error styling.',
    },
  },
  args: {
    isInvalid: false,
  },
} satisfies Meta<typeof AmountInput>;

export default meta;
type Story = StoryObj<typeof AmountInput>;

const AmountInputStory = (args: AmountInputProps) => {
  const [value, setValue] = useState(args.value?.toString() ?? '');

  return (
    <View
      style={{
        flex: 1,
        minHeight: 96,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <View style={{ width: '100%', maxWidth: 320 }}>
        <AmountInput {...args} value={value} onChangeText={setValue} />
      </View>
    </View>
  );
};

export const Base: Story = {
  args: {
    value: '',
    onChangeText: () => {},
    currencyText: 'USD',
    currencyPosition: 'left',
    allowDecimals: true,
    thousandsSeparator: true,
    maxIntegerLength: 9,
    maxDecimalLength: 9,
    isInvalid: false,
    editable: true,
  },
  render: (args) => <AmountInputStory {...args} />,
};

export const WithValue: Story = {
  args: {
    value: '1234.56',
    onChangeText: () => {},
    currencyText: 'USD',
    currencyPosition: 'left',
    allowDecimals: true,
    thousandsSeparator: true,
    isInvalid: false,
    editable: true,
  },
  render: (args) => <AmountInputStory {...args} />,
};

export const Size: Story = {
  args: {
    value: '1234.56',
    onChangeText: () => {},
  },
  render: () => (
    <View
      style={{
        width: '100%',
        maxWidth: 320,
        alignItems: 'center',
        gap: 24,
        padding: 24,
      }}
    >
      {SIZES.map(({ size, value }) => (
        <AmountInput
          key={size}
          size={size}
          value={value}
          currencyText='$'
          onChangeText={() => {}}
        />
      ))}
    </View>
  ),
};

export const Alignment: Story = {
  args: {
    value: '1234.56',
    onChangeText: () => {},
  },
  render: () => (
    <View
      style={{
        width: '100%',
        maxWidth: 320,
        gap: 24,
        padding: 24,
      }}
    >
      {ALIGNMENTS.map((align) => (
        <AmountInput
          key={align}
          align={align}
          value='1234.56'
          currencyText='$'
          onChangeText={() => {}}
        />
      ))}
    </View>
  ),
};

export const CurrencyPositionLeft: Story = {
  args: {
    value: '1000',
    onChangeText: () => {},
    currencyText: '$',
    currencyPosition: 'left',
    allowDecimals: true,
    thousandsSeparator: true,
    isInvalid: false,
    editable: true,
  },
  render: (args) => <AmountInputStory {...args} />,
};

export const CurrencyPositionRight: Story = {
  args: {
    value: '1000',
    onChangeText: () => {},
    currencyText: 'ETH',
    currencyPosition: 'right',
    allowDecimals: true,
    thousandsSeparator: true,
    isInvalid: false,
    editable: true,
  },
  render: (args) => <AmountInputStory {...args} />,
};

export const IntegerOnly: Story = {
  args: {
    value: '1234',
    onChangeText: () => {},
    currencyText: 'items',
    currencyPosition: 'right',
    allowDecimals: false,
    thousandsSeparator: true,
    isInvalid: false,
    editable: true,
  },
  render: (args) => <AmountInputStory {...args} />,
};

export const WithThousandsSeparator: Story = {
  args: {
    value: '1000000',
    onChangeText: () => {},
    currencyText: 'USD',
    currencyPosition: 'left',
    allowDecimals: true,
    thousandsSeparator: true,
    isInvalid: false,
    editable: true,
  },
  render: (args) => <AmountInputStory {...args} />,
};

export const WithoutThousandsSeparator: Story = {
  args: {
    value: '1000000',
    onChangeText: () => {},
    currencyText: 'USD',
    currencyPosition: 'left',
    allowDecimals: true,
    thousandsSeparator: false,
    isInvalid: false,
    editable: true,
  },
  render: (args) => <AmountInputStory {...args} />,
};

export const DecimalSeparatorComma: Story = {
  args: {
    value: '1234.5',
    onChangeText: () => {},
    currencyText: '€',
    currencyPosition: 'right',
    allowDecimals: true,
    thousandsSeparator: true,
    decimalSeparator: ',',
    isInvalid: false,
    editable: true,
  },
  render: (args) => <AmountInputStory {...args} />,
};

export const ErrorState: Story = {
  args: {
    value: '1234.56',
    onChangeText: () => {},
    currencyText: 'USD',
    currencyPosition: 'left',
    allowDecimals: true,
    thousandsSeparator: true,
    isInvalid: true,
    editable: true,
  },
  render: (args) => <AmountInputStory {...args} />,
};

export const DisabledAmountInput: Story = {
  args: {
    value: '1234.56',
    onChangeText: () => {},
    currencyText: 'USD',
    currencyPosition: 'left',
    allowDecimals: true,
    thousandsSeparator: true,
    isInvalid: false,
    disabled: true,
  },
  render: (args) => <AmountInputStory {...args} />,
};

export const CustomLengthLimits: Story = {
  args: {
    value: '123',
    onChangeText: () => {},
    currencyText: '$',
    currencyPosition: 'left',
    allowDecimals: true,
    thousandsSeparator: true,
    maxIntegerLength: 6,
    maxDecimalLength: 2,
    isInvalid: false,
    editable: true,
  },
  render: (args) => <AmountInputStory {...args} />,
};

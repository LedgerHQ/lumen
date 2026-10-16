import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View } from 'react-native';
import { AmountInput } from './AmountInput';
import { type AmountInputAlign, type AmountInputSize } from './types';

const ALIGNMENTS: AmountInputAlign[] = ['start', 'center', 'end'];

const SIZES: { size: AmountInputSize; value: string }[] = [
  { size: 'md', value: '1234.56' },
  { size: 'sm', value: '55 555' },
];

const meta = {
  component: AmountInput,
  id: 'rnative-amountinput',
  title: 'Core/AmountInput',
  decorators: [
    (Story) => (
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
          <Story />
        </View>
      </View>
    ),
  ],
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

export const Base: Story = {
  args: {
    currencyText: 'USD',
    currencyPosition: 'left',
    allowDecimals: true,
    thousandsSeparator: true,
    maxIntegerLength: 9,
    maxDecimalLength: 9,
  },
  render: (args) => {
    const [value, setValue] = useState('');

    return <AmountInput {...args} value={value} onChangeText={setValue} />;
  },
};

export const WithValue: Story = {
  render: () => {
    const [value, setValue] = useState('1234.56');

    return (
      <AmountInput
        currencyText='USD'
        currencyPosition='left'
        allowDecimals
        thousandsSeparator
        value={value}
        onChangeText={setValue}
      />
    );
  },
};

export const Size: Story = {
  parameters: { docs: { source: { type: 'dynamic' } } },
  render: () => (
    <View style={{ width: '100%', alignItems: 'center', gap: 24 }}>
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
  parameters: { docs: { source: { type: 'dynamic' } } },
  render: () => (
    <View style={{ width: '100%', gap: 24 }}>
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
  render: () => {
    const [value, setValue] = useState('1000');

    return (
      <AmountInput
        currencyText='$'
        currencyPosition='left'
        allowDecimals
        thousandsSeparator
        value={value}
        onChangeText={setValue}
      />
    );
  },
};

export const CurrencyPositionRight: Story = {
  render: () => {
    const [value, setValue] = useState('1000');

    return (
      <AmountInput
        currencyText='ETH'
        currencyPosition='right'
        allowDecimals
        thousandsSeparator
        value={value}
        onChangeText={setValue}
      />
    );
  },
};

export const IntegerOnly: Story = {
  render: () => {
    const [value, setValue] = useState('1234');

    return (
      <AmountInput
        currencyText='items'
        currencyPosition='right'
        allowDecimals={false}
        thousandsSeparator
        value={value}
        onChangeText={setValue}
      />
    );
  },
};

export const WithThousandsSeparator: Story = {
  render: () => {
    const [value, setValue] = useState('1000000');

    return (
      <AmountInput
        currencyText='USD'
        currencyPosition='left'
        allowDecimals
        thousandsSeparator
        value={value}
        onChangeText={setValue}
      />
    );
  },
};

export const WithoutThousandsSeparator: Story = {
  render: () => {
    const [value, setValue] = useState('1000000');

    return (
      <AmountInput
        currencyText='USD'
        currencyPosition='left'
        allowDecimals
        thousandsSeparator={false}
        value={value}
        onChangeText={setValue}
      />
    );
  },
};

export const DecimalSeparatorComma: Story = {
  render: () => {
    const [value, setValue] = useState('1234.5');

    return (
      <AmountInput
        currencyText='€'
        currencyPosition='right'
        allowDecimals
        thousandsSeparator
        decimalSeparator=','
        value={value}
        onChangeText={setValue}
      />
    );
  },
};

export const ErrorState: Story = {
  render: () => {
    const [value, setValue] = useState('1234.56');

    return (
      <AmountInput
        currencyText='USD'
        currencyPosition='left'
        allowDecimals
        thousandsSeparator
        isInvalid
        value={value}
        onChangeText={setValue}
      />
    );
  },
};

export const DisabledAmountInput: Story = {
  render: () => {
    const [value, setValue] = useState('1234.56');

    return (
      <AmountInput
        currencyText='USD'
        currencyPosition='left'
        allowDecimals
        thousandsSeparator
        disabled
        value={value}
        onChangeText={setValue}
      />
    );
  },
};

export const CustomLengthLimits: Story = {
  render: () => {
    const [value, setValue] = useState('123');

    return (
      <AmountInput
        currencyText='$'
        currencyPosition='left'
        allowDecimals
        thousandsSeparator
        maxIntegerLength={6}
        maxDecimalLength={2}
        value={value}
        onChangeText={setValue}
      />
    );
  },
};

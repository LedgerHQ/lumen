import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View } from 'react-native';
import { AmountInput } from './AmountInput';
import { type AmountInputProps } from './types';

const meta: Meta<typeof AmountInput> = {
  component: AmountInput,
  title: 'Input/AmountInput',
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'code',
      },
    },
  },
};

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
  render: (args) => <AmountInputStory {...args} />,
  args: {
    currencyText: 'USD',
    currencyPosition: 'left',
    allowDecimals: true,
    thousandsSeparator: true,
    maxIntegerLength: 9,
    maxDecimalLength: 9,
    isInvalid: false,
    editable: true,
  },
};

export const WithValue: Story = {
  render: (args) => <AmountInputStory {...args} />,
  args: {
    value: '1234.56',
    currencyText: 'USD',
    currencyPosition: 'left',
    allowDecimals: true,
    thousandsSeparator: true,
    isInvalid: false,
    editable: true,
  },
};

export const CurrencyPositionLeft: Story = {
  render: (args) => <AmountInputStory {...args} />,
  args: {
    value: '1000',
    currencyText: '$',
    currencyPosition: 'left',
    allowDecimals: true,
    thousandsSeparator: true,
    isInvalid: false,
    editable: true,
  },
};

export const CurrencyPositionRight: Story = {
  render: (args) => <AmountInputStory {...args} />,
  args: {
    value: '1000',
    currencyText: 'ETH',
    currencyPosition: 'right',
    allowDecimals: true,
    thousandsSeparator: true,
    isInvalid: false,
    editable: true,
  },
};

export const IntegerOnly: Story = {
  render: (args) => <AmountInputStory {...args} />,
  args: {
    value: '1234',
    currencyText: 'items',
    currencyPosition: 'right',
    allowDecimals: false,
    thousandsSeparator: true,
    isInvalid: false,
    editable: true,
  },
};

export const WithThousandsSeparator: Story = {
  render: (args) => <AmountInputStory {...args} />,
  args: {
    value: '1000000',
    currencyText: 'USD',
    currencyPosition: 'left',
    allowDecimals: true,
    thousandsSeparator: true,
    isInvalid: false,
    editable: true,
  },
};

export const WithoutThousandsSeparator: Story = {
  render: (args) => <AmountInputStory {...args} />,
  args: {
    value: '1000000',
    currencyText: 'USD',
    currencyPosition: 'left',
    allowDecimals: true,
    thousandsSeparator: false,
    isInvalid: false,
    editable: true,
  },
};

export const ErrorState: Story = {
  render: (args) => <AmountInputStory {...args} />,
  args: {
    value: '1234.56',
    currencyText: 'USD',
    currencyPosition: 'left',
    allowDecimals: true,
    thousandsSeparator: true,
    isInvalid: true,
    editable: true,
  },
};

export const DisabledAmountInput: Story = {
  render: (args) => <AmountInputStory {...args} />,
  args: {
    value: '1234.56',
    currencyText: 'USD',
    currencyPosition: 'left',
    allowDecimals: true,
    thousandsSeparator: true,
    isInvalid: false,
    disabled: true,
  },
};

export const CustomLengthLimits: Story = {
  render: (args) => <AmountInputStory {...args} />,
  args: {
    value: '123',
    currencyText: '$',
    currencyPosition: 'left',
    allowDecimals: true,
    thousandsSeparator: true,
    maxIntegerLength: 6,
    maxDecimalLength: 2,
    isInvalid: false,
    editable: true,
  },
};

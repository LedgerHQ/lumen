import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Eye, EyeCross } from '../../Symbols';
import { IconButton } from '../IconButton';
import { AmountDisplay } from './AmountDisplay';
import { type FormattedValue } from './types';

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

const eurFormatter = (value: number): FormattedValue => {
  const [integerPart, decimalPart] = value.toFixed(2).split(/\.|,/);

  return {
    integerPart,
    decimalPart,
    currencyText: '€',
    decimalSeparator: ',',
    currencyPosition: 'end',
  };
};

const btcFormatter = (value: number): FormattedValue => {
  const [integerPart, decimalPart] = value.toFixed(8).split(/\.|,/);

  return {
    integerPart,
    decimalPart,
    currencyText: 'BTC',
    decimalSeparator: '.',
    currencyPosition: 'end',
  };
};

const meta: Meta<typeof AmountDisplay> = {
  component: AmountDisplay,
  title: 'Communication/AmountDisplay',
  args: {
    formatter: eurFormatter,
    hidden: false,
    animate: true,
  },
  argTypes: {
    formatter: {
      options: ['EUR', 'USD', 'BTC'],
      mapping: {
        USD: usdFormatter,
        EUR: eurFormatter,
        BTC: btcFormatter,
      },
      control: {
        type: 'select',
      },
      description:
        'Function that formats a number. Returns an object with:\n' +
        '- `integerPart`: string\n' +
        '- `decimalPart?`: string\n' +
        '- `currencyText`: string\n' +
        '- `decimalSeparator`: "." | ","\n' +
        '- `currencyPosition?`: "start" | "end"',
    },
    hidden: {
      control: {
        type: 'boolean',
      },
    },
    animate: {
      control: {
        type: 'boolean',
      },
    },
  },
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
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
type Story = StoryObj<typeof AmountDisplay>;

export const Base: Story = {
  args: {
    value: 1234.56,
  },
  parameters: {
    docs: {
      source: {
        code: `<AmountDisplay value={1234.56} />`,
      },
    },
  },
};

export const WithHideButton: Story = {
  render: (props) => {
    const [hidden, setHidden] = useState(false);

    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <AmountDisplay
          formatter={props.formatter}
          value={1234.56}
          hidden={hidden}
        />
        <IconButton
          appearance='transparent'
          size='sm'
          icon={hidden ? EyeCross : Eye}
          accessibilityLabel={hidden ? 'Show amount' : 'Hide amount'}
          onPress={() => setHidden((v) => !v)}
        />
      </View>
    );
  },
};

export const AnimationShowcase: Story = {
  args: {
    value: 1234.56,
  },
  render: (props) => {
    const [currentValue, setCurrentValue] = useState<number>(props.value);

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentValue((prev) => {
          const delta = prev * (Math.random() * 0.2 - 0.1);
          return Math.round((prev + delta) * 100) / 100;
        });
      }, 2000);

      return () => clearInterval(interval);
    }, []);

    return <AmountDisplay {...props} value={currentValue} />;
  },
};

export const Loading: Story = {
  render: (props) => {
    return (
      <AmountDisplay
        formatter={props.formatter}
        value={1234.56}
        loading={true}
      />
    );
  },
};

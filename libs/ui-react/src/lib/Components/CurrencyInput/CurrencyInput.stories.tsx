import { parseAmount } from '@ledgerhq/lumen-utils-shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { SegmentedControl, SegmentedControlButton } from '../SegmentedControl';
import { CurrencyInput } from './CurrencyInput';
import type { CurrencyInputAlign, CurrencyInputSize } from './types';

const ALIGNMENTS: CurrencyInputAlign[] = ['start', 'center', 'end'];

const SIZES: CurrencyInputSize[] = ['md', 'sm'];

type LocaleSeparators = { group: string; decimal: string };

type LocaleConfig = {
  label: string;
  separators: LocaleSeparators;
  currencyText: string;
  currencyPosition: 'left' | 'right';
};

const LOCALE_CONFIG: Record<string, LocaleConfig> = {
  'en-US': {
    label: 'US',
    separators: { group: ',', decimal: '.' },
    currencyText: '$',
    currencyPosition: 'left',
  },
  'fr-FR': {
    label: 'FR',
    separators: { group: ' ', decimal: ',' },
    currencyText: '€',
    currencyPosition: 'right',
  },
  'de-DE': {
    label: 'DE',
    separators: { group: '.', decimal: ',' },
    currencyText: '€',
    currencyPosition: 'right',
  },
};

/**
 * Turns the locale-formatted string into the canonical `.`-based value. After
 * removing group separators and normalizing the decimal to `.`, it delegates to
 * `parseAmount` for the canonical rules (leading zeros like `0,000.8888`, a
 * leading decimal like `.8888`, extra dots, and length limits).
 */
const makeLocaleParse =
  ({ group, decimal }: LocaleSeparators) =>
  (safe: string): string => {
    const withoutGroups = safe.split(group).join('');
    const dotted =
      decimal === '.' ? withoutGroups : withoutGroups.split(decimal).join('.');
    return parseAmount(dotted, {
      maxDecimalLength: Infinity,
      maxIntegerLength: Infinity,
    });
  };

/** Formats the canonical value with the active locale's grouping/decimal. */
const makeLocaleFormat =
  ({ group, decimal }: LocaleSeparators) =>
  (canonical: string): string => {
    if (canonical === '') return '';
    const [integerPart, ...rest] = canonical.split('.');
    const groupedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, group);
    if (!canonical.includes('.')) return groupedInteger;
    const decimalPart = rest.join('');
    return decimalPart
      ? `${groupedInteger}${decimal}${decimalPart}`
      : `${groupedInteger}${decimal}`;
  };

const meta = {
  id: 'react-currencyinput',
  title: 'Core/CurrencyInput',
  component: CurrencyInput<string>,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof CurrencyInput<string>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: '0',
    currencyText: '$',
    value: '',
    onChange: (value) => console.log('onChange', value),
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return <CurrencyInput {...args} value={value} onChange={setValue} />;
  },
};

export const WithRightCurrency: Story = {
  args: {
    placeholder: '0',
    currencyText: 'ETH',
    currencyPosition: 'right',
    value: '',
    onChange: (value) => console.log('onChange', value),
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return <CurrencyInput {...args} value={value} onChange={setValue} />;
  },
};

export const WithValue: Story = {
  args: {
    value: '1234.56',
    currencyText: '$',
    onChange: (value) => console.log('onChange', value),
    'aria-label': 'Input amount',
  },
};

export const Size: Story = {
  args: {
    value: '1234.56',
    onChange: (value) => console.log('onChange', value),
  },
  render: () => (
    <div className='flex w-560 flex-col gap-24'>
      {SIZES.map((size) => (
        <div key={size} className='w-full'>
          <CurrencyInput
            size={size}
            value='1234.56'
            currencyText='$'
            onChange={(value) => console.log('onChange', value)}
            aria-label='Input amount'
          />
        </div>
      ))}
    </div>
  ),
};

export const Alignment: Story = {
  args: {
    value: '1234.56',
    onChange: (value) => console.log('onChange', value),
  },
  render: () => (
    <div className='flex w-560 flex-col gap-24'>
      {ALIGNMENTS.map((align) => (
        <div key={align} className='w-full'>
          <CurrencyInput
            align={align}
            value='1234.56'
            currencyText='$'
            onChange={(value) => console.log('onChange', value)}
            aria-label='Input amount'
          />
        </div>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    value: '1234.56',
    currencyText: 'ETH',
    currencyPosition: 'right',
    disabled: true,
    onChange: (value) => console.log('onChange', value),
    'aria-label': 'Input amount',
  },
};

export const Error: Story = {
  args: {
    value: '1234.56',
    currencyText: '$',
    'aria-invalid': true,
    onChange: (value) => console.log('onChange', value),
    'aria-label': 'Input amount',
  },
};

export const LocaleFormatting: Story = {
  args: {
    value: '1234.5',
    onChange: (value) => console.log('onChange', value),
    'aria-label': 'Input amount',
  },
  render: () => {
    const [locale, setLocale] = useState('en-US');
    const [value, setValue] = useState('1234.5');
    const { separators, currencyText, currencyPosition } =
      LOCALE_CONFIG[locale];

    return (
      <div className='flex w-320 flex-col gap-24'>
        <SegmentedControl selectedValue={locale} onSelectedChange={setLocale}>
          {Object.entries(LOCALE_CONFIG).map(([key, { label }]) => (
            <SegmentedControlButton key={key} value={key}>
              {label}
            </SegmentedControlButton>
          ))}
        </SegmentedControl>

        <CurrencyInput
          value={value}
          onChange={setValue}
          parse={makeLocaleParse(separators)}
          format={makeLocaleFormat(separators)}
          currencyText={currencyText}
          currencyPosition={currencyPosition}
          placeholder='0'
          aria-label='Input amount'
        />

        <p className='text-center body-2 text-muted'>
          canonical value:{' '}
          <span className='body-2-semi-bold'>{value || '(empty)'}</span>
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Switch locale to change grouping and the decimal separator (US `1,234.5`, FR `1 234,5`, DE `1.234,56`). The canonical value emitted by `onChange` stays `.`-based (e.g. `"1234.5"`) regardless of locale — only `sanitize`/`parse`/`format` differ.',
      },
    },
  },
};

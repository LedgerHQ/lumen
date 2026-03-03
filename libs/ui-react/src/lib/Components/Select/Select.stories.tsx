import { CryptoIcon } from '@ledgerhq/crypto-icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Settings } from '../../Symbols';
import { Button } from '../Button';
import {
  Select,
  SelectLabel,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectGroup,
  SelectSeparator,
  SelectButtonTrigger,
} from './Select';

const meta: Meta<typeof Select> = {
  title: 'Selection/Select',
  component: Select,
  subcomponents: {
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectItemText,
    SelectGroup,
    SelectSeparator,
  },
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  argTypes: {
    children: {
      control: false,
    },
    open: {
      control: 'boolean',
    },
    defaultOpen: {
      control: 'boolean',
    },
    onOpenChange: {
      action: false,
    },
    value: {
      control: 'select',
      options: ['option 1', 'option 3'],
      mapping: {
        'option 1': 'option1',
        'option 3': 'option3',
      },
    },
    defaultValue: {
      control: false,
    },
    dir: {
      control: false,
    },
    name: {
      control: false,
    },
    required: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Base: Story = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <div className='w-400'>
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger label='Label' />
          <SelectContent>
            <SelectItem value='option1'>
              <SelectItemText>Option 1</SelectItemText>
            </SelectItem>
            <SelectItem value='option2' disabled textValue='Option 2 disabled'>
              <SelectItemText>Option 2 disabled</SelectItemText>
            </SelectItem>
            <SelectItem value='option3' textValue='Option 3'>
              <SelectItemText>Option 3</SelectItemText>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  },
  args: {
    disabled: false,
  },
};

export const WithGroups: Story = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <div className='w-400'>
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger label='Category' />
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value='apple'>
                <SelectItemText>Apple</SelectItemText>
              </SelectItem>
              <SelectItem value='banana'>
                <SelectItemText>Banana</SelectItemText>
              </SelectItem>
              <SelectItem value='orange'>
                <SelectItemText>Orange</SelectItemText>
              </SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Vegetables</SelectLabel>
              <SelectItem value='carrot'>
                <SelectItemText>Carrot</SelectItemText>
              </SelectItem>
              <SelectItem value='broccoli'>
                <SelectItemText>Broccoli</SelectItemText>
              </SelectItem>
              <SelectItem value='spinach'>
                <SelectItemText>Spinach</SelectItemText>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    );
  },
};

export const LongList: Story = {
  render: () => {
    const [value, setValue] = useState('');

    const countries = [
      'United States',
      'Canada',
      'Mexico',
      'United Kingdom',
      'France',
      'Germany',
      'Italy',
      'Spain',
      'Japan',
      'South Korea',
      'China',
      'India',
      'Australia',
      'New Zealand',
      'Brazil',
      'Argentina',
    ];

    return (
      <div className='w-208'>
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger label='Country' />
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country} value={country.toLowerCase()}>
                <SelectItemText>{country}</SelectItemText>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  },
};

// Disabled
export const Disabled: Story = {
  render: () => {
    return (
      <div className='w-208'>
        <Select disabled>
          <SelectTrigger label='Disabled' />
          <SelectContent>
            <SelectItem value='option1'>
              <SelectItemText>Option 1</SelectItemText>
            </SelectItem>
            <SelectItem value='option2'>
              <SelectItemText>Option 2</SelectItemText>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  },
};

// With Default Value
export const WithDefaultValue: Story = {
  render: () => {
    return (
      <div className='w-208'>
        <Select defaultValue='option2'>
          <SelectTrigger label='Label' />
          <SelectContent>
            <SelectItem value='option1'>
              <SelectItemText>Option 1</SelectItemText>
            </SelectItem>
            <SelectItem value='option2'>
              <SelectItemText>Option 2</SelectItemText>
            </SelectItem>
            <SelectItem value='option3'>
              <SelectItemText>Option 3</SelectItemText>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  },
};

export const WithDescription: Story = {
  render: () => {
    return (
      <div className='w-208'>
        <Select>
          <SelectTrigger label='Label' />
          <SelectContent>
            <SelectItem
              value='option1'
              className='flex flex-col items-start justify-start gap-4'
            >
              <SelectItemText>Option 1</SelectItemText>
              <div className='body-4 text-muted'>this is a description</div>
            </SelectItem>
            <SelectItem
              value='option2'
              className='flex flex-col items-start justify-start gap-4'
            >
              <SelectItemText>Option 2</SelectItemText>
              <div className='body-4 text-muted'>this is a description</div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  },
};

// Form Integration
export const FormIntegration: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      category: '',
      priority: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Form submitted:', formData);
      alert(
        `Form submitted:\nCategory: ${formData.category}\nPriority: ${formData.priority}`,
      );
    };

    return (
      <form onSubmit={handleSubmit} className='flex w-256 flex-col gap-16'>
        <Select
          value={formData.category}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, category: value }))
          }
          name='category'
          required
        >
          <SelectTrigger label='Category' />
          <SelectContent>
            <SelectItem value='tech'>
              <SelectItemText>Technology</SelectItemText>
            </SelectItem>
            <SelectItem value='design'>
              <SelectItemText>Design</SelectItemText>
            </SelectItem>
            <SelectItem value='business'>
              <SelectItemText>Business</SelectItemText>
            </SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={formData.priority}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, priority: value }))
          }
          name='priority'
          required
        >
          <SelectTrigger label='Priority' />
          <SelectContent>
            <SelectItem value='low'>
              <SelectItemText>Low</SelectItemText>
            </SelectItem>
            <SelectItem value='medium'>
              <SelectItemText>Medium</SelectItemText>
            </SelectItem>
            <SelectItem value='high'>
              <SelectItemText>High</SelectItemText>
            </SelectItem>
            <SelectItem value='urgent'>
              <SelectItemText>Urgent</SelectItemText>
            </SelectItem>
          </SelectContent>
        </Select>

        <Button appearance='accent' type='submit' isFull>
          Submit
        </Button>
      </form>
    );
  },
};

const cryptos = [
  { value: 'btc', label: 'Bitcoin', ledgerId: 'bitcoin', ticker: 'BTC' },
  { value: 'eth', label: 'Ethereum', ledgerId: 'ethereum', ticker: 'ETH' },
  { value: 'sol', label: 'Solana', ledgerId: 'solana', ticker: 'SOL' },
] as const;

export const TriggerShowcase: Story = {
  render: () => {
    const [buttonValue, setButtonValue] = useState('');
    const [iconValue, setIconValue] = useState('');
    const [cryptoValue, setCryptoValue] = useState('');
    const [customValue, setCustomValue] = useState('');
    const selectedCrypto = cryptos.find((c) => c.value === cryptoValue);
    const appearances = ['gray', 'transparent', 'no-background'] as const;

    return (
      <div
        className='flex flex-col gap-24 p-32'
        style={{
          backgroundImage:
            'linear-gradient(45deg, #f2f2f2 25%, transparent 25%), ' +
            'linear-gradient(-45deg, #f2f2f2 25%, transparent 25%), ' +
            'linear-gradient(45deg, transparent 75%, #f2f2f2 75%), ' +
            'linear-gradient(-45deg, transparent 75%, #f2f2f2 75%)',
          backgroundSize: '20px 20px',
        }}
      >
        <Select value={buttonValue} onValueChange={setButtonValue}>
          <SelectTrigger
            render={(renderProps) => (
              <SelectButtonTrigger {...renderProps} label='All accounts' />
            )}
          />
          <SelectContent className='w-208'>
            <SelectItem value='all'>
              <SelectItemText>All accounts</SelectItemText>
            </SelectItem>
            <SelectItem value='checking'>
              <SelectItemText>Checking</SelectItemText>
            </SelectItem>
            <SelectItem value='savings'>
              <SelectItemText>Savings</SelectItemText>
            </SelectItem>
          </SelectContent>
        </Select>

        <Select value={iconValue} onValueChange={setIconValue}>
          <SelectTrigger
            render={(renderProps) => (
              <SelectButtonTrigger
                {...renderProps}
                label='Settings'
                icon={<Settings size={20} />}
                iconType='flat'
              />
            )}
          />
          <SelectContent className='w-208'>
            <SelectItem value='general'>
              <SelectItemText>General</SelectItemText>
            </SelectItem>
            <SelectItem value='security'>
              <SelectItemText>Security</SelectItemText>
            </SelectItem>
            <SelectItem value='notifications'>
              <SelectItemText>Notifications</SelectItemText>
            </SelectItem>
          </SelectContent>
        </Select>

        <Select value={cryptoValue} onValueChange={setCryptoValue}>
          <SelectTrigger
            render={(renderProps) => (
              <SelectButtonTrigger
                {...renderProps}
                label='Network'
                icon={
                  selectedCrypto ? (
                    <CryptoIcon
                      ledgerId={selectedCrypto.ledgerId}
                      ticker={selectedCrypto.ticker}
                      size='32px'
                    />
                  ) : undefined
                }
                iconType='rounded'
              />
            )}
          />
          <SelectContent className='w-fit'>
            {cryptos.map((crypto) => (
              <SelectItem
                key={crypto.value}
                value={crypto.value}
                textValue={crypto.label}
                className='flex items-center gap-8'
              >
                <CryptoIcon
                  ledgerId={crypto.ledgerId}
                  ticker={crypto.ticker}
                  size='24px'
                />
                <SelectItemText>{crypto.label}</SelectItemText>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className='flex items-center gap-16'>
          {appearances.map((appearance) => (
            <Select key={appearance}>
              <SelectTrigger
                render={(renderProps) => (
                  <SelectButtonTrigger
                    {...renderProps}
                    label={appearance}
                    appearance={appearance}
                  />
                )}
              />
              <SelectContent className='w-208'>
                <SelectItem value='option1'>
                  <SelectItemText>Option 1</SelectItemText>
                </SelectItem>
                <SelectItem value='option2'>
                  <SelectItemText>Option 2</SelectItemText>
                </SelectItem>
              </SelectContent>
            </Select>
          ))}
        </div>

        <Select value={customValue} onValueChange={setCustomValue}>
          <SelectTrigger
            render={({ selectedValue, selectedContent }) => (
              <button className='flex items-center gap-8 rounded-sm bg-muted px-16 py-12 body-2 text-base hover:bg-muted-hover'>
                {selectedValue ? (
                  selectedContent
                ) : (
                  <span className='text-muted'>Pick an option…</span>
                )}
              </button>
            )}
          />
          <SelectContent>
            <SelectItem value='alpha'>
              <SelectItemText>Alpha</SelectItemText>
            </SelectItem>
            <SelectItem value='beta'>
              <SelectItemText>Beta</SelectItemText>
            </SelectItem>
            <SelectItem value='gamma'>
              <SelectItemText>Gamma</SelectItemText>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  },
};

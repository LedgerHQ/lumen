import { CryptoIcon } from '@ledgerhq/crypto-icons';
import { debounce } from '@ledgerhq/lumen-utils-shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Settings } from '../../Symbols';
import { Button } from '../Button';
import { MediaButton } from '../MediaButton';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectSearch,
  SelectList,
  SelectItem,
  SelectItemText,
  SelectItemContent,
  SelectItemDescription,
  SelectEmptyState,
} from './Select';
import type { SelectItemData } from './types';

const meta: Meta<typeof Select> = {
  title: 'Selection/Select',
  component: Select,
  subcomponents: {
    SelectTrigger,
    SelectContent,
    SelectSearch,
    SelectList,
    SelectItem,
    SelectItemText,
    SelectItemContent,
    SelectItemDescription,
    SelectEmptyState,
  },
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  argTypes: {
    children: { control: false },
    open: { control: 'boolean' },
    defaultOpen: { control: 'boolean' },
    onOpenChange: { action: false },
    value: { control: false },
    defaultValue: { control: false },
    name: { control: false },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

const baseOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2 disabled', disabled: true },
  { value: 'option3', label: 'Option 3' },
];

export const Base: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | null>(null);

    return (
      <div className='w-400'>
        <Select
          items={baseOptions}
          value={value}
          onValueChange={setValue}
          disabled={args.disabled}
        >
          <SelectTrigger label='Label' />
          <SelectContent>
            <SelectList
              renderItem={(item) => (
                <SelectItem
                  key={item.value}
                  value={item.value}
                  disabled={item.disabled}
                >
                  <SelectItemText>{item.label}</SelectItemText>
                </SelectItem>
              )}
            />
          </SelectContent>
        </Select>
      </div>
    );
  },
  args: {
    disabled: false,
  },
};

const produceItems: SelectItemData[] = [
  { value: 'apple', label: 'Apple', group: 'Fruits' },
  { value: 'banana', label: 'Banana', group: 'Fruits' },
  { value: 'orange', label: 'Orange', group: 'Fruits' },
  { value: 'carrot', label: 'Carrot', group: 'Vegetables' },
  { value: 'broccoli', label: 'Broccoli', group: 'Vegetables' },
  { value: 'spinach', label: 'Spinach', group: 'Vegetables' },
];

export const WithGroups: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>(null);

    return (
      <div className='w-400'>
        <Select items={produceItems} value={value} onValueChange={setValue}>
          <SelectTrigger label='Category' />
          <SelectContent>
            <SelectList
              renderItem={(item) => (
                <SelectItem key={item.value} value={item.value}>
                  <SelectItemText>{item.label}</SelectItemText>
                </SelectItem>
              )}
            />
          </SelectContent>
        </Select>
      </div>
    );
  },
};

export const WithGroupsAndSearch: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>(null);

    return (
      <div className='w-400'>
        <Select items={produceItems} value={value} onValueChange={setValue}>
          <SelectTrigger label='Category' />
          <SelectContent>
            <SelectSearch placeholder='Search produce' />
            <SelectList
              renderItem={(item) => (
                <SelectItem key={item.value} value={item.value}>
                  <SelectItemText>{item.label}</SelectItemText>
                </SelectItem>
              )}
            />
            <SelectEmptyState
              title='No results found'
              description='Try a different search term'
            />
          </SelectContent>
        </Select>
      </div>
    );
  },
};

const countryOptions = [
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
].map((name) => ({
  value: name.toLowerCase().replace(/ /g, '-'),
  label: name,
}));

export const LongList: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>(null);

    return (
      <div className='w-208'>
        <Select items={countryOptions} value={value} onValueChange={setValue}>
          <SelectTrigger label='Country' />
          <SelectContent>
            <SelectList
              renderItem={(item) => (
                <SelectItem key={item.value} value={item.value}>
                  <SelectItemText>{item.label}</SelectItemText>
                </SelectItem>
              )}
            />
          </SelectContent>
        </Select>
      </div>
    );
  },
};

export const WithSearch: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>(null);

    return (
      <div className='w-400'>
        <Select items={countryOptions} value={value} onValueChange={setValue}>
          <SelectTrigger label='Country' />
          <SelectContent>
            <SelectSearch placeholder='Search countries' />
            <SelectList
              renderItem={(item) => (
                <SelectItem key={item.value} value={item.value}>
                  <SelectItemText>{item.label}</SelectItemText>
                </SelectItem>
              )}
            />
            <SelectEmptyState
              title='No results found'
              description='Try a different search term'
            />
          </SelectContent>
        </Select>
      </div>
    );
  },
};

export const WithCustomFilter: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>(null);

    const tokenOptions: SelectItemData[] = [
      { value: 'btc', label: 'Bitcoin', meta: { ticker: 'BTC' } },
      { value: 'eth', label: 'Ethereum', meta: { ticker: 'ETH' } },
      { value: 'sol', label: 'Solana', meta: { ticker: 'SOL' } },
      { value: 'ada', label: 'Cardano', meta: { ticker: 'ADA' } },
      { value: 'dot', label: 'Polkadot', meta: { ticker: 'DOT' } },
      { value: 'avax', label: 'Avalanche', meta: { ticker: 'AVAX' } },
    ];

    return (
      <div className='w-400'>
        <Select
          items={tokenOptions}
          value={value}
          onValueChange={setValue}
          filter={(item, query) => {
            const q = query.toLowerCase();
            return (
              item.label.toLowerCase().includes(q) ||
              ((item.meta?.ticker as string) ?? '').toLowerCase().includes(q)
            );
          }}
        >
          <SelectTrigger label='Token' />
          <SelectContent>
            <SelectSearch placeholder='Search by name or ticker' />
            <SelectList
              renderItem={(item) => (
                <SelectItem key={item.value} value={item.value}>
                  <SelectItemContent>
                    <SelectItemText>{item.label}</SelectItemText>
                    <SelectItemDescription>
                      {item.meta?.ticker as string}
                    </SelectItemDescription>
                  </SelectItemContent>
                </SelectItem>
              )}
            />
            <SelectEmptyState
              title='No results found'
              description='Try a different search term'
            />
          </SelectContent>
        </Select>
      </div>
    );
  },
};

const simpleOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

export const Disabled: Story = {
  render: () => {
    return (
      <div className='w-208'>
        <Select items={simpleOptions} disabled>
          <SelectTrigger label='Disabled' />
          <SelectContent>
            <SelectList
              renderItem={(item) => (
                <SelectItem key={item.value} value={item.value}>
                  <SelectItemText>{item.label}</SelectItemText>
                </SelectItem>
              )}
            />
          </SelectContent>
        </Select>
      </div>
    );
  },
};

export const WithDefaultValue: Story = {
  render: () => {
    return (
      <div className='w-208'>
        <Select items={simpleOptions} defaultValue='option2'>
          <SelectTrigger label='Label' />
          <SelectContent>
            <SelectList
              renderItem={(item) => (
                <SelectItem key={item.value} value={item.value}>
                  <SelectItemText>{item.label}</SelectItemText>
                </SelectItem>
              )}
            />
          </SelectContent>
        </Select>
      </div>
    );
  },
};

const descriptionOptions = [
  { value: 'option1', label: 'Option 1', description: 'this is a description' },
  { value: 'option2', label: 'Option 2', description: 'this is a description' },
];

export const WithDescription: Story = {
  render: () => {
    return (
      <div className='w-208'>
        <Select items={descriptionOptions}>
          <SelectTrigger label='Label' />
          <SelectContent>
            <SelectList
              renderItem={(item) => (
                <SelectItem key={item.value} value={item.value}>
                  <SelectItemContent>
                    <SelectItemText>{item.label}</SelectItemText>
                    <SelectItemDescription>
                      {item.description}
                    </SelectItemDescription>
                  </SelectItemContent>
                </SelectItem>
              )}
            />
          </SelectContent>
        </Select>
      </div>
    );
  },
};

const categoryOptions = [
  { value: 'technology', label: 'Technology' },
  { value: 'design', label: 'Design' },
  { value: 'business', label: 'Business' },
];

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export const FormIntegration: Story = {
  render: () => {
    const [category, setCategory] = useState<string | null>(null);
    const [priority, setPriority] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      alert(`Form submitted:\nCategory: ${category}\nPriority: ${priority}`);
    };

    return (
      <form onSubmit={handleSubmit} className='flex w-256 flex-col gap-16'>
        <Select
          items={categoryOptions}
          value={category}
          onValueChange={setCategory}
          name='category'
          required
        >
          <SelectTrigger label='Category' />
          <SelectContent>
            <SelectList
              renderItem={(item) => (
                <SelectItem key={item.value} value={item.value}>
                  <SelectItemText>{item.label}</SelectItemText>
                </SelectItem>
              )}
            />
          </SelectContent>
        </Select>

        <Select
          items={priorityOptions}
          value={priority}
          onValueChange={setPriority}
          name='priority'
          required
        >
          <SelectTrigger label='Priority' />
          <SelectContent>
            <SelectList
              renderItem={(item) => (
                <SelectItem key={item.value} value={item.value}>
                  <SelectItemText>{item.label}</SelectItemText>
                </SelectItem>
              )}
            />
          </SelectContent>
        </Select>

        <Button appearance='accent' type='submit' isFull>
          Submit
        </Button>
      </form>
    );
  },
};

const cryptos: SelectItemData[] = [
  {
    value: 'btc',
    label: 'Bitcoin',
    meta: { ledgerId: 'bitcoin', ticker: 'BTC' },
  },
  {
    value: 'eth',
    label: 'Ethereum',
    meta: { ledgerId: 'ethereum', ticker: 'ETH' },
  },
  {
    value: 'sol',
    label: 'Solana',
    meta: { ledgerId: 'solana', ticker: 'SOL' },
  },
];

const accountOptions = [
  { value: 'all', label: 'All accounts' },
  { value: 'checking', label: 'Checking' },
  { value: 'savings', label: 'Savings' },
];

const settingsOptions = [
  { value: 'general', label: 'General' },
  { value: 'security', label: 'Security' },
  { value: 'notifications', label: 'Notifications' },
];

const appearanceOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

const greekOptions = [
  { value: 'alpha', label: 'Alpha' },
  { value: 'beta', label: 'Beta' },
  { value: 'gamma', label: 'Gamma' },
];

export const TriggerShowcase: Story = {
  render: () => {
    const [buttonValue, setButtonValue] = useState<string | null>(null);
    const [iconValue, setIconValue] = useState<string | null>(null);
    const [cryptoValue, setCryptoValue] = useState<string | null>(null);
    const [customValue, setCustomValue] = useState<string | null>(null);
    const appearances = ['gray', 'transparent', 'no-background'] as const;

    const selectedCrypto = cryptos.find((c) => c.value === cryptoValue);

    return (
      <div className='flex flex-col gap-24 p-32'>
        <Select
          items={accountOptions}
          value={buttonValue}
          onValueChange={setButtonValue}
        >
          <SelectTrigger
            render={({ selectedValue, selectedContent }) => (
              <MediaButton>
                {selectedValue ? selectedContent : 'All accounts'}
              </MediaButton>
            )}
          />
          <SelectContent className='w-128'>
            <SelectList
              renderItem={(item) => (
                <SelectItem key={item.value} value={item.value}>
                  <SelectItemText>{item.label}</SelectItemText>
                </SelectItem>
              )}
            />
          </SelectContent>
        </Select>

        <Select items={accountOptions} disabled>
          <SelectTrigger
            render={({ selectedValue, selectedContent }) => (
              <MediaButton>
                {selectedValue ? selectedContent : 'Disabled'}
              </MediaButton>
            )}
          />
          <SelectContent className='w-208'>
            <SelectList
              renderItem={(item) => (
                <SelectItem key={item.value} value={item.value}>
                  <SelectItemText>{item.label}</SelectItemText>
                </SelectItem>
              )}
            />
          </SelectContent>
        </Select>

        <Select
          items={settingsOptions}
          value={iconValue}
          onValueChange={setIconValue}
        >
          <SelectTrigger
            render={({ selectedValue, selectedContent }) => (
              <MediaButton icon={<Settings size={20} />} iconType='flat'>
                {selectedValue ? selectedContent : 'Settings'}
              </MediaButton>
            )}
          />
          <SelectContent className='w-208'>
            <SelectList
              renderItem={(item) => (
                <SelectItem key={item.value} value={item.value}>
                  <SelectItemText>{item.label}</SelectItemText>
                </SelectItem>
              )}
            />
          </SelectContent>
        </Select>

        <Select
          items={cryptos}
          value={cryptoValue}
          onValueChange={setCryptoValue}
        >
          <SelectTrigger
            render={({ selectedValue, selectedContent }) => (
              <MediaButton
                icon={
                  selectedCrypto ? (
                    <CryptoIcon
                      ledgerId={(selectedCrypto.meta?.ledgerId as string) ?? ''}
                      ticker={(selectedCrypto.meta?.ticker as string) ?? ''}
                      size='32px'
                    />
                  ) : undefined
                }
                iconType='rounded'
              >
                {selectedValue ? selectedContent : 'Network'}
              </MediaButton>
            )}
          />
          <SelectContent className='w-208'>
            <SelectList
              renderItem={(crypto) => (
                <SelectItem
                  key={crypto.value}
                  value={crypto.value}
                  className='flex items-center gap-8'
                >
                  <CryptoIcon
                    ledgerId={(crypto.meta?.ledgerId as string) ?? ''}
                    ticker={(crypto.meta?.ticker as string) ?? ''}
                    size='24px'
                  />
                  <SelectItemText>{crypto.label}</SelectItemText>
                </SelectItem>
              )}
            />
          </SelectContent>
        </Select>

        <div className='flex items-center gap-16'>
          {appearances.map((appearance) => (
            <Select key={appearance} items={appearanceOptions}>
              <SelectTrigger
                render={({ selectedValue, selectedContent }) => (
                  <MediaButton appearance={appearance}>
                    {selectedValue ? selectedContent : appearance}
                  </MediaButton>
                )}
              />
              <SelectContent className='w-208'>
                <SelectList
                  renderItem={(item) => (
                    <SelectItem key={item.value} value={item.value}>
                      <SelectItemText>{item.label}</SelectItemText>
                    </SelectItem>
                  )}
                />
              </SelectContent>
            </Select>
          ))}
        </div>

        <Select
          items={greekOptions}
          value={customValue}
          onValueChange={setCustomValue}
        >
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
            <SelectList
              renderItem={(item) => (
                <SelectItem key={item.value} value={item.value}>
                  <SelectItemText>{item.label}</SelectItemText>
                </SelectItem>
              )}
            />
          </SelectContent>
        </Select>
      </div>
    );
  },
};

const allReviewers: SelectItemData[] = [
  { value: 'alice-johnson', label: 'Alice Johnson' },
  { value: 'bob-smith', label: 'Bob Smith' },
  { value: 'charlie-brown', label: 'Charlie Brown' },
  { value: 'diana-prince', label: 'Diana Prince' },
  { value: 'edward-norton', label: 'Edward Norton' },
  { value: 'fiona-apple', label: 'Fiona Apple' },
  { value: 'george-martin', label: 'George Martin' },
  { value: 'hannah-montana', label: 'Hannah Montana' },
  { value: 'ivan-drago', label: 'Ivan Drago' },
  { value: 'julia-roberts', label: 'Julia Roberts' },
];

const simulateSearch = (query: string): Promise<SelectItemData[]> =>
  new Promise((resolve) => {
    setTimeout(() => {
      if (!query.trim()) {
        resolve(allReviewers);
        return;
      }
      resolve(
        allReviewers.filter((u) =>
          u.label.toLowerCase().includes(query.toLowerCase()),
        ),
      );
    }, 600);
  });

const cryptoItemsWithDescription: SelectItemData[] = [
  {
    value: 'btc',
    label: 'Bitcoin',
    description: 'BTC',
    meta: { ledgerId: 'bitcoin', ticker: 'BTC' },
  },
  {
    value: 'eth',
    label: 'Ethereum',
    description: 'ETH',
    meta: { ledgerId: 'ethereum', ticker: 'ETH' },
  },
  {
    value: 'sol',
    label: 'Solana',
    description: 'SOL',
    meta: { ledgerId: 'solana', ticker: 'SOL' },
  },
  {
    value: 'ada',
    label: 'Cardano',
    description: 'ADA',
    meta: { ledgerId: 'cardano', ticker: 'ADA' },
  },
];

export const LeadingContentShowcase: Story = {
  render: () => {
    const [smCoinValue, setSmCoinValue] = useState<string | null>(null);
    const [mdCoinValue, setMdCoinValue] = useState<string | null>(null);
    const [iconValue, setIconValue] = useState<string | null>(null);

    const iconOptions: SelectItemData[] = [
      { value: 'general', label: 'General', description: 'App preferences' },
      {
        value: 'security',
        label: 'Security',
        description: 'Privacy & security',
      },
      {
        value: 'notifications',
        label: 'Notifications',
        description: 'Alert settings',
      },
    ];

    return (
      <div className='flex flex-col gap-24 p-32'>
        <div className='w-400'>
          <p className='mb-8 body-3 text-muted'>Small coin (24px)</p>
          <Select
            items={cryptoItemsWithDescription}
            value={smCoinValue}
            onValueChange={setSmCoinValue}
          >
            <SelectTrigger label='Token' />
            <SelectContent>
              <SelectList
                renderItem={(item) => (
                  <SelectItem key={item.value} value={item.value}>
                    <CryptoIcon
                      ledgerId={(item.meta?.ledgerId as string) ?? ''}
                      ticker={(item.meta?.ticker as string) ?? ''}
                      size='24px'
                    />
                    <SelectItemText>{item.label}</SelectItemText>
                  </SelectItem>
                )}
              />
            </SelectContent>
          </Select>
        </div>

        <div className='w-400'>
          <p className='mb-8 body-3 text-muted'>Medium coin (32px)</p>
          <Select
            items={cryptoItemsWithDescription}
            value={mdCoinValue}
            onValueChange={setMdCoinValue}
          >
            <SelectTrigger label='Token' />
            <SelectContent>
              <SelectList
                renderItem={(item) => (
                  <SelectItem key={item.value} value={item.value}>
                    <CryptoIcon
                      ledgerId={(item.meta?.ledgerId as string) ?? ''}
                      ticker={(item.meta?.ticker as string) ?? ''}
                      size='32px'
                    />
                    <SelectItemContent>
                      <SelectItemText>{item.label}</SelectItemText>
                      <SelectItemDescription>
                        {item.description}
                      </SelectItemDescription>
                    </SelectItemContent>
                  </SelectItem>
                )}
              />
            </SelectContent>
          </Select>
        </div>

        <div className='w-400'>
          <p className='mb-8 body-3 text-muted'>Interface icon (20px)</p>
          <Select
            items={iconOptions}
            value={iconValue}
            onValueChange={setIconValue}
          >
            <SelectTrigger label='Settings' />
            <SelectContent>
              <SelectList
                renderItem={(item) => (
                  <SelectItem key={item.value} value={item.value}>
                    <Settings size={20} />
                    <SelectItemContent>
                      <SelectItemText>{item.label}</SelectItemText>
                      <SelectItemDescription>
                        {item.description}
                      </SelectItemDescription>
                    </SelectItemContent>
                  </SelectItem>
                )}
              />
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  },
};

export const ControlledSearch: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [filteredItems, setFilteredItems] =
      useState<SelectItemData[]>(allReviewers);
    const [loading, setLoading] = useState(false);
    const requestRef = useRef(0);

    const fetchResults = useCallback(async (query: string) => {
      const id = ++requestRef.current;
      setLoading(true);
      const results = await simulateSearch(query);
      if (id !== requestRef.current) return;
      setFilteredItems(results);
      setLoading(false);
    }, []);

    const debouncedFetch = useMemo(
      () => debounce(fetchResults, 300),
      [fetchResults],
    );

    const handleSearchValueChange = useCallback(
      (query: string) => {
        setSearch(query);
        debouncedFetch(query);
      },
      [debouncedFetch],
    );

    return (
      <div className='w-400'>
        <Select
          items={allReviewers}
          filteredItems={filteredItems}
          searchValue={search}
          onSearchValueChange={handleSearchValueChange}
          value={value}
          onValueChange={setValue}
        >
          <SelectTrigger label='Assign reviewer' />
          <SelectContent>
            <SelectSearch placeholder='Search users...' />
            <SelectList
              renderItem={(item) => (
                <SelectItem key={item.value} value={item.value}>
                  <SelectItemText>{item.label}</SelectItemText>
                </SelectItem>
              )}
            />
            <SelectEmptyState
              title={loading ? 'Searching…' : 'No results found'}
              description={loading ? undefined : 'Try a different search term'}
            />
          </SelectContent>
        </Select>
      </div>
    );
  },
};

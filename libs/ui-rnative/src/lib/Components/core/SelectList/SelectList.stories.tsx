import CryptoIcon from '@ledgerhq/crypto-icons/native';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { Box, Text } from '../../primitives';
import { Settings } from '../../symbols';
import { BottomSheet } from '../BottomSheet';
import { BottomSheetHeader } from '../BottomSheet/BottomSheetHeader';
import {
  BottomSheetScrollView,
  BottomSheetView,
} from '../BottomSheet/Scrollables';
import { useBottomSheetRef } from '../BottomSheet/useBottomSheetRef';
import { MediaButton } from '../MediaButton';
import { Spot } from '../Spot';
import { Tag } from '../Tag/Tag';
import {
  createSelectList,
  SelectList,
  SelectListContent,
  SelectListEmptyState,
  SelectListItem,
  SelectListItemLeading,
  SelectListItemContent,
  SelectListItemDescription,
  SelectListItemContentRow,
  SelectListSearch,
  SelectListTrigger,
  SelectListItemText,
} from './SelectList';
import type { SelectListItemData } from './types';

const meta = {
  component: SelectList,
  id: 'rnative-selectlist',
  title: 'Core/SelectList',
  subcomponents: {
    SelectListContent,
    SelectListItem,
    SelectListItemLeading,
    SelectListItemContent,
    SelectListItemText,
    SelectListItemDescription,
    SelectListItemContentRow,
    SelectListSearch,
    SelectListTrigger,
  },
  decorators: [
    (Story) => (
      <div>
        <Box
          lx={{
            flex: 1,
            padding: 's24',
            alignItems: 'flex-start',
            width: 's320',
            height: 's480',
          }}
        >
          <Story />
        </Box>
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'code',
      },
    },
  },
} satisfies Meta<typeof SelectList>;

export default meta;
type Story = StoryObj<typeof SelectList>;

const CURRENCIES: SelectListItemData[] = [
  {
    value: 'btc',
    label: 'Bitcoin',
    meta: { ticker: 'BTC', ledgerId: 'bitcoin' },
  },
  {
    value: 'eth',
    label: 'Ethereum',
    meta: { ticker: 'ETH', ledgerId: 'ethereum' },
  },
  {
    value: 'sol',
    label: 'Solana',
    meta: { ticker: 'SOL', ledgerId: 'solana' },
  },
  {
    value: 'dot',
    label: 'Polkadot',
    meta: { ticker: 'DOT', ledgerId: 'polkadot' },
  },
];

export const Base: Story = {
  args: {
    items: CURRENCIES,
    children: null,
  },
  render: () => {
    const [value, setValue] = useState<string | null>(null);
    const bottomSheetRef = useBottomSheetRef();
    const selected = CURRENCIES.find((c) => c.value === value);

    return (
      <>
        <SelectListTrigger
          label='Currency'
          onPress={() => bottomSheetRef.current?.present()}
        >
          {selected && <Text lx={{ color: 'base' }}>{selected.label}</Text>}
        </SelectListTrigger>
        <BottomSheet
          ref={bottomSheetRef}
          enableDynamicSizing
          snapPoints={null}
          onClose={() => bottomSheetRef.current?.dismiss()}
        >
          <BottomSheetView>
            <BottomSheetHeader title='Select currency' />
            <SelectList
              items={CURRENCIES}
              value={value}
              onValueChange={(v) => {
                setValue(v);
                bottomSheetRef.current?.dismiss();
              }}
            >
              <SelectListContent
                renderItem={(item) => {
                  const ticker = (item.meta as { ticker: string }).ticker;
                  return (
                    <SelectListItem value={item.value}>
                      <SelectListItemLeading>
                        <CryptoIcon
                          ledgerId={(item.meta?.ledgerId as string) ?? ''}
                          ticker={ticker}
                          size={32}
                        />
                      </SelectListItemLeading>
                      <SelectListItemContent>
                        <SelectListItemText>{item.label}</SelectListItemText>
                        <SelectListItemDescription>
                          {ticker}
                        </SelectListItemDescription>
                      </SelectListItemContent>
                    </SelectListItem>
                  );
                }}
              />
            </SelectList>
          </BottomSheetView>
        </BottomSheet>
      </>
    );
  },
};

const FOODS: SelectListItemData[] = [
  { value: 'apple', label: 'Apple', group: 'Fruits' },
  { value: 'banana', label: 'Banana', group: 'Fruits' },
  { value: 'orange', label: 'Orange', group: 'Fruits' },
  { value: 'carrot', label: 'Carrot', group: 'Vegetables' },
  { value: 'broccoli', label: 'Broccoli', group: 'Vegetables' },
  { value: 'spinach', label: 'Spinach', group: 'Vegetables' },
];

export const WithGroups: Story = {
  args: {
    items: FOODS,
    children: null,
  },
  render: () => {
    const [value, setValue] = useState<string | null>(null);
    const bottomSheetRef = useBottomSheetRef();
    const selected = FOODS.find((f) => f.value === value);

    return (
      <>
        <SelectListTrigger
          label='Food'
          onPress={() => bottomSheetRef.current?.present()}
        >
          {selected && <Text lx={{ color: 'base' }}>{selected.label}</Text>}
        </SelectListTrigger>
        <BottomSheet
          ref={bottomSheetRef}
          enableDynamicSizing
          snapPoints={null}
          onClose={() => bottomSheetRef.current?.dismiss()}
        >
          <BottomSheetScrollView>
            <BottomSheetHeader title='Pick a food' />
            <SelectList
              items={FOODS}
              value={value}
              onValueChange={(v) => {
                setValue(v);
                bottomSheetRef.current?.dismiss();
              }}
            >
              <SelectListContent
                renderItem={(item) => (
                  <SelectListItem value={item.value}>
                    <SelectListItemContent>
                      <SelectListItemText>{item.label}</SelectListItemText>
                    </SelectListItemContent>
                  </SelectListItem>
                )}
              />
            </SelectList>
          </BottomSheetScrollView>
        </BottomSheet>
      </>
    );
  },
};

const NETWORKS: SelectListItemData[] = [
  {
    value: 'ethereum',
    label: 'Ethereum',
    meta: { ticker: 'ETH', ledgerId: 'ethereum', tag: 'ERC-20' },
  },
  {
    value: 'polygon',
    label: 'Polygon',
    meta: { ticker: 'MATIC', ledgerId: 'polygon', tag: 'Layer 2' },
  },
  {
    value: 'arbitrum',
    label: 'Arbitrum',
    meta: { ticker: 'ARB', ledgerId: 'arbitrum', tag: 'Layer 2' },
  },
  {
    value: 'optimism',
    label: 'Optimism',
    meta: { ticker: 'OP', ledgerId: 'optimism', tag: 'Layer 2' },
  },
];

export const WithContentRow: Story = {
  args: {
    items: NETWORKS,
    children: null,
  },
  render: () => {
    const [value, setValue] = useState<string | null>(null);
    const bottomSheetRef = useBottomSheetRef();
    const selected = NETWORKS.find((n) => n.value === value);

    return (
      <>
        <SelectListTrigger
          label='Network'
          onPress={() => bottomSheetRef.current?.present()}
        >
          {selected && <Text lx={{ color: 'base' }}>{selected.label}</Text>}
        </SelectListTrigger>
        <BottomSheet
          ref={bottomSheetRef}
          enableDynamicSizing
          snapPoints={null}
          onClose={() => bottomSheetRef.current?.dismiss()}
        >
          <BottomSheetView>
            <BottomSheetHeader title='Select network' />
            <SelectList
              items={NETWORKS}
              value={value}
              onValueChange={(v) => {
                setValue(v);
                bottomSheetRef.current?.dismiss();
              }}
            >
              <SelectListContent
                renderItem={(item) => {
                  const meta = item.meta as {
                    ticker: string;
                    ledgerId: string;
                    tag: string;
                  };
                  return (
                    <SelectListItem value={item.value}>
                      <SelectListItemLeading>
                        <CryptoIcon
                          ledgerId={meta.ledgerId}
                          ticker={meta.ticker}
                          size={32}
                        />
                      </SelectListItemLeading>
                      <SelectListItemContent>
                        <SelectListItemContentRow>
                          <SelectListItemText>{item.label}</SelectListItemText>
                          <Tag label={meta.tag} appearance='gray' size='sm' />
                        </SelectListItemContentRow>
                        <SelectListItemDescription>
                          {meta.ticker}
                        </SelectListItemDescription>
                      </SelectListItemContent>
                    </SelectListItem>
                  );
                }}
              />
            </SelectList>
          </BottomSheetView>
        </BottomSheet>
      </>
    );
  },
};

const ACCOUNTS: SelectListItemData[] = [
  {
    value: 'savings',
    label: 'Savings Account',
    description: 'High-yield savings',
  },
  {
    value: 'checking',
    label: 'Checking Account',
    description: 'Primary checking',
    disabled: true,
  },
  { value: 'investment', label: 'Investment Account' },
  {
    value: 'retirement',
    label: 'Retirement Fund',
    description: 'Long-term growth',
    disabled: true,
  },
];

export const WithDisabledItems: Story = {
  args: {
    items: ACCOUNTS,
    children: null,
  },
  render: () => {
    const [value, setValue] = useState<string | null>(null);
    const bottomSheetRef = useBottomSheetRef();
    const selected = ACCOUNTS.find((a) => a.value === value);

    return (
      <>
        <SelectListTrigger
          label='Account'
          onPress={() => bottomSheetRef.current?.present()}
        >
          {selected && <Text lx={{ color: 'base' }}>{selected.label}</Text>}
        </SelectListTrigger>
        <BottomSheet
          ref={bottomSheetRef}
          enableDynamicSizing
          snapPoints={null}
          onClose={() => bottomSheetRef.current?.dismiss()}
        >
          <BottomSheetView>
            <BottomSheetHeader title='Select account' />
            <SelectList
              items={ACCOUNTS}
              value={value}
              onValueChange={(v) => {
                setValue(v);
                bottomSheetRef.current?.dismiss();
              }}
            >
              <SelectListContent
                renderItem={(item) => (
                  <SelectListItem value={item.value} disabled={item.disabled}>
                    <SelectListItemLeading>
                      <Spot appearance='icon' icon={Settings} />
                    </SelectListItemLeading>
                    <SelectListItemContent>
                      <SelectListItemText>{item.label}</SelectListItemText>
                      {item.description && (
                        <SelectListItemDescription>
                          {item.description}
                        </SelectListItemDescription>
                      )}
                    </SelectListItemContent>
                  </SelectListItem>
                )}
              />
            </SelectList>
          </BottomSheetView>
        </BottomSheet>
      </>
    );
  },
};

const GROUPED_NETWORKS: SelectListItemData[] = [
  {
    value: 'eth-main',
    label: 'Ethereum',
    group: 'Layer 1',
    meta: { ticker: 'ETH', ledgerId: 'ethereum', tag: 'Mainnet' },
  },
  {
    value: 'btc-main',
    label: 'Bitcoin',
    group: 'Layer 1',
    meta: { ticker: 'BTC', ledgerId: 'bitcoin', tag: 'Mainnet' },
  },
  {
    value: 'polygon',
    label: 'Polygon',
    group: 'Layer 2',
    meta: { ticker: 'MATIC', ledgerId: 'polygon', tag: 'Rollup' },
  },
  {
    value: 'arbitrum',
    label: 'Arbitrum',
    group: 'Layer 2',
    meta: { ticker: 'ARB', ledgerId: 'arbitrum', tag: 'Rollup' },
  },
  {
    value: 'optimism',
    label: 'Optimism',
    group: 'Layer 2',
    meta: { ticker: 'OP', ledgerId: 'optimism', tag: 'Rollup' },
  },
];

export const GroupedWithContentRow: Story = {
  args: {
    items: GROUPED_NETWORKS,
    children: null,
  },
  render: () => {
    const [value, setValue] = useState<string | null>(null);
    const bottomSheetRef = useBottomSheetRef();
    const selected = GROUPED_NETWORKS.find((n) => n.value === value);

    return (
      <>
        <SelectListTrigger
          label='Network'
          onPress={() => bottomSheetRef.current?.present()}
        >
          {selected && <Text lx={{ color: 'base' }}>{selected.label}</Text>}
        </SelectListTrigger>
        <BottomSheet
          ref={bottomSheetRef}
          enableDynamicSizing
          snapPoints={null}
          onClose={() => bottomSheetRef.current?.dismiss()}
        >
          <BottomSheetScrollView>
            <BottomSheetHeader title='Select network' />
            <SelectList
              items={GROUPED_NETWORKS}
              value={value}
              onValueChange={(v) => {
                setValue(v);
                bottomSheetRef.current?.dismiss();
              }}
            >
              <SelectListContent
                renderItem={(item) => {
                  const meta = item.meta as {
                    ticker: string;
                    ledgerId: string;
                    tag: string;
                  };
                  return (
                    <SelectListItem value={item.value}>
                      <SelectListItemLeading>
                        <CryptoIcon
                          ledgerId={meta.ledgerId}
                          ticker={meta.ticker}
                          size={32}
                        />
                      </SelectListItemLeading>
                      <SelectListItemContent>
                        <SelectListItemContentRow>
                          <SelectListItemText>{item.label}</SelectListItemText>
                          <Tag label={meta.tag} appearance='gray' size='sm' />
                        </SelectListItemContentRow>
                        <SelectListItemDescription>
                          {meta.ticker}
                        </SelectListItemDescription>
                      </SelectListItemContent>
                    </SelectListItem>
                  );
                }}
              />
            </SelectList>
          </BottomSheetScrollView>
        </BottomSheet>
      </>
    );
  },
};

export const WithSearch: Story = {
  args: {
    items: CURRENCIES,
    children: null,
  },
  render: () => {
    const [value, setValue] = useState<string | null>(null);
    const bottomSheetRef = useBottomSheetRef();
    const selected = CURRENCIES.find((c) => c.value === value);

    return (
      <>
        <SelectListTrigger
          label='Currency'
          onPress={() => bottomSheetRef.current?.present()}
        >
          {selected && <Text lx={{ color: 'base' }}>{selected.label}</Text>}
        </SelectListTrigger>
        <BottomSheet
          ref={bottomSheetRef}
          enableDynamicSizing
          snapPoints={null}
          onClose={() => bottomSheetRef.current?.dismiss()}
        >
          <BottomSheetView>
            <BottomSheetHeader title='Select currency' />
            <SelectList
              items={CURRENCIES}
              value={value}
              onValueChange={(v) => {
                setValue(v);
                bottomSheetRef.current?.dismiss();
              }}
            >
              <SelectListSearch placeholder='Search currencies' />
              <SelectListContent
                renderItem={(item) => {
                  const ticker = (item.meta as { ticker: string }).ticker;
                  return (
                    <SelectListItem value={item.value}>
                      <SelectListItemLeading>
                        <CryptoIcon
                          ledgerId={(item.meta?.ledgerId as string) ?? ''}
                          ticker={ticker}
                          size={32}
                        />
                      </SelectListItemLeading>
                      <SelectListItemContent>
                        <SelectListItemText>{item.label}</SelectListItemText>
                        <SelectListItemDescription>
                          {ticker}
                        </SelectListItemDescription>
                      </SelectListItemContent>
                    </SelectListItem>
                  );
                }}
              />
              <SelectListEmptyState
                title='No currencies found'
                description='Try a different search term'
              />
            </SelectList>
          </BottomSheetView>
        </BottomSheet>
      </>
    );
  },
};

export const WithSearchAndGroups: Story = {
  args: {
    items: GROUPED_NETWORKS,
    children: null,
  },
  render: () => {
    const [value, setValue] = useState<string | null>(null);
    const bottomSheetRef = useBottomSheetRef();
    const selected = GROUPED_NETWORKS.find((n) => n.value === value);

    return (
      <>
        <SelectListTrigger
          label='Network'
          onPress={() => bottomSheetRef.current?.present()}
        >
          {selected && <Text lx={{ color: 'base' }}>{selected.label}</Text>}
        </SelectListTrigger>
        <BottomSheet
          ref={bottomSheetRef}
          enableDynamicSizing
          snapPoints={null}
          onClose={() => bottomSheetRef.current?.dismiss()}
        >
          <BottomSheetScrollView>
            <BottomSheetHeader title='Select network' />
            <SelectList
              items={GROUPED_NETWORKS}
              value={value}
              onValueChange={(v) => {
                setValue(v);
                bottomSheetRef.current?.dismiss();
              }}
            >
              <SelectListSearch placeholder='Search networks' />
              <SelectListContent
                renderItem={(item) => (
                  <SelectListItem value={item.value}>
                    <SelectListItemContent>
                      <SelectListItemText>{item.label}</SelectListItemText>
                    </SelectListItemContent>
                  </SelectListItem>
                )}
              />
              <SelectListEmptyState title='No networks found' />
            </SelectList>
          </BottomSheetScrollView>
        </BottomSheet>
      </>
    );
  },
};

export const WithCustomSearchFilter: Story = {
  args: {
    items: CURRENCIES,
    children: null,
  },
  render: () => {
    const [value, setValue] = useState<string | null>(null);
    const bottomSheetRef = useBottomSheetRef();
    const selected = CURRENCIES.find((c) => c.value === value);

    return (
      <>
        <SelectListTrigger
          label='Currency'
          onPress={() => bottomSheetRef.current?.present()}
        >
          {selected && <Text lx={{ color: 'base' }}>{selected.label}</Text>}
        </SelectListTrigger>
        <BottomSheet
          ref={bottomSheetRef}
          enableDynamicSizing
          snapPoints={null}
          onClose={() => bottomSheetRef.current?.dismiss()}
        >
          <BottomSheetView>
            <BottomSheetHeader title='Select currency' />
            <SelectList
              items={CURRENCIES}
              value={value}
              onValueChange={(v) => {
                setValue(v);
                bottomSheetRef.current?.dismiss();
              }}
              filter={(item, query) => {
                const q = query.toLowerCase();
                const ticker = (item.meta as { ticker: string }).ticker;
                return (
                  item.label.toLowerCase().includes(q) ||
                  ticker.toLowerCase().includes(q)
                );
              }}
            >
              <SelectListSearch placeholder='Search by name or ticker' />
              <SelectListContent
                renderItem={(item) => {
                  const ticker = (item.meta as { ticker: string }).ticker;
                  return (
                    <SelectListItem value={item.value}>
                      <SelectListItemLeading>
                        <CryptoIcon
                          ledgerId={(item.meta?.ledgerId as string) ?? ''}
                          ticker={ticker}
                          size={32}
                        />
                      </SelectListItemLeading>
                      <SelectListItemContent>
                        <SelectListItemText>{item.label}</SelectListItemText>
                        <SelectListItemDescription>
                          {ticker}
                        </SelectListItemDescription>
                      </SelectListItemContent>
                    </SelectListItem>
                  );
                }}
              />
              <SelectListEmptyState title='No currencies found' />
            </SelectList>
          </BottomSheetView>
        </BottomSheet>
      </>
    );
  },
};

export const WithControlledSearch: Story = {
  args: {
    items: CURRENCIES,
    children: null,
  },
  render: () => {
    const [value, setValue] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState('');
    const bottomSheetRef = useBottomSheetRef();
    const selected = CURRENCIES.find((c) => c.value === value);

    return (
      <>
        <SelectListTrigger
          label='Currency'
          onPress={() => bottomSheetRef.current?.present()}
        >
          {selected && <Text lx={{ color: 'base' }}>{selected.label}</Text>}
        </SelectListTrigger>
        <BottomSheet
          ref={bottomSheetRef}
          enableDynamicSizing
          snapPoints={null}
          onClose={() => bottomSheetRef.current?.dismiss()}
        >
          <BottomSheetView>
            <BottomSheetHeader title='Select currency' />
            <Box lx={{ padding: 's8' }}>
              <Text lx={{ color: 'muted' }}>Search: "{searchValue}"</Text>
            </Box>
            <SelectList
              items={CURRENCIES}
              value={value}
              onValueChange={(v) => {
                setValue(v);
                bottomSheetRef.current?.dismiss();
              }}
              searchValue={searchValue}
              onSearchValueChange={setSearchValue}
            >
              <SelectListSearch placeholder='Search currencies' />
              <SelectListContent
                renderItem={(item) => {
                  const ticker = (item.meta as { ticker: string }).ticker;
                  return (
                    <SelectListItem value={item.value}>
                      <SelectListItemLeading>
                        <CryptoIcon
                          ledgerId={(item.meta?.ledgerId as string) ?? ''}
                          ticker={ticker}
                          size={32}
                        />
                      </SelectListItemLeading>
                      <SelectListItemContent>
                        <SelectListItemText>{item.label}</SelectListItemText>
                        <SelectListItemDescription>
                          {ticker}
                        </SelectListItemDescription>
                      </SelectListItemContent>
                    </SelectListItem>
                  );
                }}
              />
              <SelectListEmptyState title='No currencies found' />
            </SelectList>
          </BottomSheetView>
        </BottomSheet>
      </>
    );
  },
};

export const EmptyState: Story = {
  args: {
    items: [],
    children: null,
  },
  render: () => {
    const bottomSheetRef = useBottomSheetRef();

    return (
      <>
        <SelectListTrigger
          label='Currency'
          onPress={() => bottomSheetRef.current?.present()}
        />
        <BottomSheet
          ref={bottomSheetRef}
          enableDynamicSizing
          snapPoints={null}
          onClose={() => bottomSheetRef.current?.dismiss()}
        >
          <BottomSheetView>
            <BottomSheetHeader title='Select currency' />
            <SelectList items={[]} value={null}>
              <SelectListContent
                renderItem={(item) => (
                  <SelectListItem value={item.value}>
                    <SelectListItemContent>
                      <SelectListItemText>{item.label}</SelectListItemText>
                    </SelectListItemContent>
                  </SelectListItem>
                )}
              />
              <SelectListEmptyState
                title='No options available'
                description='There are no items to display'
              />
            </SelectList>
          </BottomSheetView>
        </BottomSheet>
      </>
    );
  },
};

const SIMPLE_OPTIONS: SelectListItemData[] = [
  { value: 'all', label: 'All accounts' },
  { value: 'savings', label: 'Savings' },
  { value: 'checking', label: 'Checking' },
];

const SETTINGS_OPTIONS: SelectListItemData[] = [
  { value: 'general', label: 'General' },
  { value: 'security', label: 'Security' },
  { value: 'notifications', label: 'Notifications' },
];

const appearances = ['gray', 'transparent', 'no-background'] as const;

const SimpleSelectListSheet = ({
  sheetRef,
  items,
  title,
  value,
  onValueChange,
}: {
  sheetRef: ReturnType<typeof useBottomSheetRef>;
  items: SelectListItemData[];
  title: string;
  value: string | null;
  onValueChange: (v: string | null) => void;
}) => (
  <BottomSheet
    ref={sheetRef}
    enableDynamicSizing
    snapPoints={null}
    onClose={() => sheetRef.current?.dismiss()}
  >
    <BottomSheetView>
      <BottomSheetHeader title={title} />
      <SelectList
        items={items}
        value={value}
        onValueChange={(v) => {
          onValueChange(v);
          sheetRef.current?.dismiss();
        }}
      >
        <SelectListContent
          renderItem={(item) => (
            <SelectListItem value={item.value}>
              <SelectListItemContent>
                <SelectListItemText>{item.label}</SelectListItemText>
              </SelectListItemContent>
            </SelectListItem>
          )}
        />
      </SelectList>
    </BottomSheetView>
  </BottomSheet>
);

export const TriggerShowcase: Story = {
  args: {
    items: SIMPLE_OPTIONS,
    children: null,
  },
  render: () => {
    const [buttonValue, setButtonValue] = useState<string | null>(null);
    const [iconValue, setIconValue] = useState<string | null>(null);
    const [cryptoValue, setCryptoValue] = useState<string | null>(null);
    const [appearanceValues, setAppearanceValues] = useState<
      Record<string, string | null>
    >({});
    const buttonRef = useBottomSheetRef();
    const iconRef = useBottomSheetRef();
    const cryptoRef = useBottomSheetRef();
    const appearanceRefs = {
      gray: useBottomSheetRef(),
      transparent: useBottomSheetRef(),
      'no-background': useBottomSheetRef(),
    };

    const selectedButton = SIMPLE_OPTIONS.find((o) => o.value === buttonValue);
    const selectedIcon = SETTINGS_OPTIONS.find((o) => o.value === iconValue);
    const selectedCrypto = CURRENCIES.find((c) => c.value === cryptoValue);

    return (
      <Box lx={{ gap: 's16', alignItems: 'flex-start' }}>
        <MediaButton
          appearance='gray'
          onPress={() => buttonRef.current?.present()}
        >
          {selectedButton?.label ?? 'All accounts'}
        </MediaButton>

        <MediaButton appearance='gray' disabled>
          Disabled
        </MediaButton>

        <MediaButton
          appearance='gray'
          onPress={() => iconRef.current?.present()}
          leadingContent={<Settings size={20} />}
          leadingContentShape='flat'
        >
          {selectedIcon?.label ?? 'Settings'}
        </MediaButton>

        <MediaButton
          appearance='gray'
          onPress={() => cryptoRef.current?.present()}
          leadingContent={
            selectedCrypto?.meta ? (
              <CryptoIcon
                ledgerId={selectedCrypto.meta.ledgerId as string}
                ticker={selectedCrypto.meta.ticker as string}
                size={32}
              />
            ) : undefined
          }
          leadingContentShape='rounded'
        >
          {selectedCrypto?.label ?? 'Network'}
        </MediaButton>

        <Box lx={{ flexDirection: 'row', gap: 's16' }}>
          {appearances.map((appearance) => {
            const selected = SIMPLE_OPTIONS.find(
              (o) => o.value === appearanceValues[appearance],
            );
            return (
              <MediaButton
                key={appearance}
                appearance={appearance}
                onPress={() => appearanceRefs[appearance].current?.present()}
              >
                {selected?.label ?? appearance}
              </MediaButton>
            );
          })}
        </Box>

        <SimpleSelectListSheet
          sheetRef={buttonRef}
          items={SIMPLE_OPTIONS}
          title='All accounts'
          value={buttonValue}
          onValueChange={setButtonValue}
        />
        <SimpleSelectListSheet
          sheetRef={iconRef}
          items={SETTINGS_OPTIONS}
          title='Settings'
          value={iconValue}
          onValueChange={setIconValue}
        />
        <BottomSheet
          ref={cryptoRef}
          enableDynamicSizing
          snapPoints={null}
          onClose={() => cryptoRef.current?.dismiss()}
        >
          <BottomSheetView>
            <BottomSheetHeader title='Select network' />
            <SelectList
              items={CURRENCIES}
              value={cryptoValue}
              onValueChange={(v) => {
                setCryptoValue(v);
                cryptoRef.current?.dismiss();
              }}
            >
              <SelectListContent
                renderItem={(item) => {
                  const ticker = (item.meta as { ticker: string }).ticker;
                  return (
                    <SelectListItem value={item.value}>
                      <SelectListItemLeading>
                        <CryptoIcon
                          ledgerId={(item.meta?.ledgerId as string) ?? ''}
                          ticker={ticker}
                          size={32}
                        />
                      </SelectListItemLeading>
                      <SelectListItemContent>
                        <SelectListItemText>{item.label}</SelectListItemText>
                        <SelectListItemDescription>
                          {ticker}
                        </SelectListItemDescription>
                      </SelectListItemContent>
                    </SelectListItem>
                  );
                }}
              />
            </SelectList>
          </BottomSheetView>
        </BottomSheet>
        {appearances.map((appearance) => (
          <SimpleSelectListSheet
            key={appearance}
            sheetRef={appearanceRefs[appearance]}
            items={SIMPLE_OPTIONS}
            title={appearance}
            value={appearanceValues[appearance] ?? null}
            onValueChange={(v) =>
              setAppearanceValues((prev) => ({ ...prev, [appearance]: v }))
            }
          />
        ))}
      </Box>
    );
  },
};

export const WithDefaultValue: Story = {
  args: {
    items: CURRENCIES,
    children: null,
  },
  render: () => (
    <Box lx={{ width: 's320' }}>
      <SelectList items={CURRENCIES} defaultValue='eth'>
        <SelectListContent
          renderItem={(item) => {
            const meta = item.meta as { ticker: string; ledgerId: string };
            return (
              <SelectListItem value={item.value}>
                <SelectListItemLeading>
                  <CryptoIcon
                    ledgerId={meta.ledgerId}
                    ticker={meta.ticker}
                    size={32}
                  />
                </SelectListItemLeading>
                <SelectListItemContent>
                  <SelectListItemText>{item.label}</SelectListItemText>
                  <SelectListItemDescription>
                    {meta.ticker}
                  </SelectListItemDescription>
                </SelectListItemContent>
              </SelectListItem>
            );
          }}
        />
      </SelectList>
    </Box>
  ),
};

type TypedNetwork = 'eth' | 'sol' | 'btc';
type TypedNetworkMeta = { ticker: string; ledgerId: string };
const NetworkList = createSelectList<TypedNetwork, TypedNetworkMeta>();

const TYPED_NETWORKS: SelectListItemData<TypedNetwork, TypedNetworkMeta>[] = [
  {
    value: 'eth',
    label: 'Ethereum',
    meta: { ticker: 'ETH', ledgerId: 'ethereum' },
  },
  {
    value: 'sol',
    label: 'Solana',
    meta: { ticker: 'SOL', ledgerId: 'solana' },
  },
  {
    value: 'btc',
    label: 'Bitcoin',
    meta: { ticker: 'BTC', ledgerId: 'bitcoin' },
  },
];

export const TypesafeFactory: Story = {
  args: {
    items: TYPED_NETWORKS,
    children: null,
  },
  render: () => {
    const [value, setValue] = useState<TypedNetwork | null>('eth');

    return (
      <Box lx={{ width: 's320' }}>
        <NetworkList.SelectList
          items={TYPED_NETWORKS}
          value={value}
          onValueChange={setValue}
        >
          <NetworkList.SelectListContent
            renderItem={({ value, label, meta }) =>
              meta ? (
                <NetworkList.SelectListItem value={value}>
                  <NetworkList.SelectListItemLeading>
                    <CryptoIcon
                      ledgerId={meta.ledgerId}
                      ticker={meta.ticker}
                      size={32}
                    />
                  </NetworkList.SelectListItemLeading>
                  <NetworkList.SelectListItemContent>
                    <NetworkList.SelectListItemText>
                      {label}
                    </NetworkList.SelectListItemText>
                    <NetworkList.SelectListItemDescription>
                      {meta.ticker}
                    </NetworkList.SelectListItemDescription>
                  </NetworkList.SelectListItemContent>
                </NetworkList.SelectListItem>
              ) : null
            }
          />
        </NetworkList.SelectList>
      </Box>
    );
  },
};

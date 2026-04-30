import { CryptoIcon } from '@ledgerhq/crypto-icons';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { Settings } from '../../Symbols';
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
import { Box, Text } from '../Utility';
import {
  OptionList,
  OptionListContent,
  OptionListEmptyState,
  OptionListItem,
  OptionListItemLeading,
  OptionListItemContent,
  OptionListItemDescription,
  OptionListItemContentRow,
  OptionListTrigger,
  OptionListItemText,
} from './OptionList';
import type { OptionListItemData } from './types';

const meta = {
  component: OptionList,
  title: 'Selection/OptionList',
  subcomponents: {
    OptionListContent,
    OptionListItem,
    OptionListItemLeading,
    OptionListItemContent,
    OptionListItemText,
    OptionListItemDescription,
    OptionListItemContentRow,
    OptionListTrigger,
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
} satisfies Meta<typeof OptionList>;

export default meta;
type Story = StoryObj<typeof OptionList>;

const CURRENCIES: OptionListItemData[] = [
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
  render: () => {
    const [value, setValue] = useState<string | null>(null);
    const bottomSheetRef = useBottomSheetRef();
    const selected = CURRENCIES.find((c) => c.value === value);

    return (
      <>
        <OptionListTrigger
          label='Currency'
          onPress={() => bottomSheetRef.current?.present()}
        >
          {selected && <Text lx={{ color: 'base' }}>{selected.label}</Text>}
        </OptionListTrigger>
        <BottomSheet
          ref={bottomSheetRef}
          enableDynamicSizing
          snapPoints={null}
          onClose={() => bottomSheetRef.current?.dismiss()}
        >
          <BottomSheetView>
            <BottomSheetHeader title='Select currency' />
            <OptionList
              items={CURRENCIES}
              value={value}
              onValueChange={(v) => {
                setValue(v);
                bottomSheetRef.current?.dismiss();
              }}
            >
              <OptionListContent
                renderItem={(item) => {
                  const ticker = (item.meta as { ticker: string }).ticker;
                  return (
                    <OptionListItem value={item.value}>
                      <OptionListItemLeading>
                        <CryptoIcon
                          ledgerId={(item.meta?.ledgerId as string) ?? ''}
                          ticker={ticker}
                          size={32}
                        />
                      </OptionListItemLeading>
                      <OptionListItemContent>
                        <OptionListItemText>{item.label}</OptionListItemText>
                        <OptionListItemDescription>
                          {ticker}
                        </OptionListItemDescription>
                      </OptionListItemContent>
                    </OptionListItem>
                  );
                }}
              />
            </OptionList>
          </BottomSheetView>
        </BottomSheet>
      </>
    );
  },
};

const FOODS: OptionListItemData[] = [
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
    const bottomSheetRef = useBottomSheetRef();
    const selected = FOODS.find((f) => f.value === value);

    return (
      <>
        <OptionListTrigger
          label='Food'
          onPress={() => bottomSheetRef.current?.present()}
        >
          {selected && <Text lx={{ color: 'base' }}>{selected.label}</Text>}
        </OptionListTrigger>
        <BottomSheet
          ref={bottomSheetRef}
          enableDynamicSizing
          snapPoints={null}
          onClose={() => bottomSheetRef.current?.dismiss()}
        >
          <BottomSheetScrollView>
            <BottomSheetHeader title='Pick a food' />
            <OptionList
              items={FOODS}
              value={value}
              onValueChange={(v) => {
                setValue(v);
                bottomSheetRef.current?.dismiss();
              }}
            >
              <OptionListContent
                renderItem={(item) => (
                  <OptionListItem value={item.value}>
                    <OptionListItemContent>
                      <OptionListItemText>{item.label}</OptionListItemText>
                    </OptionListItemContent>
                  </OptionListItem>
                )}
              />
            </OptionList>
          </BottomSheetScrollView>
        </BottomSheet>
      </>
    );
  },
};

const NETWORKS: OptionListItemData[] = [
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
  render: () => {
    const [value, setValue] = useState<string | null>(null);
    const bottomSheetRef = useBottomSheetRef();
    const selected = NETWORKS.find((n) => n.value === value);

    return (
      <>
        <OptionListTrigger
          label='Network'
          onPress={() => bottomSheetRef.current?.present()}
        >
          {selected && <Text lx={{ color: 'base' }}>{selected.label}</Text>}
        </OptionListTrigger>
        <BottomSheet
          ref={bottomSheetRef}
          enableDynamicSizing
          snapPoints={null}
          onClose={() => bottomSheetRef.current?.dismiss()}
        >
          <BottomSheetView>
            <BottomSheetHeader title='Select network' />
            <OptionList
              items={NETWORKS}
              value={value}
              onValueChange={(v) => {
                setValue(v);
                bottomSheetRef.current?.dismiss();
              }}
            >
              <OptionListContent
                renderItem={(item) => {
                  const meta = item.meta as {
                    ticker: string;
                    ledgerId: string;
                    tag: string;
                  };
                  return (
                    <OptionListItem value={item.value}>
                      <OptionListItemLeading>
                        <CryptoIcon
                          ledgerId={meta.ledgerId}
                          ticker={meta.ticker}
                          size={32}
                        />
                      </OptionListItemLeading>
                      <OptionListItemContent>
                        <OptionListItemContentRow>
                          <OptionListItemText>{item.label}</OptionListItemText>
                          <Tag label={meta.tag} appearance='gray' size='sm' />
                        </OptionListItemContentRow>
                        <OptionListItemDescription>
                          {meta.ticker}
                        </OptionListItemDescription>
                      </OptionListItemContent>
                    </OptionListItem>
                  );
                }}
              />
            </OptionList>
          </BottomSheetView>
        </BottomSheet>
      </>
    );
  },
};

const ACCOUNTS: OptionListItemData[] = [
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
  render: () => {
    const [value, setValue] = useState<string | null>(null);
    const bottomSheetRef = useBottomSheetRef();
    const selected = ACCOUNTS.find((a) => a.value === value);

    return (
      <>
        <OptionListTrigger
          label='Account'
          onPress={() => bottomSheetRef.current?.present()}
        >
          {selected && <Text lx={{ color: 'base' }}>{selected.label}</Text>}
        </OptionListTrigger>
        <BottomSheet
          ref={bottomSheetRef}
          enableDynamicSizing
          snapPoints={null}
          onClose={() => bottomSheetRef.current?.dismiss()}
        >
          <BottomSheetView>
            <BottomSheetHeader title='Select account' />
            <OptionList
              items={ACCOUNTS}
              value={value}
              onValueChange={(v) => {
                setValue(v);
                bottomSheetRef.current?.dismiss();
              }}
            >
              <OptionListContent
                renderItem={(item) => (
                  <OptionListItem value={item.value} disabled={item.disabled}>
                    <OptionListItemLeading>
                      <Spot appearance='icon' icon={Settings} />
                    </OptionListItemLeading>
                    <OptionListItemContent>
                      <OptionListItemText>{item.label}</OptionListItemText>
                      {item.description && (
                        <OptionListItemDescription>
                          {item.description}
                        </OptionListItemDescription>
                      )}
                    </OptionListItemContent>
                  </OptionListItem>
                )}
              />
            </OptionList>
          </BottomSheetView>
        </BottomSheet>
      </>
    );
  },
};

const GROUPED_NETWORKS: OptionListItemData[] = [
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
  render: () => {
    const [value, setValue] = useState<string | null>(null);
    const bottomSheetRef = useBottomSheetRef();
    const selected = GROUPED_NETWORKS.find((n) => n.value === value);

    return (
      <>
        <OptionListTrigger
          label='Network'
          onPress={() => bottomSheetRef.current?.present()}
        >
          {selected && <Text lx={{ color: 'base' }}>{selected.label}</Text>}
        </OptionListTrigger>
        <BottomSheet
          ref={bottomSheetRef}
          enableDynamicSizing
          snapPoints={null}
          onClose={() => bottomSheetRef.current?.dismiss()}
        >
          <BottomSheetScrollView>
            <BottomSheetHeader title='Select network' />
            <OptionList
              items={GROUPED_NETWORKS}
              value={value}
              onValueChange={(v) => {
                setValue(v);
                bottomSheetRef.current?.dismiss();
              }}
            >
              <OptionListContent
                renderItem={(item) => {
                  const meta = item.meta as {
                    ticker: string;
                    ledgerId: string;
                    tag: string;
                  };
                  return (
                    <OptionListItem value={item.value}>
                      <OptionListItemLeading>
                        <CryptoIcon
                          ledgerId={meta.ledgerId}
                          ticker={meta.ticker}
                          size={32}
                        />
                      </OptionListItemLeading>
                      <OptionListItemContent>
                        <OptionListItemContentRow>
                          <OptionListItemText>{item.label}</OptionListItemText>
                          <Tag label={meta.tag} appearance='gray' size='sm' />
                        </OptionListItemContentRow>
                        <OptionListItemDescription>
                          {meta.ticker}
                        </OptionListItemDescription>
                      </OptionListItemContent>
                    </OptionListItem>
                  );
                }}
              />
            </OptionList>
          </BottomSheetScrollView>
        </BottomSheet>
      </>
    );
  },
};

export const EmptyState: Story = {
  render: () => {
    const bottomSheetRef = useBottomSheetRef();

    return (
      <>
        <OptionListTrigger
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
            <OptionList items={[]} value={null}>
              <OptionListContent
                renderItem={(item) => (
                  <OptionListItem value={item.value}>
                    <OptionListItemContent>
                      <OptionListItemText>{item.label}</OptionListItemText>
                    </OptionListItemContent>
                  </OptionListItem>
                )}
              />
              <OptionListEmptyState
                title='No options available'
                description='There are no items to display'
              />
            </OptionList>
          </BottomSheetView>
        </BottomSheet>
      </>
    );
  },
};

const SIMPLE_OPTIONS: OptionListItemData[] = [
  { value: 'all', label: 'All accounts' },
  { value: 'savings', label: 'Savings' },
  { value: 'checking', label: 'Checking' },
];

const SETTINGS_OPTIONS: OptionListItemData[] = [
  { value: 'general', label: 'General' },
  { value: 'security', label: 'Security' },
  { value: 'notifications', label: 'Notifications' },
];

const appearances = ['gray', 'transparent', 'no-background'] as const;

const SimpleOptionListSheet = ({
  sheetRef,
  items,
  title,
  value,
  onValueChange,
}: {
  sheetRef: ReturnType<typeof useBottomSheetRef>;
  items: OptionListItemData[];
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
      <OptionList
        items={items}
        value={value}
        onValueChange={(v) => {
          onValueChange(v);
          sheetRef.current?.dismiss();
        }}
      >
        <OptionListContent
          renderItem={(item) => (
            <OptionListItem value={item.value}>
              <OptionListItemContent>
                <OptionListItemText>{item.label}</OptionListItemText>
              </OptionListItemContent>
            </OptionListItem>
          )}
        />
      </OptionList>
    </BottomSheetView>
  </BottomSheet>
);

export const TriggerShowcase: Story = {
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
          icon={<Settings size={20} />}
          iconType='flat'
        >
          {selectedIcon?.label ?? 'Settings'}
        </MediaButton>

        <MediaButton
          appearance='gray'
          onPress={() => cryptoRef.current?.present()}
          icon={
            selectedCrypto?.meta ? (
              <CryptoIcon
                ledgerId={selectedCrypto.meta.ledgerId as string}
                ticker={selectedCrypto.meta.ticker as string}
                size={32}
              />
            ) : undefined
          }
          iconType='rounded'
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

        <SimpleOptionListSheet
          sheetRef={buttonRef}
          items={SIMPLE_OPTIONS}
          title='All accounts'
          value={buttonValue}
          onValueChange={setButtonValue}
        />
        <SimpleOptionListSheet
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
            <OptionList
              items={CURRENCIES}
              value={cryptoValue}
              onValueChange={(v) => {
                setCryptoValue(v);
                cryptoRef.current?.dismiss();
              }}
            >
              <OptionListContent
                renderItem={(item) => {
                  const ticker = (item.meta as { ticker: string }).ticker;
                  return (
                    <OptionListItem value={item.value}>
                      <OptionListItemLeading>
                        <CryptoIcon
                          ledgerId={(item.meta?.ledgerId as string) ?? ''}
                          ticker={ticker}
                          size={32}
                        />
                      </OptionListItemLeading>
                      <OptionListItemContent>
                        <OptionListItemText>{item.label}</OptionListItemText>
                        <OptionListItemDescription>
                          {ticker}
                        </OptionListItemDescription>
                      </OptionListItemContent>
                    </OptionListItem>
                  );
                }}
              />
            </OptionList>
          </BottomSheetView>
        </BottomSheet>
        {appearances.map((appearance) => (
          <SimpleOptionListSheet
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
  render: () => (
    <Box lx={{ width: 's320' }}>
      <OptionList items={CURRENCIES} defaultValue='eth'>
        <OptionListContent
          renderItem={(item) => {
            const meta = item.meta as { ticker: string; ledgerId: string };
            return (
              <OptionListItem value={item.value}>
                <OptionListItemLeading>
                  <CryptoIcon
                    ledgerId={meta.ledgerId}
                    ticker={meta.ticker}
                    size={32}
                  />
                </OptionListItemLeading>
                <OptionListItemContent>
                  <OptionListItemText>{item.label}</OptionListItemText>
                  <OptionListItemDescription>
                    {meta.ticker}
                  </OptionListItemDescription>
                </OptionListItemContent>
              </OptionListItem>
            );
          }}
        />
      </OptionList>
    </Box>
  ),
};

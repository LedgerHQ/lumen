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
import { Spot } from '../Spot';
import { Tag } from '../Tag/Tag';
import { TriggerButton } from '../TriggerButton';
import { Box, Text } from '../Utility';
import {
  OptionList,
  OptionListContent,
  OptionListEmptyState,
  OptionListItem,
  OptionListItemLeading,
  OptionListItemContent,
  OptionListItemTitle,
  OptionListItemDescription,
  OptionListItemContentRow,
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
    OptionListItemTitle,
    OptionListItemDescription,
    OptionListItemContentRow,
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
            height: 's320',
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
        <TriggerButton
          appearance='gray'
          onPress={() => bottomSheetRef.current?.present()}
          icon={
            selected?.meta ? (
              <CryptoIcon
                ledgerId={selected.meta.ledgerId}
                ticker={selected.meta.ticker}
                size='32px'
              />
            ) : undefined
          }
          iconType='rounded'
        >
          {selected?.label ?? 'Select currency'}
        </TriggerButton>
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
                          ledgerId={item.meta?.ledgerId ?? ''}
                          ticker={ticker}
                          size='32px'
                        />
                      </OptionListItemLeading>
                      <OptionListItemContent>
                        <OptionListItemTitle>{item.label}</OptionListItemTitle>
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
        <TriggerButton
          appearance='gray'
          onPress={() => bottomSheetRef.current?.present()}
        >
          {selected?.label ?? 'Pick a food'}
        </TriggerButton>
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
                      <OptionListItemTitle>{item.label}</OptionListItemTitle>
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
        <TriggerButton
          appearance='gray'
          onPress={() => bottomSheetRef.current?.present()}
          icon={
            selected?.meta ? (
              <CryptoIcon
                ledgerId={selected.meta.ledgerId}
                ticker={selected.meta.ticker}
                size='32px'
              />
            ) : undefined
          }
          iconType='rounded'
        >
          {selected?.label ?? 'Select network'}
        </TriggerButton>
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
                          size='32px'
                        />
                      </OptionListItemLeading>
                      <OptionListItemContent>
                        <OptionListItemContentRow>
                          <OptionListItemTitle>
                            {item.label}
                          </OptionListItemTitle>
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
  { value: 'savings', label: 'Savings Account' },
  { value: 'checking', label: 'Checking Account', disabled: true },
  { value: 'investment', label: 'Investment Account' },
  { value: 'retirement', label: 'Retirement Fund', disabled: true },
];

export const WithDisabledItems: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>(null);
    const bottomSheetRef = useBottomSheetRef();
    const selected = ACCOUNTS.find((a) => a.value === value);

    return (
      <>
        <TriggerButton
          appearance='gray'
          onPress={() => bottomSheetRef.current?.present()}
        >
          {selected?.label ?? 'Select account'}
        </TriggerButton>
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
                      <OptionListItemTitle>{item.label}</OptionListItemTitle>
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
        <TriggerButton
          appearance='gray'
          onPress={() => bottomSheetRef.current?.present()}
          icon={
            selected?.meta ? (
              <CryptoIcon
                ledgerId={selected.meta.ledgerId}
                ticker={selected.meta.ticker}
                size='32px'
              />
            ) : undefined
          }
          iconType='rounded'
        >
          {selected?.label ?? 'Select network'}
        </TriggerButton>
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
                          size='32px'
                        />
                      </OptionListItemLeading>
                      <OptionListItemContent>
                        <OptionListItemContentRow>
                          <OptionListItemTitle>
                            {item.label}
                          </OptionListItemTitle>
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
        <TriggerButton
          appearance='gray'
          onPress={() => bottomSheetRef.current?.present()}
        >
          Select currency
        </TriggerButton>
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
                      <OptionListItemTitle>{item.label}</OptionListItemTitle>
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

export const Standalone: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>(null);

    return (
      <Box lx={{ width: 's320' }}>
        <Text lx={{ marginBottom: 's12' }}>Selected: {value ?? 'none'}</Text>
        <OptionList items={CURRENCIES} value={value} onValueChange={setValue}>
          <OptionListContent
            renderItem={(item) => {
              const meta = item.meta as { ticker: string; ledgerId: string };
              return (
                <OptionListItem value={item.value}>
                  <OptionListItemLeading>
                    <CryptoIcon
                      ledgerId={meta.ledgerId}
                      ticker={meta.ticker}
                      size='32px'
                    />
                  </OptionListItemLeading>
                  <OptionListItemContent>
                    <OptionListItemTitle>{item.label}</OptionListItemTitle>
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
    );
  },
};

import CryptoIconNative from '@ledgerhq/crypto-icons/native';
import type { OptionListItemData } from '@ledgerhq/lumen-ui-rnative';
import {
  MediaButton,
  createOptionList,
  Tag,
  Box,
  useBottomSheetRef,
  BottomSheet,
  BottomSheetHeader,
  BottomSheetView,
} from '@ledgerhq/lumen-ui-rnative';
import { useState } from 'react';

type Currency = 'btc' | 'eth';
type CryptoMeta = { ticker: string; icon: string };

const {
  OptionList: CurrencyList,
  OptionListContent: CurrencyListContent,
  OptionListItem: CurrencyListItem,
  OptionListItemLeading: CurrencyListItemLeading,
  OptionListItemContent: CurrencyListItemContent,
  OptionListItemText: CurrencyListItemText,
  OptionListItemDescription: CurrencyListItemDescription,
} = createOptionList<Currency, CryptoMeta>();

const CURRENCIES: OptionListItemData<Currency, CryptoMeta>[] = [
  {
    value: 'btc',
    label: 'Bitcoin',
    meta: { ticker: 'BTC', icon: 'bitcoin' },
  },
  {
    value: 'eth',
    label: 'Ethereum',
    meta: { ticker: 'ETH', icon: 'ethereum' },
  },
];

const CurrencySelectExample = () => {
  const [value, setValue] = useState<Currency | null>(null);
  const bottomSheetRef = useBottomSheetRef();

  const selected = CURRENCIES.find((c) => c.value === value);

  return (
    <Box>
      <MediaButton
        leadingContent={
          selected?.meta ? (
            <CryptoIconNative
              ledgerId={selected.meta.icon}
              ticker={selected.meta.ticker}
              size={32}
            />
          ) : undefined
        }
        appearance='gray'
        onPress={() => bottomSheetRef.current?.present()}
      >
        {selected?.label ?? 'Currency'}
      </MediaButton>
      <BottomSheet
        ref={bottomSheetRef}
        enableDynamicSizing
        snapPoints={null}
        onClose={() => bottomSheetRef.current?.dismiss()}
      >
        <BottomSheetView>
          <BottomSheetHeader title='Select currency' />
          <CurrencyList
            items={CURRENCIES}
            value={value}
            onValueChange={(v) => {
              setValue(v);
              bottomSheetRef.current?.dismiss();
            }}
          >
            <CurrencyListContent
              renderItem={({ value, label, meta }) =>
                meta ? (
                  <CurrencyListItem value={value}>
                    <CurrencyListItemLeading>
                      <CryptoIconNative
                        ledgerId={meta.icon}
                        ticker={meta.ticker}
                        size={32}
                      />
                    </CurrencyListItemLeading>
                    <CurrencyListItemContent>
                      <CurrencyListItemText>{label}</CurrencyListItemText>
                      <CurrencyListItemDescription>
                        {meta.ticker}
                      </CurrencyListItemDescription>
                    </CurrencyListItemContent>
                  </CurrencyListItem>
                ) : null
              }
            />
          </CurrencyList>
        </BottomSheetView>
      </BottomSheet>
    </Box>
  );
};

type Food = 'apple' | 'banana' | 'orange' | 'carrot' | 'broccoli' | 'spinach';

const {
  OptionList: FoodList,
  OptionListContent: FoodListContent,
  OptionListItem: FoodListItem,
  OptionListItemContent: FoodListItemContent,
  OptionListItemText: FoodListItemText,
} = createOptionList<Food>();

const FOODS: OptionListItemData<Food>[] = [
  { value: 'apple', label: 'Apple', group: 'Fruits' },
  { value: 'banana', label: 'Banana', group: 'Fruits' },
  { value: 'orange', label: 'Orange', group: 'Fruits' },
  { value: 'carrot', label: 'Carrot', group: 'Vegetables' },
  { value: 'broccoli', label: 'Broccoli', group: 'Vegetables' },
  { value: 'spinach', label: 'Spinach', group: 'Vegetables' },
];

const GroupedSelectExample = () => {
  const [value, setValue] = useState<Food | null>(null);
  const bottomSheetRef = useBottomSheetRef();

  return (
    <Box>
      <MediaButton
        appearance='gray'
        onPress={() => bottomSheetRef.current?.present()}
      >
        {value ?? 'Pick a food'}
      </MediaButton>
      <BottomSheet
        ref={bottomSheetRef}
        enableDynamicSizing
        snapPoints={null}
        onClose={() => bottomSheetRef.current?.dismiss()}
      >
        <BottomSheetView>
          <BottomSheetHeader title='Pick a food' />
          <FoodList
            items={FOODS}
            value={value}
            onValueChange={(v) => {
              setValue(v);
              bottomSheetRef.current?.dismiss();
            }}
          >
            <FoodListContent
              renderItem={(item) => (
                <FoodListItem value={item.value}>
                  <FoodListItemContent>
                    <FoodListItemText>{item.label}</FoodListItemText>
                  </FoodListItemContent>
                </FoodListItem>
              )}
            />
          </FoodList>
        </BottomSheetView>
      </BottomSheet>
    </Box>
  );
};

type Network = 'ethereum' | 'polygon' | 'arbitrum' | 'optimism';
type NetworkMeta = { ticker: string; icon: string; tag: string };

const {
  OptionList: NetworkList,
  OptionListContent: NetworkListContent,
  OptionListItem: NetworkListItem,
  OptionListItemLeading: NetworkListItemLeading,
  OptionListItemContent: NetworkListItemContent,
  OptionListItemContentRow: NetworkListItemContentRow,
  OptionListItemText: NetworkListItemText,
  OptionListItemDescription: NetworkListItemDescription,
} = createOptionList<Network, NetworkMeta>();

const NETWORKS: OptionListItemData<Network, NetworkMeta>[] = [
  {
    value: 'ethereum',
    label: 'Ethereum',
    meta: { ticker: 'ETH', icon: 'ethereum', tag: 'ERC-20' },
  },
  {
    value: 'polygon',
    label: 'Polygon',
    meta: { ticker: 'MATIC', icon: 'polygon', tag: 'Layer 2' },
  },
  {
    value: 'arbitrum',
    label: 'Arbitrum',
    meta: { ticker: 'ARB', icon: 'arbitrum', tag: 'Layer 2' },
  },
  {
    value: 'optimism',
    label: 'Optimism',
    meta: { ticker: 'OP', icon: 'optimism', tag: 'Layer 2' },
  },
];

const NetworkSelectExample = () => {
  const [value, setValue] = useState<Network | null>(null);
  const bottomSheetRef = useBottomSheetRef();

  const selected = NETWORKS.find((n) => n.value === value);

  return (
    <Box>
      <MediaButton
        leadingContent={
          selected?.meta ? (
            <CryptoIconNative
              ledgerId={selected.meta.icon}
              ticker={selected.meta.ticker}
              size={32}
            />
          ) : undefined
        }
        appearance='gray'
        onPress={() => bottomSheetRef.current?.present()}
      >
        {selected?.label ?? 'Select network'}
      </MediaButton>
      <BottomSheet
        ref={bottomSheetRef}
        enableDynamicSizing
        snapPoints={null}
        onClose={() => bottomSheetRef.current?.dismiss()}
      >
        <BottomSheetView>
          <BottomSheetHeader title='Select network' />
          <NetworkList
            items={NETWORKS}
            value={value}
            onValueChange={(v) => {
              setValue(v);
              bottomSheetRef.current?.dismiss();
            }}
          >
            <NetworkListContent
              renderItem={({ value, label, meta }) =>
                meta ? (
                  <NetworkListItem value={value}>
                    <NetworkListItemLeading>
                      <CryptoIconNative
                        ledgerId={meta.icon}
                        ticker={meta.ticker}
                        size={32}
                      />
                    </NetworkListItemLeading>
                    <NetworkListItemContent>
                      <NetworkListItemContentRow>
                        <NetworkListItemText>{label}</NetworkListItemText>
                        <Tag label={meta.tag} appearance='gray' size='sm' />
                      </NetworkListItemContentRow>
                      <NetworkListItemDescription>
                        {meta.ticker}
                      </NetworkListItemDescription>
                    </NetworkListItemContent>
                  </NetworkListItem>
                ) : null
              }
            />
          </NetworkList>
        </BottomSheetView>
      </BottomSheet>
    </Box>
  );
};

type SearchableCurrency =
  | 'btc'
  | 'eth'
  | 'sol'
  | 'ada'
  | 'dot'
  | 'matic'
  | 'xrp'
  | 'doge';

const {
  OptionList: SearchableCurrencyList,
  OptionListContent: SearchableCurrencyListContent,
  OptionListItem: SearchableCurrencyListItem,
  OptionListItemLeading: SearchableCurrencyListItemLeading,
  OptionListItemContent: SearchableCurrencyListItemContent,
  OptionListItemText: SearchableCurrencyListItemText,
  OptionListItemDescription: SearchableCurrencyListItemDescription,
  OptionListSearch: SearchableCurrencyListSearch,
  OptionListEmptyState: SearchableCurrencyListEmptyState,
} = createOptionList<SearchableCurrency, CryptoMeta>();

const SEARCHABLE_CURRENCIES: OptionListItemData<
  SearchableCurrency,
  CryptoMeta
>[] = [
  { value: 'btc', label: 'Bitcoin', meta: { ticker: 'BTC', icon: 'bitcoin' } },
  {
    value: 'eth',
    label: 'Ethereum',
    meta: { ticker: 'ETH', icon: 'ethereum' },
  },
  { value: 'sol', label: 'Solana', meta: { ticker: 'SOL', icon: 'solana' } },
  { value: 'ada', label: 'Cardano', meta: { ticker: 'ADA', icon: 'cardano' } },
  {
    value: 'dot',
    label: 'Polkadot',
    meta: { ticker: 'DOT', icon: 'polkadot' },
  },
  {
    value: 'matic',
    label: 'Polygon',
    meta: { ticker: 'MATIC', icon: 'polygon' },
  },
  { value: 'xrp', label: 'XRP', meta: { ticker: 'XRP', icon: 'ripple' } },
  {
    value: 'doge',
    label: 'Dogecoin',
    meta: { ticker: 'DOGE', icon: 'dogecoin' },
  },
];

const SearchableSelectExample = () => {
  const [value, setValue] = useState<SearchableCurrency | null>(null);
  const bottomSheetRef = useBottomSheetRef();

  const selected = SEARCHABLE_CURRENCIES.find((c) => c.value === value);

  return (
    <Box>
      <MediaButton
        leadingContent={
          selected?.meta ? (
            <CryptoIconNative
              ledgerId={selected.meta.icon}
              ticker={selected.meta.ticker}
              size={32}
            />
          ) : undefined
        }
        appearance='gray'
        onPress={() => bottomSheetRef.current?.present()}
      >
        {selected?.label ?? 'Search currency'}
      </MediaButton>
      <BottomSheet
        ref={bottomSheetRef}
        enableDynamicSizing
        snapPoints={null}
        onClose={() => bottomSheetRef.current?.dismiss()}
      >
        <BottomSheetView>
          <BottomSheetHeader title='Select currency' />
          <SearchableCurrencyList
            items={SEARCHABLE_CURRENCIES}
            value={value}
            onValueChange={(v) => {
              setValue(v);
              bottomSheetRef.current?.dismiss();
            }}
          >
            <SearchableCurrencyListSearch placeholder='Search currencies' />
            <SearchableCurrencyListContent
              renderItem={({ value, label, meta }) =>
                meta ? (
                  <SearchableCurrencyListItem value={value}>
                    <SearchableCurrencyListItemLeading>
                      <CryptoIconNative
                        ledgerId={meta.icon}
                        ticker={meta.ticker}
                        size={32}
                      />
                    </SearchableCurrencyListItemLeading>
                    <SearchableCurrencyListItemContent>
                      <SearchableCurrencyListItemText>
                        {label}
                      </SearchableCurrencyListItemText>
                      <SearchableCurrencyListItemDescription>
                        {meta.ticker}
                      </SearchableCurrencyListItemDescription>
                    </SearchableCurrencyListItemContent>
                  </SearchableCurrencyListItem>
                ) : null
              }
            />
            <SearchableCurrencyListEmptyState
              title='No currencies found'
              description='Try a different search term'
            />
          </SearchableCurrencyList>
        </BottomSheetView>
      </BottomSheet>
    </Box>
  );
};

export const OptionLists = () => {
  return (
    <Box lx={{ gap: 's16', alignItems: 'flex-start' }}>
      <CurrencySelectExample />
      <GroupedSelectExample />
      <NetworkSelectExample />
      <SearchableSelectExample />
    </Box>
  );
};

import CryptoIconNative from '@ledgerhq/crypto-icons/native';
import {
  TriggerButton,
  OptionList,
  OptionListContent,
  OptionListItem,
  OptionListItemLeading,
  OptionListItemContent,
  OptionListItemTitle,
  OptionListItemDescription,
  OptionListItemContentRow,
  OptionListItemData,
  Tag,
  Box,
  useBottomSheetRef,
  BottomSheet,
  BottomSheetHeader,
  BottomSheetView,
} from '@ledgerhq/lumen-ui-rnative';
import { useState } from 'react';

const CURRENCIES: OptionListItemData[] = [
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
  const [value, setValue] = useState<string | null>(null);
  const bottomSheetRef = useBottomSheetRef();

  const selected = CURRENCIES.find((c) => c.value === value);
  const selectedMeta = selected?.meta as
    | { ticker: string; icon: string }
    | undefined;

  return (
    <Box>
      <TriggerButton
        icon={
          selectedMeta ? (
            <CryptoIconNative
              ledgerId={selectedMeta.icon}
              ticker={selectedMeta.ticker}
              size={32}
            />
          ) : undefined
        }
        appearance='gray'
        onPress={() => bottomSheetRef.current?.present()}
      >
        {selected?.label ?? 'Currency'}
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
                const meta = item.meta as { ticker: string; icon: string };
                return (
                  <OptionListItem value={item.value}>
                    <OptionListItemLeading>
                      <CryptoIconNative
                        ledgerId={meta.icon}
                        ticker={meta.ticker}
                        size={32}
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
        </BottomSheetView>
      </BottomSheet>
    </Box>
  );
};

const FOODS: OptionListItemData[] = [
  { value: 'apple', label: 'Apple', group: 'Fruits' },
  { value: 'banana', label: 'Banana', group: 'Fruits' },
  { value: 'orange', label: 'Orange', group: 'Fruits' },
  { value: 'carrot', label: 'Carrot', group: 'Vegetables' },
  { value: 'broccoli', label: 'Broccoli', group: 'Vegetables' },
  { value: 'spinach', label: 'Spinach', group: 'Vegetables' },
];

const GroupedSelectExample = () => {
  const [value, setValue] = useState<string | null>(null);
  const bottomSheetRef = useBottomSheetRef();

  return (
    <Box>
      <TriggerButton
        appearance='gray'
        onPress={() => bottomSheetRef.current?.present()}
      >
        {value ?? 'Pick a food'}
      </TriggerButton>
      <BottomSheet
        ref={bottomSheetRef}
        enableDynamicSizing
        snapPoints={null}
        onClose={() => bottomSheetRef.current?.dismiss()}
      >
        <BottomSheetView>
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
        </BottomSheetView>
      </BottomSheet>
    </Box>
  );
};

const NETWORKS: OptionListItemData[] = [
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
  const [value, setValue] = useState<string | null>(null);
  const bottomSheetRef = useBottomSheetRef();

  const selected = NETWORKS.find((n) => n.value === value);

  return (
    <Box>
      <TriggerButton
        icon={
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
                  icon: string;
                  tag: string;
                };
                return (
                  <OptionListItem value={item.value}>
                    <OptionListItemLeading>
                      <CryptoIconNative
                        ledgerId={meta.icon}
                        ticker={meta.ticker}
                        size={32}
                      />
                    </OptionListItemLeading>
                    <OptionListItemContent>
                      <OptionListItemContentRow>
                        <OptionListItemTitle>{item.label}</OptionListItemTitle>
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
    </Box>
  );
};

export const OptionLists = () => {
  return (
    <Box lx={{ gap: 's16', alignItems: 'flex-start' }}>
      <CurrencySelectExample />
      <GroupedSelectExample />
      <NetworkSelectExample />
    </Box>
  );
};

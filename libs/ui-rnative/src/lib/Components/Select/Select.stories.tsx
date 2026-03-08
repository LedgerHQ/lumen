import { CryptoIcon } from '@ledgerhq/crypto-icons';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Coins,
  CoinsCheck,
  HandCoins,
  PenEdit,
  Settings,
  Star,
} from '../../Symbols';
import { Spot } from '../Spot';
import { Box, Text } from '../Utility';
import { GlobalSelectBottomSheet } from './GlobalSelectBottomSheet';
import {
  Select,
  SelectButtonTrigger,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from './Select';

const meta: Meta<typeof Select> = {
  component: Select,
  subcomponents: {
    SelectTrigger,
    SelectButtonTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    SelectItemText,
    SelectGroup,
    SelectLabel,
    SelectSeparator,
  },
  title: 'Selection/Select',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Base: Story = {
  render: () => {
    const [value, setValue] = useState<string>('apple');

    return (
      <>
        <Box
          style={{
            flex: 1,
            minHeight: 400,
            padding: 24,
            width: '100%',
          }}
        >
          <Box style={{ width: '100%', maxWidth: 400 }}>
            <Select value={value} onValueChange={setValue}>
              <SelectTrigger label='Choose a fruit'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='apple'>
                  <SelectItemText>Apple</SelectItemText>
                </SelectItem>
                <SelectItem value='banana'>
                  <SelectItemText>Banana</SelectItemText>
                </SelectItem>
                <SelectItem value='orange'>
                  <SelectItemText>Orange</SelectItemText>
                </SelectItem>
                <SelectItem value='grape'>
                  <SelectItemText>Grape</SelectItemText>
                </SelectItem>
                <SelectItem value='mango'>
                  <SelectItemText>Mango</SelectItemText>
                </SelectItem>
              </SelectContent>
            </Select>
          </Box>
        </Box>
        <GlobalSelectBottomSheet />
      </>
    );
  },
};

export const WithGroups: Story = {
  render: () => {
    const [value, setValue] = useState<string>('btc');

    return (
      <>
        <Box
          style={{
            flex: 1,
            minHeight: 400,
            padding: 24,
            width: '100%',
          }}
        >
          <Box style={{ width: '100%', maxWidth: 400 }}>
            <Select value={value} onValueChange={setValue}>
              <SelectTrigger label='Select cryptocurrency'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Popular</SelectLabel>
                  <SelectItem value='btc'>
                    <SelectItemText>Bitcoin</SelectItemText>
                  </SelectItem>
                  <SelectItem value='eth'>
                    <SelectItemText>Ethereum</SelectItemText>
                  </SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>Altcoins</SelectLabel>
                  <SelectItem value='ada'>
                    <SelectItemText>Cardano</SelectItemText>
                  </SelectItem>
                  <SelectItem value='dot'>
                    <SelectItemText>Polkadot</SelectItemText>
                  </SelectItem>
                  <SelectItem value='sol'>
                    <SelectItemText>Solana</SelectItemText>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Box>
        </Box>
        <GlobalSelectBottomSheet />
      </>
    );
  },
};

export const WithDisabledItems: Story = {
  render: () => {
    const [value, setValue] = useState<string>('option1');

    return (
      <>
        <Box
          style={{
            flex: 1,
            minHeight: 400,
            padding: 24,
            width: '100%',
          }}
        >
          <Box style={{ width: '100%', maxWidth: 400 }}>
            <Select value={value} onValueChange={setValue}>
              <SelectTrigger label='Select option'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='option1'>
                  <SelectItemText>Option 1</SelectItemText>
                </SelectItem>
                <SelectItem value='option2' disabled>
                  <SelectItemText>Option 2 (Disabled)</SelectItemText>
                </SelectItem>
                <SelectItem value='option3'>
                  <SelectItemText>Option 3</SelectItemText>
                </SelectItem>
                <SelectItem value='option4' disabled>
                  <SelectItemText>Option 4 (Disabled)</SelectItemText>
                </SelectItem>
                <SelectItem value='option5'>
                  <SelectItemText>Option 5</SelectItemText>
                </SelectItem>
              </SelectContent>
            </Select>
          </Box>
        </Box>
        <GlobalSelectBottomSheet />
      </>
    );
  },
};

export const DisabledSelect: Story = {
  render: () => {
    const [value, setValue] = useState<string>('apple');

    return (
      <>
        <Box
          style={{
            flex: 1,
            minHeight: 400,
            padding: 24,
            width: '100%',
          }}
        >
          <Box style={{ width: '100%', maxWidth: 400 }}>
            <Select value={value} onValueChange={setValue} disabled>
              <SelectTrigger label='Disabled select'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='apple'>
                  <SelectItemText>Apple</SelectItemText>
                </SelectItem>
                <SelectItem value='banana'>
                  <SelectItemText>Banana</SelectItemText>
                </SelectItem>
                <SelectItem value='orange'>
                  <SelectItemText>Orange</SelectItemText>
                </SelectItem>
              </SelectContent>
            </Select>
          </Box>
        </Box>
        <GlobalSelectBottomSheet />
      </>
    );
  },
};

export const WithChangeCallback: Story = {
  render: () => {
    const [value, setValue] = useState<string>('option1');

    return (
      <>
        <Box
          style={{
            flex: 1,
            minHeight: 400,
            padding: 24,
            width: '100%',
          }}
        >
          <Box style={{ width: '100%', maxWidth: 400 }}>
            <Select
              value={value}
              onValueChange={(newValue) => {
                setValue(newValue);
                alert(`Selected: ${newValue}`);
              }}
              onOpenChange={(open) => {
                alert(`Select ${open ? 'opened' : 'closed'}`);
              }}
            >
              <SelectTrigger label='Select with callbacks'>
                <SelectValue />
              </SelectTrigger>
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
          </Box>
        </Box>
        <GlobalSelectBottomSheet />
      </>
    );
  },
};

const cryptos = [
  { value: 'btc', label: 'Bitcoin', ledgerId: 'bitcoin', ticker: 'BTC' },
  { value: 'eth', label: 'Ethereum', ledgerId: 'ethereum', ticker: 'ETH' },
  { value: 'sol', label: 'Solana', ledgerId: 'solana', ticker: 'SOL' },
] as const;

const appearances = [
  { value: 'gray', label: 'Gray' },
  { value: 'transparent', label: 'Transparent' },
  { value: 'no-background', label: 'No background' },
] as const;

export const TriggerShowcase: Story = {
  render: () => {
    const [iconValue, setIconValue] = useState<string>('');
    const [cryptoValue, setCryptoValue] = useState<string>('');
    const selectedCrypto = cryptos.find((c) => c.value === cryptoValue);

    return (
      <>
        <Box style={{ flex: 1, minHeight: 400, padding: 24, gap: 24 }}>
          <Text typography='body2' lx={{ color: 'muted' }}>
            Trigger with a flat icon
          </Text>
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
            <SelectContent>
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
          <Text typography='body2' lx={{ color: 'muted' }}>
            Trigger with a crypto icon
          </Text>
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
            <SelectContent>
              {cryptos.map((crypto) => (
                <SelectItem
                  key={crypto.value}
                  value={crypto.value}
                  textValue={crypto.label}
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
          <Box lx={{ gap: 's16' }}>
            <Text typography='body2' lx={{ color: 'muted' }}>
              Appearances:
            </Text>
            <Box lx={{ flexDirection: 'row', gap: 's16' }}>
              {appearances.map((appearance) => (
                <Select key={appearance.value}>
                  <SelectTrigger
                    render={(renderProps) => (
                      <SelectButtonTrigger
                        {...renderProps}
                        label={appearance.label}
                        appearance={appearance.value}
                      />
                    )}
                  />
                  <SelectContent>
                    <SelectItem value='option1'>
                      <SelectItemText>Option 1</SelectItemText>
                    </SelectItem>
                    <SelectItem value='option2'>
                      <SelectItemText>Option 2</SelectItemText>
                    </SelectItem>
                  </SelectContent>
                </Select>
              ))}
            </Box>
          </Box>
        </Box>
        <GlobalSelectBottomSheet />
      </>
    );
  },
};

const filterTypes = [
  { value: 'send', label: 'Send', icon: ArrowUp },
  { value: 'receive', label: 'Receive', icon: ArrowDown },
  { value: 'fees', label: 'Fees', icon: Coins },
  { value: 'claimed-rewards', label: 'Claimed rewards', icon: Star },
  { value: 'delegated', label: 'Delegated', icon: CoinsCheck },
  { value: 'withdraw', label: 'Withdraw', icon: HandCoins },
  { value: 'approval', label: 'Approval', icon: PenEdit },
] as const;

export const WithSpotItems: Story = {
  render: () => {
    const [value, setValue] = useState<string>('send');

    return (
      <>
        <Box style={{ flex: 1, minHeight: 800, padding: 24 }}>
          <Select value={value} onValueChange={setValue}>
            <SelectTrigger
              render={(renderProps) => (
                <SelectButtonTrigger {...renderProps} label='Add filter type' />
              )}
            />
            <SelectContent>
              {filterTypes.map((filter) => (
                <SelectItem
                  key={filter.value}
                  value={filter.value}
                  textValue={filter.label}
                >
                  <Spot appearance='icon' icon={filter.icon} size={40} />
                  <SelectItemText>{filter.label}</SelectItemText>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Box>
        <GlobalSelectBottomSheet />
      </>
    );
  },
};

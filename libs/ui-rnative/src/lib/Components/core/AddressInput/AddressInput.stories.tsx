import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View } from 'react-native';
import { AddressInput } from './AddressInput';

const meta = {
  component: AddressInput,
  id: 'rnative-addressinput',
  title: 'Core/AddressInput',
  decorators: [
    (Story) => (
      <View
        style={{
          flex: 1,
          minHeight: 96,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <View style={{ width: '100%', maxWidth: 400 }}>
          <Story />
        </View>
      </View>
    ),
  ],
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'code',
      },
    },
  },
} satisfies Meta<typeof AddressInput>;

export default meta;
type Story = StoryObj<typeof AddressInput>;

export const Base: Story = {
  args: {
    placeholder: 'Enter address or ENS',
    prefix: 'To:',
    editable: true,
    hideClearButton: false,
    onQrCodeClick: () => alert('QR code scanner opened'),
  },
  render: (args) => {
    const [address, setAddress] = useState('');

    return <AddressInput {...args} value={address} onChangeText={setAddress} />;
  },
};

export const WithContent: Story = {
  render: () => {
    const [address, setAddress] = useState(
      '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb27',
    );

    return (
      <AddressInput
        placeholder='Enter address or ENS'
        prefix='To:'
        editable
        hideClearButton={false}
        value={address}
        onChangeText={setAddress}
        onQrCodeClick={() => alert('QR code scanner opened')}
      />
    );
  },
};

export const WithCustomPrefix: Story = {
  render: () => {
    const [address, setAddress] = useState('');

    return (
      <AddressInput
        placeholder='Enter sender address'
        prefix='From:'
        editable
        hideClearButton={false}
        value={address}
        onChangeText={setAddress}
        onQrCodeClick={() => alert('QR code scanner opened')}
      />
    );
  },
};

export const WithoutQrCode: Story = {
  render: () => {
    const [address, setAddress] = useState('');

    return (
      <AddressInput
        placeholder='Enter address or ENS'
        prefix='To:'
        editable
        hideClearButton={false}
        value={address}
        onChangeText={setAddress}
      />
    );
  },
};

export const WithError: Story = {
  render: () => {
    const [address, setAddress] = useState('invalid-address');

    return (
      <AddressInput
        placeholder='Enter address or ENS'
        helperText='Invalid address format'
        status='error'
        prefix='To:'
        editable
        hideClearButton={false}
        value={address}
        onChangeText={setAddress}
        onQrCodeClick={() => alert('QR code scanner opened')}
      />
    );
  },
};

export const WithMultiline: Story = {
  render: () => {
    const [address, setAddress] = useState(
      '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb27',
    );

    return (
      <AddressInput
        placeholder='Enter address or ENS'
        prefix='To:'
        multiline
        minLines={2}
        maxLines={5}
        editable
        hideClearButton={false}
        value={address}
        onChangeText={setAddress}
        onQrCodeClick={() => alert('QR code scanner opened')}
      />
    );
  },
};

export const WithMultilineFixedHeight: Story = {
  render: () => {
    const [address, setAddress] = useState(
      '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb27',
    );

    return (
      <AddressInput
        placeholder='Enter address or ENS'
        prefix='To:'
        multiline
        minLines={4}
        maxLines={4}
        editable
        hideClearButton={false}
        value={address}
        onChangeText={setAddress}
        onQrCodeClick={() => alert('QR code scanner opened')}
      />
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const [address, setAddress] = useState(
      '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb27',
    );

    return (
      <AddressInput
        placeholder='Enter address or ENS'
        prefix='To:'
        disabled
        hideClearButton={false}
        value={address}
        onChangeText={setAddress}
        onQrCodeClick={() => alert('QR code scanner opened')}
      />
    );
  },
};

export const ReadOnly: Story = {
  render: () => {
    const [address, setAddress] = useState(
      '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb27',
    );

    return (
      <AddressInput
        placeholder='Enter address or ENS'
        prefix='To:'
        readOnly
        hideClearButton={false}
        value={address}
        onChangeText={setAddress}
        onQrCodeClick={() => alert('QR code scanner opened')}
      />
    );
  },
};

export const WithHiddenClearButton: Story = {
  render: () => {
    const [address, setAddress] = useState(
      '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb27',
    );

    return (
      <AddressInput
        placeholder='Enter address or ENS'
        prefix='To:'
        editable
        hideClearButton
        value={address}
        onChangeText={setAddress}
        onQrCodeClick={() => alert('QR code scanner opened')}
      />
    );
  },
};

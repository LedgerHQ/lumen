import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View } from 'react-native';
import { AddressInput } from './AddressInput';
import type { AddressInputProps } from './types';

const meta: Meta<typeof AddressInput> = {
  component: AddressInput,
  title: 'Input/AddressInput',
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'code',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AddressInput>;

const AddressInputStory = (args: AddressInputProps) => {
  const [address, setAddress] = useState(args.value?.toString() ?? '');

  return (
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
        <AddressInput
          {...args}
          value={address}
          onChangeText={setAddress}
          onQrCodeClick={
            args.onQrCodeClick ?? (() => alert('QR code scanner opened'))
          }
        />
      </View>
    </View>
  );
};

export const Base: Story = {
  render: (args) => <AddressInputStory {...args} />,
  args: {
    placeholder: 'Enter address or ENS',
    prefix: 'To:',
    editable: true,
    hideClearButton: false,
  },
};

export const WithContent: Story = {
  render: (args) => <AddressInputStory {...args} />,
  args: {
    placeholder: 'Enter address or ENS',
    value: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb27',
    prefix: 'To:',
    editable: true,
    hideClearButton: false,
  },
};

export const WithCustomPrefix: Story = {
  render: (args) => <AddressInputStory {...args} />,
  args: {
    placeholder: 'Enter sender address',
    prefix: 'From:',
    editable: true,
    hideClearButton: false,
  },
};

const AddressInputWithoutQrStory = (args: AddressInputProps) => {
  const [address, setAddress] = useState(args.value?.toString() ?? '');

  return (
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
        <AddressInput
          {...args}
          value={address}
          onChangeText={setAddress}
          onQrCodeClick={undefined}
        />
      </View>
    </View>
  );
};

export const WithoutQrCode: Story = {
  render: (args) => <AddressInputWithoutQrStory {...args} />,
  args: {
    placeholder: 'Enter address or ENS',
    prefix: 'To:',
    editable: true,
    hideClearButton: false,
  },
};

export const WithError: Story = {
  render: (args) => <AddressInputStory {...args} />,
  args: {
    placeholder: 'Enter address or ENS',
    value: 'invalid-address',
    helperText: 'Invalid address format',
    status: 'error',
    prefix: 'To:',
    editable: true,
    hideClearButton: false,
  },
};

export const DisabledAddressInput: Story = {
  render: (args) => <AddressInputStory {...args} />,
  args: {
    placeholder: 'Enter address or ENS',
    value: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb27',
    prefix: 'To:',
    disabled: true,
    hideClearButton: false,
  },
};

export const WithHiddenClearButton: Story = {
  render: (args) => <AddressInputStory {...args} />,
  args: {
    placeholder: 'Enter address or ENS',
    value: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb27',
    prefix: 'To:',
    editable: true,
    hideClearButton: true,
  },
};

import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View } from 'react-native';
import { TextInput } from './TextInput';
import { type TextInputProps } from './types';

const meta: Meta<typeof TextInput> = {
  component: TextInput,
  title: 'Input/TextInput',
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
type Story = StoryObj<typeof TextInput>;

const TextInputStory = (args: TextInputProps & { initialValue?: string }) => {
  const [value, setValue] = useState(args.initialValue ?? '');

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
        <TextInput
          {...args}
          value={value}
          onChangeText={setValue}
          onClear={args.onClear}
        />
      </View>
    </View>
  );
};

export const Base: Story = {
  render: (args) => <TextInputStory {...args} />,
  args: {
    label: 'Username',
    editable: true,
    hideClearButton: false,
    keyboardType: 'default',
  },
};

export const WithContent: Story = {
  render: (args) => <TextInputStory {...args} initialValue='johndoe' />,
  args: {
    label: 'Username',
    editable: true,
    hideClearButton: false,
    keyboardType: 'default',
  },
};

export const WithLabelAndPlaceholder: Story = {
  render: (args) => <TextInputStory {...args} />,
  args: {
    label: 'Phone',
    placeholder: '+1 (555) 000-0000',
    editable: true,
    hideClearButton: false,
    keyboardType: 'phone-pad',
  },
};

export const WithError: Story = {
  render: (args) => <TextInputStory {...args} initialValue='ab' />,
  args: {
    label: 'Username',
    helperText: 'Username must be at least 3 characters',
    status: 'error',
    editable: true,
    hideClearButton: false,
    keyboardType: 'default',
  },
};

export const WithSuccess: Story = {
  render: (args) => (
    <TextInputStory
      {...args}
      initialValue='0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb27'
    />
  ),
  args: {
    label: 'Address',
    helperText: 'Address verified',
    status: 'success',
    editable: true,
    hideClearButton: false,
    keyboardType: 'default',
  },
};

export const WithNeutralHint: Story = {
  render: (args) => <TextInputStory {...args} />,
  args: {
    label: 'Address',
    helperText: 'Enter your ETH address',
    editable: true,
    hideClearButton: false,
    keyboardType: 'default',
  },
};

export const DisabledTextInput: Story = {
  render: (args) => <TextInputStory {...args} initialValue='johndoe' />,
  args: {
    label: 'Username',
    disabled: true,
    hideClearButton: false,
    keyboardType: 'default',
  },
};

export const WithHiddenClearButton: Story = {
  render: (args) => (
    <TextInputStory {...args} initialValue='Content with hidden clear' />
  ),
  args: {
    label: 'Label',
    editable: true,
    hideClearButton: true,
    keyboardType: 'default',
  },
};

export const WithClearCallback: Story = {
  render: (args) => (
    <TextInputStory
      {...args}
      initialValue='Click clear to see callback'
      onClear={() => alert('Input cleared!')}
    />
  ),
  args: {
    label: 'Label',
    editable: true,
    hideClearButton: false,
    keyboardType: 'default',
  },
};

export const EmailKeyboard: Story = {
  render: (args) => <TextInputStory {...args} />,
  args: {
    label: 'Email',
    editable: true,
    hideClearButton: false,
    keyboardType: 'email-address',
  },
};

export const PhoneKeyboard: Story = {
  render: (args) => <TextInputStory {...args} />,
  args: {
    label: 'Phone Number',
    editable: true,
    hideClearButton: false,
    keyboardType: 'phone-pad',
  },
};

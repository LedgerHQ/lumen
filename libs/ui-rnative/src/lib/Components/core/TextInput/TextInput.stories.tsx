import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View } from 'react-native';
import { TextInput } from './TextInput';

const meta = {
  component: TextInput,
  id: 'rnative-textinput',
  title: 'Core/TextInput',
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
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof TextInput>;

export const Base: Story = {
  args: { label: 'Username' },
  render: (args) => {
    const [value, setValue] = useState('');
    return <TextInput {...args} value={value} onChangeText={setValue} />;
  },
};

export const WithContent: Story = {
  render: () => {
    const [value, setValue] = useState('johndoe');
    return <TextInput label='Username' value={value} onChangeText={setValue} />;
  },
};

export const WithLabelAndPlaceholder: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <TextInput
        label='Phone'
        placeholder='+1 (555) 000-0000'
        keyboardType='phone-pad'
        value={value}
        onChangeText={setValue}
      />
    );
  },
};

export const WithError: Story = {
  render: () => {
    const [value, setValue] = useState('ab');
    return (
      <TextInput
        label='Username'
        helperText='Username must be at least 3 characters'
        status='error'
        value={value}
        onChangeText={setValue}
      />
    );
  },
};

export const WithCounter: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <TextInput
        label='Label'
        helperText='Info text'
        maxCount={32}
        value={value}
        onChangeText={setValue}
      />
    );
  },
};

export const WithCounterExceeded: Story = {
  render: () => {
    const [value, setValue] = useState('This text exceeds the character limit');
    const maxCount = 32;
    const isOverLimit = value.length > maxCount;

    return (
      <TextInput
        label='Label'
        value={value}
        onChangeText={setValue}
        helperText={isOverLimit ? 'Character limit exceeded' : 'Info text'}
        status={isOverLimit ? 'error' : undefined}
        maxCount={maxCount}
      />
    );
  },
};

export const WithNativeMaxLength: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <TextInput
        label='Label'
        helperText='Input is capped at 8 characters'
        maxLength={8}
        maxCount={8}
        value={value}
        onChangeText={setValue}
      />
    );
  },
};

export const WithSuccess: Story = {
  render: () => {
    const [value, setValue] = useState(
      '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb27',
    );
    return (
      <TextInput
        label='Address'
        helperText='Address verified'
        status='success'
        value={value}
        onChangeText={setValue}
      />
    );
  },
};

export const WithNeutralHint: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <TextInput
        label='Address'
        helperText='Enter your ETH address'
        value={value}
        onChangeText={setValue}
      />
    );
  },
};

export const WithMultiline: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <TextInput
        label='Note'
        helperText='Grows from 2 to 5 lines, then scrolls'
        multiline
        minLines={2}
        maxLines={5}
        value={value}
        onChangeText={setValue}
      />
    );
  },
};

export const WithMultilineFixedHeight: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <TextInput
        label='Note'
        multiline
        minLines={4}
        maxLines={4}
        value={value}
        onChangeText={setValue}
      />
    );
  },
};

export const DisabledTextInput: Story = {
  render: () => {
    const [value, setValue] = useState('johndoe');
    return (
      <TextInput
        label='Username'
        disabled
        value={value}
        onChangeText={setValue}
      />
    );
  },
};

export const ReadOnlyTextInput: Story = {
  render: () => {
    const [value, setValue] = useState('johndoe');
    return (
      <TextInput
        label='Username'
        readOnly
        value={value}
        onChangeText={setValue}
      />
    );
  },
};

export const WithHiddenClearButton: Story = {
  render: () => {
    const [value, setValue] = useState('Content with hidden clear');
    return (
      <TextInput
        label='Label'
        hideClearButton
        value={value}
        onChangeText={setValue}
      />
    );
  },
};

export const WithClearCallback: Story = {
  render: () => {
    const [value, setValue] = useState('Click clear to see callback');
    return (
      <TextInput
        label='Label'
        onClear={() => alert('Input cleared!')}
        value={value}
        onChangeText={setValue}
      />
    );
  },
};

export const EmailKeyboard: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <TextInput
        label='Email'
        keyboardType='email-address'
        value={value}
        onChangeText={setValue}
      />
    );
  },
};

export const PhoneKeyboard: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <TextInput
        label='Phone Number'
        keyboardType='phone-pad'
        value={value}
        onChangeText={setValue}
      />
    );
  },
};

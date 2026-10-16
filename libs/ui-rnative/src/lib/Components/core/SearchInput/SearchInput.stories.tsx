import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View } from 'react-native';
import { SearchInput } from './SearchInput';

const meta = {
  component: SearchInput,
  id: 'rnative-searchinput',
  title: 'Core/SearchInput',
  args: {
    appearance: 'plain',
  },
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
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Base: Story = {
  args: {
    appearance: 'plain',
    placeholder: 'Search products',
    editable: true,
    hideClearButton: false,
  },
  render: (args) => {
    const [query, setQuery] = useState('');

    return <SearchInput {...args} value={query} onChangeText={setQuery} />;
  },
};

export const WithContent: Story = {
  render: () => {
    const [query, setQuery] = useState('Search text');

    return (
      <SearchInput
        appearance='plain'
        placeholder='Search products'
        editable
        hideClearButton={false}
        value={query}
        onChangeText={setQuery}
      />
    );
  },
};

export const WithError: Story = {
  render: () => {
    const [query, setQuery] = useState('Invalid search');

    return (
      <SearchInput
        appearance='plain'
        placeholder='Search products'
        helperText='Search term is invalid'
        status='error'
        editable
        hideClearButton={false}
        value={query}
        onChangeText={setQuery}
      />
    );
  },
};

export const DisabledSearchInput: Story = {
  render: () => {
    const [query, setQuery] = useState('Disabled search');

    return (
      <SearchInput
        appearance='plain'
        placeholder='Search products'
        disabled
        hideClearButton={false}
        value={query}
        onChangeText={setQuery}
      />
    );
  },
};

export const WithHiddenClearButton: Story = {
  render: () => {
    const [query, setQuery] = useState('Search text');

    return (
      <SearchInput
        appearance='plain'
        placeholder='Search products'
        editable
        hideClearButton
        value={query}
        onChangeText={setQuery}
      />
    );
  },
};

export const WithClearCallback: Story = {
  render: () => {
    const [query, setQuery] = useState('Click clear to see callback');

    return (
      <SearchInput
        appearance='plain'
        placeholder='Search products'
        editable
        hideClearButton={false}
        value={query}
        onChangeText={setQuery}
        onClear={() => alert('Search cleared!')}
      />
    );
  },
};

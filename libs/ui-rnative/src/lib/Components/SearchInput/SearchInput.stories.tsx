import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View } from 'react-native';
import { SearchInput } from './SearchInput';
import { SearchInputProps } from './types';

const meta: Meta<typeof SearchInput> = {
  component: SearchInput,
  title: 'Input/SearchInput',
  args: {
    appearance: 'plain',
  },
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'code',
      },
    },
  },
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text when input is empty',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message to display below input',
    },
    editable: {
      control: 'boolean',
      description: 'Whether the input is editable',
    },
    hideClearButton: {
      control: 'boolean',
      description: 'Hide the clear button',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

const SearchInputStory = (
  args: SearchInputProps & { initialValue?: string },
) => {
  const [query, setQuery] = useState(args.initialValue ?? '');

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
        <SearchInput
          {...args}
          value={query}
          onChangeText={setQuery}
          onClear={args.onClear}
        />
      </View>
    </View>
  );
};

export const Base: Story = {
  render: (args) => <SearchInputStory {...args} />,
  args: {
    placeholder: 'Search products',
    editable: true,
    hideClearButton: false,
  },
};

export const WithContent: Story = {
  render: (args) => <SearchInputStory {...args} initialValue='Search text' />,
  args: {
    placeholder: 'Search products',
    editable: true,
    hideClearButton: false,
  },
};

export const WithError: Story = {
  render: (args) => (
    <SearchInputStory {...args} initialValue='Invalid search' />
  ),
  args: {
    placeholder: 'Search products',
    errorMessage: 'Search term is invalid',
    editable: true,
    hideClearButton: false,
  },
};

export const DisabledSearchInput: Story = {
  render: (args) => (
    <SearchInputStory {...args} initialValue='Disabled search' />
  ),
  args: {
    placeholder: 'Search products',
    editable: false,
    hideClearButton: false,
  },
};

export const WithHiddenClearButton: Story = {
  render: (args) => <SearchInputStory {...args} initialValue='Search text' />,
  args: {
    placeholder: 'Search products',
    editable: true,
    hideClearButton: true,
  },
};

export const WithClearCallback: Story = {
  render: (args) => (
    <SearchInputStory
      {...args}
      initialValue='Click clear to see callback'
      onClear={() => alert('Search cleared!')}
    />
  ),
  args: {
    placeholder: 'Search products',
    editable: true,
    hideClearButton: false,
  },
};

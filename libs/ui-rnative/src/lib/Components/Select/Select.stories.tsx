import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { Box } from '../Utility';
import { GlobalSelectBottomSheet } from './GlobalSelectBottomSheet';
import {
  Select,
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
  tags: ['deprecated'],
  subcomponents: {
    SelectTrigger,
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

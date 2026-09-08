import { describe, it, expect, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, fireEvent } from '@testing-library/react-native';
import { View } from 'react-native';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { MenuList, MenuListItem } from './MenuList';
import type { IconComponent } from './types';

const TestIcon: IconComponent = ({ size }) => (
  <View testID='icon' style={{ width: size, height: size }} />
);

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);

describe('MenuList', () => {
  it('renders children', () => {
    const { getByText } = render(
      <TestWrapper>
        <MenuList>
          <MenuListItem label='Item A' onPress={jest.fn()} />
        </MenuList>
      </TestWrapper>,
    );

    expect(getByText('Item A')).toBeTruthy();
  });
});

describe('MenuListItem', () => {
  it('renders the label', () => {
    const { getByText } = render(
      <TestWrapper>
        <MenuListItem label='Settings' onPress={jest.fn()} />
      </TestWrapper>,
    );

    expect(getByText('Settings')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <TestWrapper>
        <MenuListItem label='Action' onPress={onPress} />
      </TestWrapper>,
    );

    fireEvent.press(getByRole('button'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <TestWrapper>
        <MenuListItem label='Disabled action' onPress={onPress} disabled />
      </TestWrapper>,
    );

    fireEvent.press(getByRole('button'));

    expect(onPress).not.toHaveBeenCalled();
  });

  it('sets accessibilityState disabled when disabled', () => {
    const { getByRole } = render(
      <TestWrapper>
        <MenuListItem label='Disabled' onPress={jest.fn()} disabled />
      </TestWrapper>,
    );

    expect(getByRole('button').props.accessibilityState?.disabled).toBe(true);
  });

  it('renders with destructive appearance', () => {
    const { getByText } = render(
      <TestWrapper>
        <MenuListItem
          label='Delete'
          appearance='destructive'
          onPress={jest.fn()}
        />
      </TestWrapper>,
    );

    expect(getByText('Delete').props.style.color).toBe(
      ledgerLiveThemes.dark.colors.text.error,
    );
  });

  it('renders the icon when provided', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <MenuListItem label='With Icon' icon={TestIcon} onPress={jest.fn()} />
      </TestWrapper>,
    );

    expect(getByTestId('icon')).toBeTruthy();
  });

  it('renders icon with disabled appearance when disabled', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <MenuListItem
          label='With Icon'
          icon={TestIcon}
          onPress={jest.fn()}
          disabled
        />
      </TestWrapper>,
    );

    expect(getByTestId('icon')).toBeTruthy();
  });

  it('renders icon with destructive appearance', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <MenuListItem
          label='Delete'
          icon={TestIcon}
          appearance='destructive'
          onPress={jest.fn()}
        />
      </TestWrapper>,
    );

    expect(getByTestId('icon')).toBeTruthy();
  });
});

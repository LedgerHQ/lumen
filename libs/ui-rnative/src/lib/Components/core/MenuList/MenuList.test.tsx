import { describe, it, expect, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { View } from 'react-native';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { MenuList, MenuListItem, MenuListSwitchItem } from './MenuList';
import type { IconComponent } from './types';

const TestIcon: IconComponent = ({ size, color }) => (
  <View
    testID='icon'
    style={{ width: size, height: size }}
    accessibilityLabel={String(color)}
  />
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

  it('renders with red appearance', () => {
    const { getByText } = render(
      <TestWrapper>
        <MenuListItem label='Delete' appearance='red' onPress={jest.fn()} />
      </TestWrapper>,
    );

    expect(getByText('Delete').props.style.color).toBe(
      ledgerLiveThemes.dark.colors.text.error,
    );
  });

  it('renders the icon with base color by default', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <MenuListItem label='With Icon' icon={TestIcon} onPress={jest.fn()} />
      </TestWrapper>,
    );

    expect(getByTestId('icon').props.accessibilityLabel).toBe('base');
  });

  it('renders icon with disabled color when disabled', () => {
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

    expect(getByTestId('icon').props.accessibilityLabel).toBe('disabled');
  });

  it('renders icon with error color when appearance is red', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <MenuListItem
          label='Delete'
          icon={TestIcon}
          appearance='red'
          onPress={jest.fn()}
        />
      </TestWrapper>,
    );

    expect(getByTestId('icon').props.accessibilityLabel).toBe('error');
  });
});

describe('MenuListSwitchItem', () => {
  it('renders the label', () => {
    const { getByText } = render(
      <TestWrapper>
        <MenuListSwitchItem label='Notifications' />
      </TestWrapper>,
    );

    expect(getByText('Notifications')).toBeTruthy();
  });

  it('uncontrolled: toggles checked state on press', async () => {
    const { getByRole } = render(
      <TestWrapper>
        <MenuListSwitchItem label='Notifications' defaultChecked={false} />
      </TestWrapper>,
    );

    const item = getByRole('switch');
    expect(item.props.accessibilityState?.checked).toBe(false);

    fireEvent.press(item);

    await waitFor(() =>
      expect(item.props.accessibilityState?.checked).toBe(true),
    );
  });

  it('controlled: calls onCheckedChange but state is controlled by parent', async () => {
    const onCheckedChange = jest.fn();
    const { getByRole } = render(
      <TestWrapper>
        <MenuListSwitchItem
          label='Notifications'
          checked={false}
          onCheckedChange={onCheckedChange}
        />
      </TestWrapper>,
    );

    fireEvent.press(getByRole('switch'));

    await waitFor(() => expect(onCheckedChange).toHaveBeenCalledWith(true));
    await waitFor(() =>
      expect(getByRole('switch').props.accessibilityState?.checked).toBe(false),
    );
  });

  it('does not toggle when disabled', async () => {
    const onCheckedChange = jest.fn();
    const { getByRole } = render(
      <TestWrapper>
        <MenuListSwitchItem
          label='Notifications'
          disabled
          defaultChecked={false}
          onCheckedChange={onCheckedChange}
        />
      </TestWrapper>,
    );

    const item = getByRole('switch');
    expect(item.props.accessibilityState?.disabled).toBe(true);

    fireEvent.press(item);

    await waitFor(() => expect(onCheckedChange).not.toHaveBeenCalled());
  });
});

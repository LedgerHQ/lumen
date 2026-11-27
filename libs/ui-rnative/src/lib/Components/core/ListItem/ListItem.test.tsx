import { describe, it, expect, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { Text as RNText } from 'react-native';

import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import {
  ListItem,
  ListItemLeading,
  ListItemContent,
  ListItemContentRow,
  ListItemTitle,
  ListItemDescription,
  ListItemTrailing,
} from './ListItem';
import type { ListItemProps } from './types';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);

const renderListItem = (props: Partial<ListItemProps> = {}) =>
  render(
    <TestWrapper>
      <ListItem testID='list-item' {...props}>
        <ListItemLeading testID='leading'>
          <ListItemContent>
            <ListItemTitle>Title</ListItemTitle>
            <ListItemDescription>Description</ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing testID='trailing'>
          <RNText>Trailing</RNText>
        </ListItemTrailing>
      </ListItem>
    </TestWrapper>,
  );

describe('ListItem', () => {
  it('renders all sub-components', () => {
    renderListItem();

    expect(screen.getByText('Title')).toBeTruthy();
    expect(screen.getByText('Description')).toBeTruthy();
    expect(screen.getByText('Trailing')).toBeTruthy();
  });

  it('forwards testID', () => {
    renderListItem();

    expect(screen.getByTestId('list-item')).toBeTruthy();
    expect(screen.getByTestId('leading')).toBeTruthy();
    expect(screen.getByTestId('trailing')).toBeTruthy();
  });

  describe('density', () => {
    it('defaults to expanded minimum height', () => {
      renderListItem();
      const inner = screen.getByTestId('list-item-content');
      expect(inner.props.style).toEqual(
        expect.objectContaining({ minHeight: 64 }),
      );
    });

    it('applies expanded minimum height explicitly', () => {
      renderListItem({ density: 'expanded' });
      const inner = screen.getByTestId('list-item-content');
      expect(inner.props.style).toEqual(
        expect.objectContaining({ minHeight: 64 }),
      );
    });

    it('applies compact minimum height', () => {
      renderListItem({ density: 'compact' });
      const inner = screen.getByTestId('list-item-content');
      expect(inner.props.style).toEqual(
        expect.objectContaining({ minHeight: 40 }),
      );
    });
  });

  describe('onPress', () => {
    it('triggers onPress on press', () => {
      const onPress = jest.fn();
      renderListItem({ onPress });

      fireEvent.press(screen.getByTestId('list-item'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });
  });

  describe('onLongPress', () => {
    it('triggers onLongPress on long press', () => {
      const onLongPress = jest.fn();
      renderListItem({ onLongPress });

      fireEvent(screen.getByTestId('list-item'), 'longPress');
      expect(onLongPress).toHaveBeenCalledTimes(1);
    });

    it('does not trigger onLongPress when disabled', () => {
      const onLongPress = jest.fn();
      renderListItem({ onLongPress, disabled: true });

      fireEvent(screen.getByTestId('list-item'), 'longPress');
      expect(onLongPress).not.toHaveBeenCalled();
    });
  });

  describe('active', () => {
    it('applies muted background when active', () => {
      renderListItem({ active: true });
      const inner = screen.getByTestId('list-item-content');
      expect(inner.props.style.backgroundColor).not.toBe('transparent');
    });

    it('applies disabled background when active and disabled', () => {
      renderListItem({ active: true, disabled: true });
      const inner = screen.getByTestId('list-item-content');
      expect(inner.props.style.backgroundColor).not.toBe('transparent');
    });

    it('uses transparent background when not active', () => {
      renderListItem();
      const inner = screen.getByTestId('list-item-content');
      expect(inner.props.style.backgroundColor).toBe('transparent');
    });

    it('sets selected accessibility state when active', () => {
      renderListItem({ active: true });
      const item = screen.getByTestId('list-item');
      expect(item.props.accessibilityState?.selected).toBe(true);
    });

    it('does not set selected accessibility state when not active', () => {
      renderListItem();
      const item = screen.getByTestId('list-item');
      expect(item.props.accessibilityState?.selected).toBeFalsy();
    });
  });

  describe('disabled', () => {
    it('sets disabled accessibility state', () => {
      renderListItem({ disabled: true });
      const item = screen.getByTestId('list-item');
      expect(item.props.accessibilityState?.disabled).toBe(true);
    });

    it('does not trigger onPress when disabled', () => {
      const onPress = jest.fn();
      renderListItem({ onPress, disabled: true });

      fireEvent.press(screen.getByTestId('list-item'));
      expect(onPress).not.toHaveBeenCalled();
    });
  });

  describe('priority', () => {
    const renderWithPriority = (priority?: ListItemProps['priority']) =>
      render(
        <TestWrapper>
          <ListItem priority={priority}>
            <ListItemLeading testID='leading'>
              <ListItemContent testID='content'>
                <ListItemTitle>Title</ListItemTitle>
              </ListItemContent>
            </ListItemLeading>
            <ListItemTrailing testID='trailing'>
              <RNText>Trailing</RNText>
            </ListItemTrailing>
          </ListItem>
        </TestWrapper>,
      );

    it('in "end" priority, leading shrinks, trailing shows', () => {
      renderWithPriority();

      expect(screen.getByTestId('leading').props.style).toEqual(
        expect.objectContaining({ flexShrink: 1 }),
      );
      expect(screen.getByTestId('content').props.style).toEqual(
        expect.objectContaining({ flex: 1 }),
      );
      expect(screen.getByTestId('trailing').props.style).not.toEqual(
        expect.objectContaining({ flexShrink: 1 }),
      );
    });

    it('in "start" priority, trailing shrinks, leading shows', () => {
      renderWithPriority('start');

      expect(screen.getByTestId('leading').props.style).not.toEqual(
        expect.objectContaining({ flexShrink: 1 }),
      );
      expect(screen.getByTestId('content').props.style).toEqual(
        expect.objectContaining({ flex: 0, flexShrink: 1 }),
      );
      expect(screen.getByTestId('trailing').props.style).toEqual(
        expect.objectContaining({ flexShrink: 1 }),
      );
    });
  });

  describe('ListItemContentRow', () => {
    it('renders title alongside additional content in a row', () => {
      render(
        <TestWrapper>
          <ListItem>
            <ListItemLeading>
              <ListItemContent>
                <ListItemContentRow testID='content-row'>
                  <ListItemTitle>Bitcoin</ListItemTitle>
                  <RNText>Tag</RNText>
                </ListItemContentRow>
                <ListItemDescription>BTC</ListItemDescription>
              </ListItemContent>
            </ListItemLeading>
          </ListItem>
        </TestWrapper>,
      );

      expect(screen.getByTestId('content-row')).toBeTruthy();
      expect(screen.getByText('Bitcoin')).toBeTruthy();
      expect(screen.getByText('Tag')).toBeTruthy();
      expect(screen.getByText('BTC')).toBeTruthy();
    });
  });

  describe('truncate', () => {
    const renderTruncate = (
      title: { truncate?: boolean } = {},
      description: { truncate?: boolean } = {},
    ) =>
      render(
        <TestWrapper>
          <ListItem>
            <ListItemLeading>
              <ListItemContent>
                <ListItemTitle {...title}>Title</ListItemTitle>
                <ListItemDescription {...description}>
                  Description
                </ListItemDescription>
              </ListItemContent>
            </ListItemLeading>
          </ListItem>
        </TestWrapper>,
      );

    it('truncates title and description to one line by default', () => {
      renderTruncate();

      for (const text of ['Title', 'Description']) {
        expect(screen.getByText(text).props.numberOfLines).toBe(1);
        expect(screen.getByText(text).props.ellipsizeMode).toBe('tail');
      }
    });

    it('wraps title and description when truncate is false', () => {
      renderTruncate({ truncate: false }, { truncate: false });

      for (const text of ['Title', 'Description']) {
        expect(screen.getByText(text).props.numberOfLines).toBeUndefined();
        expect(screen.getByText(text).props.ellipsizeMode).toBeUndefined();
      }
    });

    it('lets the title truncate while the description wraps', () => {
      renderTruncate({}, { truncate: false });

      expect(screen.getByText('Title').props.numberOfLines).toBe(1);
      expect(
        screen.getByText('Description').props.numberOfLines,
      ).toBeUndefined();
    });
  });
});

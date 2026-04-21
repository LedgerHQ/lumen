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
    it('defaults to expanded height', () => {
      renderListItem();
      const inner = screen.getByTestId('list-item-content');
      expect(inner.props.style).toEqual(
        expect.objectContaining({ height: 64 }),
      );
    });

    it('applies expanded height explicitly', () => {
      renderListItem({ density: 'expanded' });
      const inner = screen.getByTestId('list-item-content');
      expect(inner.props.style).toEqual(
        expect.objectContaining({ height: 64 }),
      );
    });

    it('applies compact height', () => {
      renderListItem({ density: 'compact' });
      const inner = screen.getByTestId('list-item-content');
      expect(inner.props.style).toEqual(
        expect.objectContaining({ height: 40 }),
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
});

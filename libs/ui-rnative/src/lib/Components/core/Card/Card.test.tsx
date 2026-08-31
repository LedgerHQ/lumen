import { describe, it, expect, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, fireEvent, screen } from '@testing-library/react-native';
import type { ViewStyle } from 'react-native';
import { Text as RNText } from 'react-native';

import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import {
  Card,
  CardHeader,
  CardLeading,
  CardContent,
  CardContentRow,
  CardContentTitle,
  CardContentDescription,
  CardTrailing,
  CardFooter,
  CardFooterActions,
} from './Card';
import type { CardProps } from './types';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);

const renderCard = (props: Partial<CardProps> = {}) =>
  render(
    <TestWrapper>
      <Card testID='card' {...props}>
        <CardHeader testID='card-header'>
          <CardLeading>
            <CardContent>
              <CardContentTitle>Title</CardContentTitle>
              <CardContentDescription>Description</CardContentDescription>
            </CardContent>
          </CardLeading>
          <CardTrailing>
            <CardContent>
              <CardContentTitle>$100</CardContentTitle>
            </CardContent>
          </CardTrailing>
        </CardHeader>
        <CardFooter testID='card-footer'>
          <CardContentDescription>Footer text</CardContentDescription>
          <CardFooterActions>
            <RNText>Action</RNText>
          </CardFooterActions>
        </CardFooter>
      </Card>
    </TestWrapper>,
  );

describe('Card', () => {
  it('renders all sub-components', () => {
    renderCard();

    expect(screen.getByText('Title')).toBeTruthy();
    expect(screen.getByText('Description')).toBeTruthy();
    expect(screen.getByText('$100')).toBeTruthy();
    expect(screen.getByText('Footer text')).toBeTruthy();
    expect(screen.getByText('Action')).toBeTruthy();
  });

  it('forwards testID', () => {
    renderCard();

    expect(screen.getByTestId('card')).toBeTruthy();
    expect(screen.getByTestId('card-header')).toBeTruthy();
    expect(screen.getByTestId('card-footer')).toBeTruthy();
  });

  describe('interactive (default)', () => {
    it('has accessibilityRole="button" when onPress is provided', () => {
      const onPress = jest.fn();
      renderCard({ onPress });

      const card = screen.getByTestId('card');
      expect(card.props.accessibilityRole).toBe('button');
    });

    it('triggers onPress on press', () => {
      const onPress = jest.fn();
      renderCard({ onPress });

      fireEvent.press(screen.getByTestId('card'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('does not trigger onPress when disabled', () => {
      const onPress = jest.fn();
      renderCard({ onPress, disabled: true });

      const card = screen.getByTestId('card');
      fireEvent.press(card);
      expect(onPress).not.toHaveBeenCalled();
      expect(card.props.accessibilityState?.disabled).toBe(true);
    });
  });

  describe('outlined', () => {
    // The outline lives on the card container, the single child of the root
    // element that carries the consumer testID.
    const containerStyle = (): ViewStyle => {
      const root = screen.toJSON();
      const container =
        root && !Array.isArray(root) ? root.children?.[0] : null;
      if (!container || typeof container === 'string') {
        throw new Error('Expected the card container element');
      }
      return container.props.style;
    };

    it('draws the selection state as an inset outline, outside the box model', () => {
      renderCard({ outlined: true });

      expect(containerStyle()).toMatchObject({
        outlineWidth: 2,
        outlineOffset: -2,
      });
      expect(containerStyle().borderWidth).toBeUndefined();
    });

    it('does not draw an outline by default', () => {
      renderCard({ outlined: false });

      expect(containerStyle().outlineWidth).toBeUndefined();
    });
  });

  describe('expandable', () => {
    it('header has accessibilityRole="button" and expanded state', () => {
      const onPress = jest.fn();
      renderCard({ type: 'expandable', expanded: false, onPress });

      const header = screen.getByTestId('card-header');
      expect(header.props.accessibilityRole).toBe('button');
      expect(header.props.accessibilityState?.expanded).toBe(false);
    });

    it('header triggers onPress on press', () => {
      const onPress = jest.fn();
      renderCard({ type: 'expandable', expanded: false, onPress });

      fireEvent.press(screen.getByTestId('card-header'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('card root is not pressable', () => {
      const onPress = jest.fn();
      renderCard({ type: 'expandable', expanded: false, onPress });

      const card = screen.getByTestId('card');
      expect(card.props.accessibilityRole).not.toBe('button');
    });

    it('header shows expanded=true when expanded', () => {
      renderCard({
        type: 'expandable',
        expanded: true,
        onPress: jest.fn(),
      });

      const header = screen.getByTestId('card-header');
      expect(header.props.accessibilityState?.expanded).toBe(true);
    });
  });

  describe('info', () => {
    it('has no accessibilityRole="button"', () => {
      renderCard({ type: 'info' });

      const card = screen.getByTestId('card');
      expect(card.props.accessibilityRole).not.toBe('button');
    });

    it('is not pressable', () => {
      const onPress = jest.fn();
      renderCard({ type: 'info', onPress });

      const card = screen.getByTestId('card');
      expect(card.props.accessibilityRole).not.toBe('button');
    });
  });

  describe('CardFooter appearance', () => {
    it.each(['plain', 'no-background'] as const)(
      'renders with %s appearance',
      (appearance) => {
        render(
          <TestWrapper>
            <Card>
              <CardHeader>
                <CardLeading>
                  <CardContentTitle>Title</CardContentTitle>
                </CardLeading>
              </CardHeader>
              <CardFooter appearance={appearance} testID='card-footer'>
                <CardContentDescription>Footer text</CardContentDescription>
              </CardFooter>
            </Card>
          </TestWrapper>,
        );

        expect(screen.getByTestId('card-footer')).toBeTruthy();
        expect(screen.getByText('Footer text')).toBeTruthy();
      },
    );
  });

  describe('CardContentRow', () => {
    it('renders title alongside additional content in a row', () => {
      render(
        <TestWrapper>
          <Card>
            <CardHeader>
              <CardLeading>
                <CardContent>
                  <CardContentRow testID='content-row'>
                    <CardContentTitle>Bitcoin</CardContentTitle>
                    <RNText>Tag</RNText>
                  </CardContentRow>
                  <CardContentDescription>BTC</CardContentDescription>
                </CardContent>
              </CardLeading>
            </CardHeader>
          </Card>
        </TestWrapper>,
      );

      expect(screen.getByTestId('content-row')).toBeTruthy();
      expect(screen.getByText('Bitcoin')).toBeTruthy();
      expect(screen.getByText('Tag')).toBeTruthy();
      expect(screen.getByText('BTC')).toBeTruthy();
    });
  });
});

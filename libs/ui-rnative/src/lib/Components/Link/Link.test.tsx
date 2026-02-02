import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, fireEvent, screen } from '@testing-library/react-native';
import React from 'react';
import { Linking } from 'react-native';

import { Information } from '../../Symbols';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { Link } from './Link';
import { LinkProps } from './types';

// Mock Linking module - use spyOn after import to handle RN 0.79+ module structure
const mockOpenURL = jest.fn(() => Promise.resolve());
jest.spyOn(Linking, 'openURL').mockImplementation(mockOpenURL);

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
      {component}
    </ThemeProvider>,
  );
};

const typographyTokens = ledgerLiveThemes.dark.typographies.sm;
const typographies = {
  ...typographyTokens.heading,
  ...typographyTokens.body,
};
const { colors, spacings } = ledgerLiveThemes.dark;

describe('Link Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render children and have link accessibility role', () => {
      renderWithProvider(
        <Link href='https://example.com' testID='link'>
          Click me
        </Link>,
      );

      expect(screen.getByText('Click me').props.children).toBe('Click me');
      expect(screen.getByTestId('link').props.accessibilityRole).toBe('link');
    });

    it('should truncate text to single line', () => {
      renderWithProvider(<Link href='https://example.com'>Link</Link>);
      expect(screen.getByText('Link').props.numberOfLines).toBe(1);
    });
  });

  describe('Appearances', () => {
    it.each([
      ['base', colors.text.base],
      ['accent', colors.text.interactive],
    ])(
      'should apply %s appearance with correct text color',
      (appearance, expectedColor) => {
        renderWithProvider(
          <Link
            href='https://example.com'
            appearance={appearance as LinkProps['appearance']}
          >
            Link
          </Link>,
        );
        expect(screen.getByText('Link').props.style.color).toBe(expectedColor);
      },
    );
  });

  describe('Sizes', () => {
    it.each([
      ['sm', typographies.body2SemiBold, spacings.s4],
      ['md', typographies.body1SemiBold, spacings.s8],
    ])(
      'should apply %s size with correct typography and gap',
      (size, typography, expectedGap) => {
        renderWithProvider(
          <Link href='https://example.com' size={size as LinkProps['size']}>
            Link
          </Link>,
        );

        const textStyle = screen.getByText('Link').props.style;
        expect(textStyle.fontSize).toBe(typography.fontSize);
        expect(textStyle.fontWeight).toBe(typography.fontWeight);
        expect(screen.getByTestId('link-content').props.style.gap).toBe(
          expectedGap,
        );
      },
    );
  });

  describe('Underline', () => {
    it.each([
      [true, 'underline'],
      [false, 'none'],
    ])(
      'should have textDecorationLine=%s when underline=%s',
      (underline, expectedDecoration) => {
        renderWithProvider(
          <Link href='https://example.com' underline={underline}>
            Link
          </Link>,
        );
        expect(screen.getByText('Link').props.style.textDecorationLine).toBe(
          expectedDecoration,
        );
      },
    );
  });

  describe('Icons', () => {
    it('should render leading icon when provided', () => {
      renderWithProvider(
        <Link href='https://example.com' icon={Information}>
          With Icon
        </Link>,
      );

      const children = React.Children.toArray(
        screen.getByTestId('link-content').props.children,
      );
      expect(children.length).toBe(2); // icon + text wrapper
    });

    it('should render external link icon when isExternal is true', () => {
      renderWithProvider(
        <Link href='https://example.com' isExternal>
          External
        </Link>,
      );

      const children = React.Children.toArray(
        screen.getByTestId('link-content').props.children,
      );
      expect(children.length).toBe(2); // text wrapper + external icon
    });
  });

  describe('Interactions', () => {
    it.each([
      ['https://example.com', 'https://example.com'],
      ['mailto:test@example.com', 'mailto:test@example.com'],
      ['tel:+1234567890', 'tel:+1234567890'],
    ])(
      'should call Linking.openURL with %s when pressed',
      (href, expectedUrl) => {
        renderWithProvider(<Link href={href}>Link</Link>);

        fireEvent.press(screen.getByText('Link'));

        expect(Linking.openURL).toHaveBeenCalledTimes(1);
        expect(Linking.openURL).toHaveBeenCalledWith(expectedUrl);
      },
    );

    it('should call custom onPress instead of Linking.openURL', () => {
      const onPress = jest.fn();
      renderWithProvider(
        <Link href='https://example.com' onPress={onPress}>
          Custom
        </Link>,
      );

      fireEvent.press(screen.getByText('Custom'));

      expect(onPress).toHaveBeenCalledTimes(1);
      expect(Linking.openURL).not.toHaveBeenCalled();
    });
  });
});

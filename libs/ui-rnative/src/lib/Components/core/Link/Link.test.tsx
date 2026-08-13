import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { Children } from 'react';
import { Linking } from 'react-native';

import { Information } from '../../symbols';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { Link } from './Link';
import type { LinkProps } from './types';

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

type LinkElement = ReturnType<typeof screen.getByText>;
type IconWrapperStyle = {
  paddingLeft?: number;
  paddingRight?: number;
  transform?: { translateY: number }[];
};

// Icons are rendered inline as children of the link Text, so they are read from
// the element tree rather than queried by testID.
const getLinkChildren = (link: LinkElement): React.ReactNode[] =>
  Children.toArray(link.props.children as React.ReactNode);

const getIconWrapperStyle = (link: LinkElement): IconWrapperStyle => {
  const [iconWrapper] = getLinkChildren(link) as React.ReactElement<{
    style: IconWrapperStyle;
  }>[];
  return iconWrapper.props.style;
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

      expect(screen.getByText('Click me')).toBe(screen.getByTestId('link'));
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
      ['sm', typographies.body2SemiBold, spacings.s4, 3],
      ['md', typographies.body1SemiBold, spacings.s8, 4],
    ])(
      'should apply %s size with correct typography and icon spacing',
      (size, typography, expectedGap, expectedOffset) => {
        renderWithProvider(
          <Link
            href='https://example.com'
            size={size as LinkProps['size']}
            icon={Information}
          >
            Link
          </Link>,
        );

        const textStyle = screen.getByText('Link').props.style;
        expect(textStyle.fontSize).toBe(typography.fontSize);
        expect(textStyle.fontWeight).toBe(typography.fontWeight);

        const iconStyle = getIconWrapperStyle(screen.getByText('Link'));
        expect(iconStyle.paddingRight).toBe(expectedGap);
        // Keeps the inline icons optically centred on the text baseline.
        expect(iconStyle.transform).toEqual([{ translateY: expectedOffset }]);
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

  describe('States', () => {
    it.each([
      ['base', colors.text.base, colors.text.basePressed],
      ['accent', colors.text.interactive, colors.text.interactivePressed],
    ])(
      'should apply the %s pressed color while pressed',
      (appearance, restingColor, pressedColor) => {
        renderWithProvider(
          <Link
            href='https://example.com'
            appearance={appearance as LinkProps['appearance']}
          >
            Link
          </Link>,
        );

        fireEvent(screen.getByText('Link'), 'onPressIn');
        expect(screen.getByText('Link').props.style.color).toBe(pressedColor);

        fireEvent(screen.getByText('Link'), 'onPressOut');
        expect(screen.getByText('Link').props.style.color).toBe(restingColor);
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

      const link = screen.getByText('With Icon');
      expect(getLinkChildren(link).length).toBe(2); // icon + label
      expect(getIconWrapperStyle(link).paddingRight).toBe(spacings.s8);
    });

    it('should render external link icon when isExternal is true', () => {
      renderWithProvider(
        <Link href='https://example.com' isExternal>
          External
        </Link>,
      );

      const children = getLinkChildren(screen.getByText('External'));
      expect(children.length).toBe(2); // label + external icon
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

import { describe, it, expect, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, screen, fireEvent } from '@testing-library/react-native';
import React from 'react';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import {
  NavBar,
  NavBarBackButton,
  NavBarTitle,
  NavBarDescription,
  NavBarCoinCapsule,
} from './NavBar';

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
      {component}
    </ThemeProvider>,
  );
};

const MockIcon = () => <></>;

describe('NavBar', () => {
  describe('Rendering', () => {
    it('should render with title', () => {
      renderWithProvider(
        <NavBar testID='navbar' appearance='compact'>
          <NavBarTitle>Test Title</NavBarTitle>
        </NavBar>,
      );

      expect(screen.getByText('Test Title')).toBeTruthy();
      expect(screen.getByTestId('navbar')).toBeTruthy();
    });

    it('should render with title and description', () => {
      renderWithProvider(
        <NavBar testID='navbar' appearance='expanded'>
          <NavBarTitle>Test Title</NavBarTitle>
          <NavBarDescription>Test Description</NavBarDescription>
        </NavBar>,
      );

      expect(screen.getByText('Test Title')).toBeTruthy();
      expect(screen.getByText('Test Description')).toBeTruthy();
    });

    it('should render with back button', () => {
      const onPress = jest.fn();
      renderWithProvider(
        <NavBar testID='navbar' appearance='compact'>
          <NavBarBackButton onPress={onPress} />
          <NavBarTitle>Test Title</NavBarTitle>
        </NavBar>,
      );

      expect(screen.getByLabelText('Go back')).toBeTruthy();
    });

    it('should render with coin capsule', () => {
      renderWithProvider(
        <NavBar testID='navbar' appearance='with-asset'>
          <NavBarCoinCapsule ticker='BTC' icon={<MockIcon />} />
        </NavBar>,
      );

      expect(screen.getByText('BTC')).toBeTruthy();
    });

    it('should render with all components', () => {
      const onPress = jest.fn();
      renderWithProvider(
        <NavBar testID='navbar' appearance='expanded'>
          <NavBarBackButton onPress={onPress} />
          <NavBarTitle>Test Title</NavBarTitle>
          <NavBarDescription>Test Description</NavBarDescription>
        </NavBar>,
      );

      expect(screen.getByLabelText('Go back')).toBeTruthy();
      expect(screen.getByText('Test Title')).toBeTruthy();
      expect(screen.getByText('Test Description')).toBeTruthy();
    });
  });

  describe('Appearances', () => {
    it.each(['compact', 'expanded', 'with-asset'] as const)(
      'should render with %s appearance',
      (appearance) => {
        renderWithProvider(
          <NavBar testID='navbar' appearance={appearance}>
            <NavBarTitle>Test Title</NavBarTitle>
          </NavBar>,
        );

        expect(screen.getByTestId('navbar')).toBeTruthy();
      },
    );
  });

  describe('NavBarTitle', () => {
    it('should truncate to 1 line in compact mode', () => {
      renderWithProvider(
        <NavBar appearance='compact'>
          <NavBarTitle testID='title'>Very long title text</NavBarTitle>
        </NavBar>,
      );

      const title = screen.getByTestId('title');
      expect(title.props.numberOfLines).toBe(1);
    });

    it('should truncate to 2 lines in expanded mode', () => {
      renderWithProvider(
        <NavBar appearance='expanded'>
          <NavBarTitle testID='title'>Very long title text</NavBarTitle>
        </NavBar>,
      );

      const title = screen.getByTestId('title');
      expect(title.props.numberOfLines).toBe(2);
    });

    it('should accept custom style prop', () => {
      const customStyle = { opacity: 0.5 };
      renderWithProvider(
        <NavBar appearance='compact'>
          <NavBarTitle testID='title' style={customStyle}>
            Test
          </NavBarTitle>
        </NavBar>,
      );

      const title = screen.getByTestId('title');
      const styles = Array.isArray(title.props.style)
        ? title.props.style
        : [title.props.style];
      expect(styles.some((s: { opacity?: number }) => s?.opacity === 0.5)).toBe(
        true,
      );
    });
  });

  describe('NavBarDescription', () => {
    it('should always truncate to 1 line', () => {
      renderWithProvider(
        <NavBar appearance='expanded'>
          <NavBarTitle>Title</NavBarTitle>
          <NavBarDescription testID='description'>
            Very long description text
          </NavBarDescription>
        </NavBar>,
      );

      const description = screen.getByTestId('description');
      expect(description.props.numberOfLines).toBe(1);
    });

    it('should accept custom style prop', () => {
      const customStyle = { opacity: 0.7 };
      renderWithProvider(
        <NavBar appearance='expanded'>
          <NavBarTitle>Title</NavBarTitle>
          <NavBarDescription testID='description' style={customStyle}>
            Test
          </NavBarDescription>
        </NavBar>,
      );

      const description = screen.getByTestId('description');
      const styles = Array.isArray(description.props.style)
        ? description.props.style
        : [description.props.style];
      expect(styles.some((s: { opacity?: number }) => s?.opacity === 0.7)).toBe(
        true,
      );
    });
  });

  describe('NavBarBackButton', () => {
    it('should call onPress when pressed', () => {
      const handlePress = jest.fn();
      renderWithProvider(
        <NavBar appearance='compact'>
          <NavBarBackButton onPress={handlePress} />
          <NavBarTitle>Test Title</NavBarTitle>
        </NavBar>,
      );

      fireEvent.press(screen.getByLabelText('Go back'));
      expect(handlePress).toHaveBeenCalledTimes(1);
    });

    it('should accept custom accessibilityLabel', () => {
      const handlePress = jest.fn();
      renderWithProvider(
        <NavBar appearance='compact'>
          <NavBarBackButton
            onPress={handlePress}
            accessibilityLabel='Navigate back'
          />
          <NavBarTitle>Test Title</NavBarTitle>
        </NavBar>,
      );

      expect(screen.getByLabelText('Navigate back')).toBeTruthy();
    });
  });

  describe('NavBarCoinCapsule', () => {
    it('should render ticker and icon', () => {
      renderWithProvider(
        <NavBar appearance='with-asset'>
          <NavBarCoinCapsule ticker='ETH' icon={<MockIcon />} />
        </NavBar>,
      );

      expect(screen.getByText('ETH')).toBeTruthy();
    });
  });

  describe('Slot extraction', () => {
    it('should only render title and description in non-asset mode', () => {
      renderWithProvider(
        <NavBar appearance='compact'>
          <NavBarTitle>Title</NavBarTitle>
          <NavBarDescription>Description</NavBarDescription>
          <NavBarCoinCapsule ticker='BTC' icon={<MockIcon />} />
        </NavBar>,
      );

      expect(screen.getByText('Title')).toBeTruthy();
      expect(screen.getByText('Description')).toBeTruthy();
      expect(screen.queryByText('BTC')).toBeNull();
    });

    it('should only render coin capsule in asset mode', () => {
      renderWithProvider(
        <NavBar appearance='with-asset'>
          <NavBarTitle>Title</NavBarTitle>
          <NavBarDescription>Description</NavBarDescription>
          <NavBarCoinCapsule ticker='BTC' icon={<MockIcon />} />
        </NavBar>,
      );

      expect(screen.queryByText('Title')).toBeNull();
      expect(screen.queryByText('Description')).toBeNull();
      expect(screen.getByText('BTC')).toBeTruthy();
    });

    it('should render back button in all modes', () => {
      const onPress = jest.fn();
      const { rerender } = renderWithProvider(
        <NavBar appearance='compact'>
          <NavBarBackButton onPress={onPress} />
          <NavBarTitle>Title</NavBarTitle>
        </NavBar>,
      );

      expect(screen.getByLabelText('Go back')).toBeTruthy();

      rerender(
        <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
          <NavBar appearance='expanded'>
            <NavBarBackButton onPress={onPress} />
            <NavBarTitle>Title</NavBarTitle>
          </NavBar>
        </ThemeProvider>,
      );

      expect(screen.getByLabelText('Go back')).toBeTruthy();

      rerender(
        <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
          <NavBar appearance='with-asset'>
            <NavBarBackButton onPress={onPress} />
            <NavBarCoinCapsule ticker='BTC' icon={<MockIcon />} />
          </NavBar>
        </ThemeProvider>,
      );

      expect(screen.getByLabelText('Go back')).toBeTruthy();
    });
  });

  describe('Context', () => {
    it('should throw error when NavBarTitle used outside NavBar', () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = jest.fn();

      expect(() => {
        renderWithProvider(<NavBarTitle>Title</NavBarTitle>);
      }).toThrow();

      console.error = originalError;
    });

    it('should throw error when NavBarDescription used outside NavBar', () => {
      const originalError = console.error;
      console.error = jest.fn();

      expect(() => {
        renderWithProvider(<NavBarDescription>Description</NavBarDescription>);
      }).toThrow();

      console.error = originalError;
    });

    it('should throw error when NavBarCoinCapsule used outside NavBar', () => {
      const originalError = console.error;
      console.error = jest.fn();

      expect(() => {
        renderWithProvider(
          <NavBarCoinCapsule ticker='BTC' icon={<MockIcon />} />,
        );
      }).toThrow();

      console.error = originalError;
    });
  });
});

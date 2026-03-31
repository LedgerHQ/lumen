import { describe, expect, it, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { Settings, Plus } from '../../Symbols';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { IconButton } from './IconButton';

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
      {component}
    </ThemeProvider>,
  );
};

describe('IconButton Component', () => {
  describe('Rendering', () => {
    it('should render with required props', () => {
      renderWithProvider(
        <IconButton
          testID='icon-button'
          accessibilityLabel='Settings'
          icon={Settings}
        />,
      );
      expect(screen.getByTestId('icon-button')).toBeTruthy();
    });

    it('should have correct accessibility role', () => {
      renderWithProvider(
        <IconButton
          testID='icon-button'
          accessibilityLabel='Settings'
          icon={Settings}
        />,
      );
      const button = screen.getByTestId('icon-button');
      expect(button.props.accessibilityRole).toBe('button');
    });
  });

  describe('Appearances', () => {
    it.each([
      'base',
      'accent',
      'gray',
      'transparent',
      'no-background',
      'red',
    ] as const)('should render with %s appearance', (appearance) => {
      renderWithProvider(
        <IconButton
          testID='icon-button'
          accessibilityLabel='Add'
          icon={Plus}
          appearance={appearance}
        />,
      );
      expect(screen.getByTestId('icon-button')).toBeTruthy();
    });
  });

  describe('Sizes', () => {
    it.each(['xs', 'sm', 'md', 'lg'] as const)(
      'should render with %s size',
      (size) => {
        renderWithProvider(
          <IconButton
            testID='icon-button'
            accessibilityLabel='Settings'
            icon={Settings}
            size={size}
          />,
        );
        expect(screen.getByTestId('icon-button')).toBeTruthy();
      },
    );
  });

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      renderWithProvider(
        <IconButton
          testID='icon-button'
          accessibilityLabel='Settings'
          icon={Settings}
          disabled
        />,
      );
      const button = screen.getByTestId('icon-button');
      expect(button.props.accessibilityState.disabled).toBe(true);
    });

    it('should render loading state', () => {
      renderWithProvider(
        <IconButton
          testID='icon-button'
          accessibilityLabel='Settings'
          icon={Settings}
          loading
        />,
      );
      expect(screen.getByTestId('icon-button')).toBeTruthy();
    });
  });

  describe('Interactions', () => {
    it('should call onPress when pressed', () => {
      const handlePress = jest.fn();
      renderWithProvider(
        <IconButton
          testID='icon-button'
          accessibilityLabel='Settings'
          icon={Settings}
          onPress={handlePress}
        />,
      );

      fireEvent.press(screen.getByTestId('icon-button'));
      expect(handlePress).toHaveBeenCalledTimes(1);
    });

    it('should not call onPress when disabled', () => {
      const handlePress = jest.fn();
      renderWithProvider(
        <IconButton
          testID='icon-button'
          accessibilityLabel='Settings'
          icon={Settings}
          onPress={handlePress}
          disabled
        />,
      );

      fireEvent.press(screen.getByTestId('icon-button'));
      expect(handlePress).not.toHaveBeenCalled();
    });
  });
});

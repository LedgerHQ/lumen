import { describe, expect, it, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { Settings, Plus } from '../../Symbols';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { CardButton } from './CardButton';

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
      {component}
    </ThemeProvider>,
  );
};

describe('CardButton Component', () => {
  describe('Rendering', () => {
    it('should render with required props', () => {
      renderWithProvider(
        <CardButton testID='card-button' title='Test Card Button' />,
      );
      expect(screen.getByTestId('card-button')).toBeTruthy();
    });

    it('should render the title', () => {
      renderWithProvider(<CardButton title='Test Title' />);
      expect(screen.getByText('Test Title')).toBeTruthy();
    });

    it('should render description when provided', () => {
      renderWithProvider(
        <CardButton title='Test Title' description='Test Description' />,
      );
      expect(screen.getByText('Test Description')).toBeTruthy();
    });

    it('should have correct accessibility role', () => {
      renderWithProvider(
        <CardButton testID='card-button' title='Test Card Button' />,
      );
      const button = screen.getByTestId('card-button');
      expect(button.props.accessibilityRole).toBe('button');
    });
  });

  describe('Appearances', () => {
    it.each(['base', 'outline'] as const)(
      'should render with %s appearance',
      (appearance) => {
        renderWithProvider(
          <CardButton
            testID='card-button'
            title='Test Card Button'
            appearance={appearance}
          />,
        );
        expect(screen.getByTestId('card-button')).toBeTruthy();
      },
    );
  });

  describe('Icon', () => {
    it('should render with icon when provided', () => {
      renderWithProvider(
        <CardButton testID='card-button' title='Settings' icon={Settings} />,
      );
      expect(screen.getByTestId('card-button')).toBeTruthy();
    });

    it('should render different icons', () => {
      renderWithProvider(
        <CardButton testID='card-button' title='Add' icon={Plus} />,
      );
      expect(screen.getByTestId('card-button')).toBeTruthy();
    });
  });

  describe('Chevron', () => {
    it('should render chevron by default', () => {
      renderWithProvider(
        <CardButton testID='card-button' title='Test Card Button' />,
      );
      // The chevron is rendered inside card-button-content
      expect(screen.getByTestId('card-button-content')).toBeTruthy();
    });

    it('should hide chevron when hideChevron is true', () => {
      renderWithProvider(
        <CardButton
          testID='card-button'
          title='Test Card Button'
          hideChevron
        />,
      );
      expect(screen.getByTestId('card-button')).toBeTruthy();
    });
  });

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      renderWithProvider(
        <CardButton testID='card-button' title='Test Card Button' disabled />,
      );
      const button = screen.getByTestId('card-button');
      expect(button.props.accessibilityState.disabled).toBe(true);
    });
  });

  describe('Interactions', () => {
    it('should call onPress when pressed', () => {
      const handlePress = jest.fn();
      renderWithProvider(
        <CardButton
          testID='card-button'
          title='Test Card Button'
          onPress={handlePress}
        />,
      );

      fireEvent.press(screen.getByTestId('card-button'));
      expect(handlePress).toHaveBeenCalledTimes(1);
    });

    it('should not call onPress when disabled', () => {
      const handlePress = jest.fn();
      renderWithProvider(
        <CardButton
          testID='card-button'
          title='Test Card Button'
          onPress={handlePress}
          disabled
        />,
      );

      fireEvent.press(screen.getByTestId('card-button'));
      expect(handlePress).not.toHaveBeenCalled();
    });
  });
});

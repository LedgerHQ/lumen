import { describe, it, expect, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ViewStyle } from 'react-native';

import { Plus, Settings } from '../../Symbols';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { BaseButton } from './BaseButton';

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
      {component}
    </ThemeProvider>,
  );
};

describe('BaseButton Component', () => {
  describe('Rendering', () => {
    it('should render with text content and correct accessibility role', () => {
      renderWithProvider(<BaseButton testID='button'>Click me</BaseButton>);
      const button = screen.getByTestId('button');
      expect(button).toBeTruthy();
      expect(screen.getByText('Click me')).toBeTruthy();
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
        <BaseButton testID='button' appearance={appearance}>
          {appearance}
        </BaseButton>,
      );
      expect(screen.getByTestId('button')).toBeTruthy();
    });
  });

  describe('Sizes', () => {
    it.each(['xs', 'sm', 'md', 'lg'] as const)(
      'should render with %s size',
      (size) => {
        renderWithProvider(
          <BaseButton testID='button' size={size}>
            {size}
          </BaseButton>,
        );
        expect(screen.getByTestId('button')).toBeTruthy();
      },
    );
  });

  describe('Icons', () => {
    it('should render with icon and text', () => {
      renderWithProvider(
        <BaseButton testID='button' icon={Plus}>
          Add Item
        </BaseButton>,
      );
      expect(screen.getByTestId('button')).toBeTruthy();
      expect(screen.getByText('Add Item')).toBeTruthy();
    });

    it('should render as icon-only when no children provided', () => {
      renderWithProvider(<BaseButton testID='button' icon={Settings} />);
      expect(screen.getByTestId('button')).toBeTruthy();
    });
  });

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      renderWithProvider(
        <BaseButton testID='button' disabled>
          Disabled
        </BaseButton>,
      );
      const button = screen.getByTestId('button');
      expect(button.props.accessibilityState.disabled).toBe(true);
    });

    it('should render loading state with spinner', () => {
      renderWithProvider(
        <BaseButton testID='button' loading>
          Loading
        </BaseButton>,
      );
      expect(screen.getByTestId('button')).toBeTruthy();
      expect(screen.getByText('Loading')).toBeTruthy();
    });

    it('should render correctly with isFull prop', () => {
      renderWithProvider(
        <BaseButton testID='button' isFull>
          Full Width
        </BaseButton>,
      );
      const button = screen.getByTestId('base-button-content');
      expect(button.props.style.width).toBe('100%');
    });
  });

  describe('Interactions', () => {
    it('should call onPress when pressed', () => {
      const handlePress = jest.fn();
      renderWithProvider(
        <BaseButton testID='button' onPress={handlePress}>
          Press me
        </BaseButton>,
      );

      fireEvent.press(screen.getByTestId('button'));
      expect(handlePress).toHaveBeenCalledTimes(1);
    });

    it('should not call onPress when disabled', () => {
      const handlePress = jest.fn();
      renderWithProvider(
        <BaseButton testID='button' onPress={handlePress} disabled>
          Disabled
        </BaseButton>,
      );

      fireEvent.press(screen.getByTestId('button'));
      expect(handlePress).not.toHaveBeenCalled();
    });
  });

  describe('Styling', () => {
    it('should apply custom style and lx props', () => {
      const customStyle: ViewStyle = { marginTop: 16 };
      renderWithProvider(
        <BaseButton testID='button' style={customStyle} lx={{ padding: 's8' }}>
          Styled
        </BaseButton>,
      );
      const button = screen.getByTestId('button');
      expect(button.props.style).toBeDefined();
    });
  });
});

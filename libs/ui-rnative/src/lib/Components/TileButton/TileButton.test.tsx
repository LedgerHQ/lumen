import { describe, it, expect, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, screen, fireEvent } from '@testing-library/react-native';
import React from 'react';
import { ViewStyle } from 'react-native';

import { Settings } from '../../Symbols';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { TileButton } from './TileButton';

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
      {component}
    </ThemeProvider>,
  );
};

describe('TileButton Component', () => {
  describe('Rendering', () => {
    it('should render with icon and text content', () => {
      renderWithProvider(
        <TileButton testID='tile-button' icon={Settings}>
          Settings
        </TileButton>,
      );
      const button = screen.getByTestId('tile-button');
      expect(button).toBeTruthy();
      expect(screen.getByText('Settings')).toBeTruthy();
      expect(button.props.accessibilityRole).toBe('button');
    });
  });

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      renderWithProvider(
        <TileButton testID='tile-button' icon={Settings} disabled>
          Disabled
        </TileButton>,
      );
      const button = screen.getByTestId('tile-button');
      expect(button.props.accessibilityState.disabled).toBe(true);
    });

    it('should render correctly with isFull prop', () => {
      renderWithProvider(
        <TileButton testID='tile-button' icon={Settings} isFull>
          Full Width
        </TileButton>,
      );
      const content = screen.getByTestId('tile-button-content');
      expect(content.props.style.width).toBe('100%');
    });
  });

  describe('Interactions', () => {
    it('should call onPress when pressed', () => {
      const handlePress = jest.fn();
      renderWithProvider(
        <TileButton testID='tile-button' icon={Settings} onPress={handlePress}>
          Press me
        </TileButton>,
      );

      fireEvent.press(screen.getByTestId('tile-button'));
      expect(handlePress).toHaveBeenCalledTimes(1);
    });

    it('should not call onPress when disabled', () => {
      const handlePress = jest.fn();
      renderWithProvider(
        <TileButton
          testID='tile-button'
          icon={Settings}
          onPress={handlePress}
          disabled
        >
          Disabled
        </TileButton>,
      );

      fireEvent.press(screen.getByTestId('tile-button'));
      expect(handlePress).not.toHaveBeenCalled();
    });
  });

  describe('Styling', () => {
    it('should apply custom style and lx props', () => {
      const customStyle: ViewStyle = { marginTop: 16 };
      renderWithProvider(
        <TileButton
          testID='tile-button'
          icon={Settings}
          style={customStyle}
          lx={{ padding: 's8' }}
        >
          Styled
        </TileButton>,
      );
      const button = screen.getByTestId('tile-button');
      expect(button.props.style).toBeDefined();
    });
  });
});

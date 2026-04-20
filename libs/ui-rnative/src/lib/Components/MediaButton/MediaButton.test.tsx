import { describe, it, expect, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { createRef } from 'react';
import type { ViewStyle } from 'react-native';
import { View } from 'react-native';

import { Settings } from '../../Symbols';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { MediaButton } from './MediaButton';

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
      {component}
    </ThemeProvider>,
  );
};

describe('MediaButton', () => {
  describe('Rendering', () => {
    it('should render with label text and correct accessibility role', () => {
      renderWithProvider(
        <MediaButton testID='trigger'>All accounts</MediaButton>,
      );
      const trigger = screen.getByTestId('trigger');
      expect(trigger).toBeTruthy();
      expect(screen.getByText('All accounts')).toBeTruthy();
      expect(trigger.props.accessibilityRole).toBe('button');
    });

    it('should always render a chevron icon', () => {
      renderWithProvider(<MediaButton testID='trigger'>Label</MediaButton>);
      expect(screen.getByTestId('button-trigger-chevron')).toBeTruthy();
    });

    it.each(['gray', 'transparent', 'no-background'] as const)(
      'should render without errors for appearance "%s"',
      (appearance) => {
        renderWithProvider(
          <MediaButton testID='trigger' appearance={appearance}>
            Label
          </MediaButton>,
        );
        expect(screen.getByTestId('trigger')).toBeTruthy();
      },
    );

    it.each(['sm', 'md'] as const)(
      'should render without errors for size "%s"',
      (size) => {
        renderWithProvider(
          <MediaButton testID='trigger' size={size}>
            Label
          </MediaButton>,
        );
        expect(screen.getByTestId('trigger')).toBeTruthy();
      },
    );
  });

  describe('Icons', () => {
    it('should render with a flat interface icon', () => {
      renderWithProvider(
        <MediaButton
          testID='trigger'
          icon={<Settings size={20} testID='icon' />}
          iconType='flat'
        >
          Network
        </MediaButton>,
      );
      expect(screen.getByTestId('icon')).toBeTruthy();
      expect(screen.getByText('Network')).toBeTruthy();
    });

    it('should render with a rounded icon', () => {
      renderWithProvider(
        <MediaButton
          testID='trigger'
          icon={<View testID='crypto-icon' />}
          iconType='rounded'
        >
          Bitcoin
        </MediaButton>,
      );
      expect(screen.getByTestId('crypto-icon')).toBeTruthy();
      expect(screen.getByText('Bitcoin')).toBeTruthy();
    });
  });

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      renderWithProvider(
        <MediaButton testID='trigger' disabled>
          Label
        </MediaButton>,
      );
      const trigger = screen.getByTestId('trigger');
      expect(trigger.props.accessibilityState.disabled).toBe(true);
    });
  });

  describe('Interactions', () => {
    it('should call onPress when pressed', () => {
      const handlePress = jest.fn();
      renderWithProvider(
        <MediaButton testID='trigger' onPress={handlePress}>
          Press me
        </MediaButton>,
      );

      fireEvent.press(screen.getByTestId('trigger'));
      expect(handlePress).toHaveBeenCalledTimes(1);
    });

    it('should not call onPress when disabled', () => {
      const handlePress = jest.fn();
      renderWithProvider(
        <MediaButton testID='trigger' onPress={handlePress} disabled>
          Disabled
        </MediaButton>,
      );

      fireEvent.press(screen.getByTestId('trigger'));
      expect(handlePress).not.toHaveBeenCalled();
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref', () => {
      const ref = createRef<View>();
      renderWithProvider(
        <MediaButton ref={ref} testID='trigger'>
          Label
        </MediaButton>,
      );
      expect(ref.current).toBeTruthy();
    });
  });

  describe('Styling', () => {
    it('should apply custom style and lx props', () => {
      const customStyle: ViewStyle = { marginTop: 16 };
      renderWithProvider(
        <MediaButton
          testID='trigger'
          style={customStyle}
          lx={{ padding: 's8' }}
        >
          Styled
        </MediaButton>,
      );
      const trigger = screen.getByTestId('trigger');
      expect(trigger.props.style).toBeDefined();
    });
  });
});

import { describe, it, expect, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, screen, fireEvent } from '@testing-library/react-native';
import React, { createRef } from 'react';
import { View, ViewStyle } from 'react-native';

import { Settings } from '../../Symbols';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { TriggerButton } from './TriggerButton';

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
      {component}
    </ThemeProvider>,
  );
};

describe('TriggerButton', () => {
  describe('Rendering', () => {
    it('should render with label text and correct accessibility role', () => {
      renderWithProvider(
        <TriggerButton testID='trigger'>All accounts</TriggerButton>,
      );
      const trigger = screen.getByTestId('trigger');
      expect(trigger).toBeTruthy();
      expect(screen.getByText('All accounts')).toBeTruthy();
      expect(trigger.props.accessibilityRole).toBe('button');
    });

    it('should always render a chevron icon', () => {
      renderWithProvider(<TriggerButton testID='trigger'>Label</TriggerButton>);
      expect(screen.getByTestId('button-trigger-chevron')).toBeTruthy();
    });

    it.each(['gray', 'transparent', 'no-background'] as const)(
      'should render without errors for appearance "%s"',
      (appearance) => {
        renderWithProvider(
          <TriggerButton testID='trigger' appearance={appearance}>
            Label
          </TriggerButton>,
        );
        expect(screen.getByTestId('trigger')).toBeTruthy();
      },
    );

    it.each(['sm', 'md'] as const)(
      'should render without errors for size "%s"',
      (size) => {
        renderWithProvider(
          <TriggerButton testID='trigger' size={size}>
            Label
          </TriggerButton>,
        );
        expect(screen.getByTestId('trigger')).toBeTruthy();
      },
    );
  });

  describe('Icons', () => {
    it('should render with a flat interface icon', () => {
      renderWithProvider(
        <TriggerButton
          testID='trigger'
          icon={<Settings size={20} testID='icon' />}
          iconType='flat'
        >
          Network
        </TriggerButton>,
      );
      expect(screen.getByTestId('icon')).toBeTruthy();
      expect(screen.getByText('Network')).toBeTruthy();
    });

    it('should render with a rounded icon', () => {
      renderWithProvider(
        <TriggerButton
          testID='trigger'
          icon={<View testID='crypto-icon' />}
          iconType='rounded'
        >
          Bitcoin
        </TriggerButton>,
      );
      expect(screen.getByTestId('crypto-icon')).toBeTruthy();
      expect(screen.getByText('Bitcoin')).toBeTruthy();
    });
  });

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      renderWithProvider(
        <TriggerButton testID='trigger' disabled>
          Label
        </TriggerButton>,
      );
      const trigger = screen.getByTestId('trigger');
      expect(trigger.props.accessibilityState.disabled).toBe(true);
    });
  });

  describe('Interactions', () => {
    it('should call onPress when pressed', () => {
      const handlePress = jest.fn();
      renderWithProvider(
        <TriggerButton testID='trigger' onPress={handlePress}>
          Press me
        </TriggerButton>,
      );

      fireEvent.press(screen.getByTestId('trigger'));
      expect(handlePress).toHaveBeenCalledTimes(1);
    });

    it('should not call onPress when disabled', () => {
      const handlePress = jest.fn();
      renderWithProvider(
        <TriggerButton testID='trigger' onPress={handlePress} disabled>
          Disabled
        </TriggerButton>,
      );

      fireEvent.press(screen.getByTestId('trigger'));
      expect(handlePress).not.toHaveBeenCalled();
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref', () => {
      const ref = createRef<View>();
      renderWithProvider(
        <TriggerButton ref={ref} testID='trigger'>
          Label
        </TriggerButton>,
      );
      expect(ref.current).toBeTruthy();
    });
  });

  describe('Styling', () => {
    it('should apply custom style and lx props', () => {
      const customStyle: ViewStyle = { marginTop: 16 };
      renderWithProvider(
        <TriggerButton
          testID='trigger'
          style={customStyle}
          lx={{ padding: 's8' }}
        >
          Styled
        </TriggerButton>,
      );
      const trigger = screen.getByTestId('trigger');
      expect(trigger.props.style).toBeDefined();
    });
  });
});

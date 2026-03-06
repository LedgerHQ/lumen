import { describe, it, expect, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, screen, fireEvent } from '@testing-library/react-native';
import React, { createRef } from 'react';
import { View, ViewStyle } from 'react-native';

import { Settings } from '../../Symbols';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { ButtonTrigger } from './ButtonTrigger';

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
      {component}
    </ThemeProvider>,
  );
};

describe('ButtonTrigger', () => {
  describe('Rendering', () => {
    it('should render with label text and correct accessibility role', () => {
      renderWithProvider(
        <ButtonTrigger testID='trigger'>All accounts</ButtonTrigger>,
      );
      const trigger = screen.getByTestId('trigger');
      expect(trigger).toBeTruthy();
      expect(screen.getByText('All accounts')).toBeTruthy();
      expect(trigger.props.accessibilityRole).toBe('button');
    });

    it('should always render a chevron icon', () => {
      renderWithProvider(<ButtonTrigger testID='trigger'>Label</ButtonTrigger>);
      expect(screen.getByTestId('trigger')).toBeTruthy();
      expect(screen.getByTestId('button-trigger-content')).toBeTruthy();
    });

    it.each(['gray', 'transparent', 'no-background'] as const)(
      'should render without errors for appearance "%s"',
      appearance => {
        renderWithProvider(
          <ButtonTrigger testID='trigger' appearance={appearance}>
            Label
          </ButtonTrigger>,
        );
        expect(screen.getByTestId('trigger')).toBeTruthy();
      },
    );

    it.each(['sm', 'md'] as const)(
      'should render without errors for size "%s"',
      size => {
        renderWithProvider(
          <ButtonTrigger testID='trigger' size={size}>
            Label
          </ButtonTrigger>,
        );
        expect(screen.getByTestId('trigger')).toBeTruthy();
      },
    );
  });

  describe('Icons', () => {
    it('should render with a flat interface icon', () => {
      renderWithProvider(
        <ButtonTrigger
          testID='trigger'
          icon={<Settings size={20} testID='icon' />}
          iconType='flat'
        >
          Network
        </ButtonTrigger>,
      );
      expect(screen.getByTestId('icon')).toBeTruthy();
      expect(screen.getByText('Network')).toBeTruthy();
    });

    it('should render with a rounded icon', () => {
      renderWithProvider(
        <ButtonTrigger
          testID='trigger'
          icon={<View testID='crypto-icon' />}
          iconType='rounded'
        >
          Bitcoin
        </ButtonTrigger>,
      );
      expect(screen.getByTestId('crypto-icon')).toBeTruthy();
      expect(screen.getByText('Bitcoin')).toBeTruthy();
    });
  });

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      renderWithProvider(
        <ButtonTrigger testID='trigger' disabled>
          Label
        </ButtonTrigger>,
      );
      const trigger = screen.getByTestId('trigger');
      expect(trigger.props.accessibilityState.disabled).toBe(true);
    });
  });

  describe('Interactions', () => {
    it('should call onPress when pressed', () => {
      const handlePress = jest.fn();
      renderWithProvider(
        <ButtonTrigger testID='trigger' onPress={handlePress}>
          Press me
        </ButtonTrigger>,
      );

      fireEvent.press(screen.getByTestId('trigger'));
      expect(handlePress).toHaveBeenCalledTimes(1);
    });

    it('should not call onPress when disabled', () => {
      const handlePress = jest.fn();
      renderWithProvider(
        <ButtonTrigger testID='trigger' onPress={handlePress} disabled>
          Disabled
        </ButtonTrigger>,
      );

      fireEvent.press(screen.getByTestId('trigger'));
      expect(handlePress).not.toHaveBeenCalled();
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref', () => {
      const ref = createRef<View>();
      renderWithProvider(
        <ButtonTrigger ref={ref} testID='trigger'>
          Label
        </ButtonTrigger>,
      );
      expect(ref.current).toBeTruthy();
    });
  });

  describe('Styling', () => {
    it('should apply custom style and lx props', () => {
      const customStyle: ViewStyle = { marginTop: 16 };
      renderWithProvider(
        <ButtonTrigger
          testID='trigger'
          style={customStyle}
          lx={{ padding: 's8' }}
        >
          Styled
        </ButtonTrigger>,
      );
      const trigger = screen.getByTestId('trigger');
      expect(trigger.props.style).toBeDefined();
    });
  });
});

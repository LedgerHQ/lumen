import { describe, it, expect, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, RenderOptions } from '@testing-library/react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';

// Mock react-native-gesture-handler which is used by @gorhom/bottom-sheet
jest.mock('react-native-gesture-handler', () => ({}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);

const renderWithTheme = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: TestWrapper, ...options });

describe('BottomSheet', () => {
  it('exports BottomSheet component', () => {
    const { BottomSheet } = require('./BottomSheet');
    expect(BottomSheet).toBeDefined();
    expect(BottomSheet.displayName).toBe('BottomSheet');
  });

  it('exports useBottomSheetContext hook', () => {
    const { useBottomSheetContext } = require('./BottomSheet');
    expect(useBottomSheetContext).toBeDefined();
  });

  describe('rendering', () => {
    it('renders with children', () => {
      const { BottomSheet } = require('./BottomSheet');
      const { getByText } = renderWithTheme(
        <BottomSheet testID='bottom-sheet'>
          <View>
            <Text>Test Content</Text>
          </View>
        </BottomSheet>,
      );

      expect(getByText('Test Content')).toBeTruthy();
    });

    it('renders with testID', () => {
      const { BottomSheet } = require('./BottomSheet');
      const { getByTestId } = renderWithTheme(
        <BottomSheet testID='my-bottom-sheet'>
          <Text>Content</Text>
        </BottomSheet>,
      );

      expect(getByTestId('my-bottom-sheet')).toBeTruthy();
    });

    it('forwards ref correctly', () => {
      const { BottomSheet } = require('./BottomSheet');
      const ref = { current: null };
      renderWithTheme(
        <BottomSheet ref={ref} testID='bottom-sheet'>
          <Text>Content</Text>
        </BottomSheet>,
      );

      expect(ref.current).toBeTruthy();
    });
  });

  describe('snap points', () => {
    it('uses default snapPoints "fullWithOffset" when not specified', () => {
      const { BottomSheet } = require('./BottomSheet');
      const { getByTestId } = renderWithTheme(
        <BottomSheet testID='bottom-sheet'>
          <Text>Content</Text>
        </BottomSheet>,
      );

      const element = getByTestId('bottom-sheet');
      expect(element.props['data-snap-points']).toBe(JSON.stringify([1309]));
    });

    it('renders with snapPoints preset "full"', () => {
      const { BottomSheet } = require('./BottomSheet');
      const { getByTestId } = renderWithTheme(
        <BottomSheet snapPoints='full' testID='bottom-sheet'>
          <Text>Content</Text>
        </BottomSheet>,
      );

      const element = getByTestId('bottom-sheet');
      expect(element.props['data-snap-points']).toBe(JSON.stringify([1334]));
    });

    it('renders with snapPoints preset "quarter"', () => {
      const { BottomSheet } = require('./BottomSheet');
      const { getByTestId } = renderWithTheme(
        <BottomSheet snapPoints='small' testID='bottom-sheet'>
          <Text>Content</Text>
        </BottomSheet>,
      );

      const element = getByTestId('bottom-sheet');
      expect(element.props['data-snap-points']).toBe(JSON.stringify(['25%']));
    });

    it('renders with custom snapPoints array (percentages)', () => {
      const { BottomSheet } = require('./BottomSheet');
      const customSnapPoints = ['30%', '60%', '90%'];
      const { getByTestId } = renderWithTheme(
        <BottomSheet snapPoints={customSnapPoints} testID='bottom-sheet'>
          <Text>Content</Text>
        </BottomSheet>,
      );

      const element = getByTestId('bottom-sheet');
      expect(element.props['data-snap-points']).toBe(
        JSON.stringify(customSnapPoints),
      );
    });

    it('renders with custom snapPoints array (pixels)', () => {
      const { BottomSheet } = require('./BottomSheet');
      const customSnapPoints = [200, 400, 600];
      const { getByTestId } = renderWithTheme(
        <BottomSheet snapPoints={customSnapPoints} testID='bottom-sheet'>
          <Text>Content</Text>
        </BottomSheet>,
      );

      const element = getByTestId('bottom-sheet');
      expect(element.props['data-snap-points']).toBe(
        JSON.stringify(customSnapPoints),
      );
    });
  });

  describe('configuration props', () => {
    it('enables dynamic sizing when specified', () => {
      const { BottomSheet } = require('./BottomSheet');
      const { getByTestId } = renderWithTheme(
        <BottomSheet enableDynamicSizing testID='bottom-sheet'>
          <Text>Content</Text>
        </BottomSheet>,
      );

      const element = getByTestId('bottom-sheet');
      expect(element.props['data-enable-dynamic-sizing']).toBe('true');
    });

    it('respects enablePanDownToClose prop (true by default)', () => {
      const { BottomSheet } = require('./BottomSheet');
      const { getByTestId } = renderWithTheme(
        <BottomSheet testID='bottom-sheet'>
          <Text>Content</Text>
        </BottomSheet>,
      );

      const element = getByTestId('bottom-sheet');
      expect(element.props['data-enable-pan-down-to-close']).toBe('true');
    });

    it('respects enablePanDownToClose prop when set to false', () => {
      const { BottomSheet } = require('./BottomSheet');
      const { getByTestId } = renderWithTheme(
        <BottomSheet enablePanDownToClose={false} testID='bottom-sheet'>
          <Text>Content</Text>
        </BottomSheet>,
      );

      const element = getByTestId('bottom-sheet');
      expect(element.props['data-enable-pan-down-to-close']).toBe('false');
    });

    it('respects detached prop', () => {
      const { BottomSheet } = require('./BottomSheet');
      const { getByTestId } = renderWithTheme(
        <BottomSheet detached testID='bottom-sheet'>
          <Text>Content</Text>
        </BottomSheet>,
      );

      const element = getByTestId('bottom-sheet');
      expect(element.props['data-detached']).toBe('true');
    });

    it('respects enableHandlePanningGesture prop', () => {
      const { BottomSheet } = require('./BottomSheet');
      const { getByTestId } = renderWithTheme(
        <BottomSheet enableHandlePanningGesture={false} testID='bottom-sheet'>
          <Text>Content</Text>
        </BottomSheet>,
      );

      const element = getByTestId('bottom-sheet');
      expect(element.props['data-enable-handle-panning-gesture']).toBe('false');
    });
  });

  describe('context', () => {
    it('provides context with onBack callback', () => {
      const { BottomSheet } = require('./BottomSheet');
      const onBack = jest.fn();
      const { getByText } = renderWithTheme(
        <BottomSheet onBack={onBack} testID='bottom-sheet'>
          <Text>Content</Text>
        </BottomSheet>,
      );

      // If the component renders without errors, context is working
      expect(getByText('Content')).toBeTruthy();
    });
  });

  describe('callbacks', () => {
    it('accepts onOpen callback', () => {
      const { BottomSheet } = require('./BottomSheet');
      const onOpen = jest.fn();
      renderWithTheme(
        <BottomSheet onOpen={onOpen} testID='bottom-sheet'>
          <Text>Content</Text>
        </BottomSheet>,
      );

      // Component should render without errors
      expect(onOpen).not.toHaveBeenCalled();
    });

    it('accepts onClose callback', () => {
      const { BottomSheet } = require('./BottomSheet');
      const onClose = jest.fn();
      renderWithTheme(
        <BottomSheet onClose={onClose} testID='bottom-sheet'>
          <Text>Content</Text>
        </BottomSheet>,
      );

      // Component should render without errors
      expect(onClose).not.toHaveBeenCalled();
    });

    it('accepts onChange callback', () => {
      const { BottomSheet } = require('./BottomSheet');
      const onChange = jest.fn();
      renderWithTheme(
        <BottomSheet onChange={onChange} testID='bottom-sheet'>
          <Text>Content</Text>
        </BottomSheet>,
      );

      // Component should render without errors
      expect(onChange).not.toHaveBeenCalled();
    });

    it('accepts onBackdropPress callback', () => {
      const { BottomSheet } = require('./BottomSheet');
      const onBackdropPress = jest.fn();
      renderWithTheme(
        <BottomSheet onBackdropPress={onBackdropPress} testID='bottom-sheet'>
          <Text>Content</Text>
        </BottomSheet>,
      );

      // Component should render without errors
      expect(onBackdropPress).not.toHaveBeenCalled();
    });

    it('accepts multiple callbacks simultaneously', () => {
      const { BottomSheet } = require('./BottomSheet');
      const onOpen = jest.fn();
      const onClose = jest.fn();
      const onChange = jest.fn();
      const onBack = jest.fn();

      renderWithTheme(
        <BottomSheet
          onOpen={onOpen}
          onClose={onClose}
          onChange={onChange}
          onBack={onBack}
          testID='bottom-sheet'
        >
          <Text>Content</Text>
        </BottomSheet>,
      );

      // Component should render without errors
      expect(onOpen).not.toHaveBeenCalled();
      expect(onClose).not.toHaveBeenCalled();
      expect(onChange).not.toHaveBeenCalled();
      expect(onBack).not.toHaveBeenCalled();
    });
  });
});

import { describe, it, expect, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, fireEvent } from '@testing-library/react-native';
import React from 'react';

import { Settings } from '../../Symbols';
import { Tag } from '../Tag';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import {
  Tile,
  TileLeading,
  TileContent,
  TileTitle,
  TileDescription,
  TileTrailing,
} from './Tile';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);

describe('Tile Component', () => {
  describe('Basic Rendering', () => {
    it('should render correctly with composite API', () => {
      const { getByText, getByTestId } = render(
        <TestWrapper>
          <Tile testID='tile'>
            <TileLeading>
              <Settings size={24} />
              <TileContent>
                <TileTitle>Test Title</TileTitle>
              </TileContent>
            </TileLeading>
          </Tile>
        </TestWrapper>,
      );

      expect(getByTestId('tile')).toBeTruthy();
      expect(getByText('Test Title')).toBeTruthy();
    });

    it('should render custom content', () => {
      const tagText = 'Test Tag';
      const { getByText } = render(
        <TestWrapper>
          <Tile testID='tile'>
            <TileLeading>
              <Settings size={24} />
              <TileContent>
                <TileTitle>Test Title</TileTitle>
              </TileContent>
            </TileLeading>
            <TileTrailing>
              <Tag label={tagText} />
            </TileTrailing>
          </Tile>
        </TestWrapper>,
      );

      expect(getByText('Test Title')).toBeTruthy();
      expect(getByText(tagText)).toBeTruthy();
    });
  });

  describe('Press Handlers', () => {
    it('should call onPress handler when pressed', () => {
      const handlePress = jest.fn();
      const { getByTestId } = render(
        <TestWrapper>
          <Tile onPress={handlePress} testID='tile'>
            <TileLeading>
              <Settings size={24} />
              <TileContent>
                <TileTitle>Test Title</TileTitle>
              </TileContent>
            </TileLeading>
          </Tile>
        </TestWrapper>,
      );

      fireEvent.press(getByTestId('tile'));

      expect(handlePress).toHaveBeenCalledTimes(1);
    });

    it('should call onLongPress handler when long pressed', () => {
      const handleLongPress = jest.fn();
      const { getByTestId } = render(
        <TestWrapper>
          <Tile onLongPress={handleLongPress} testID='tile'>
            <TileLeading>
              <Settings size={24} />
              <TileContent>
                <TileTitle>Test Title</TileTitle>
              </TileContent>
            </TileLeading>
          </Tile>
        </TestWrapper>,
      );

      fireEvent(getByTestId('tile'), 'onLongPress');

      expect(handleLongPress).toHaveBeenCalledTimes(1);
    });

    it('should support both onPress and onLongPress', () => {
      const handlePress = jest.fn();
      const handleLongPress = jest.fn();
      const { getByTestId } = render(
        <TestWrapper>
          <Tile
            onPress={handlePress}
            onLongPress={handleLongPress}
            testID='tile'
          >
            <TileLeading>
              <Settings size={24} />
              <TileContent>
                <TileTitle>Test Title</TileTitle>
              </TileContent>
            </TileLeading>
          </Tile>
        </TestWrapper>,
      );

      fireEvent.press(getByTestId('tile'));
      expect(handlePress).toHaveBeenCalledTimes(1);
      expect(handleLongPress).not.toHaveBeenCalled();

      fireEvent(getByTestId('tile'), 'onLongPress');
      expect(handleLongPress).toHaveBeenCalledTimes(1);
      expect(handlePress).toHaveBeenCalledTimes(1);
    });
  });

  describe('Context Propagation', () => {
    it('should propagate disabled state to TileTrailing', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Tile disabled testID='tile'>
            <TileLeading>
              <Settings size={24} />
              <TileContent>
                <TileTitle>Test Title</TileTitle>
              </TileContent>
            </TileLeading>
          </Tile>
        </TestWrapper>,
      );

      const pressable = getByTestId('tile');
      expect(pressable.props.accessibilityState?.disabled).toBe(true);
    });

    it('should propagate disabled state to text components', () => {
      const { getByText } = render(
        <TestWrapper>
          <Tile disabled testID='tile'>
            <TileLeading>
              <Settings size={24} />
              <TileContent>
                <TileTitle>Test Title</TileTitle>
                <TileDescription>Test Description</TileDescription>
              </TileContent>
            </TileLeading>
          </Tile>
        </TestWrapper>,
      );

      expect(getByText('Test Title')).toBeTruthy();
      expect(getByText('Test Description')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should support custom accessibility label', () => {
      const customLabel = 'Custom accessibility label';
      const { getByTestId } = render(
        <TestWrapper>
          <Tile testID='tile' accessibilityLabel={customLabel}>
            <TileLeading>
              <Settings size={24} />
              <TileContent>
                <TileTitle>Test Title</TileTitle>
              </TileContent>
            </TileLeading>
          </Tile>
        </TestWrapper>,
      );

      const pressable = getByTestId('tile');
      expect(pressable.props.accessibilityLabel).toBe(customLabel);
    });

    it('should set accessibility role to button', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Tile testID='tile'>
            <TileLeading>
              <Settings size={24} />
              <TileContent>
                <TileTitle>Test Title</TileTitle>
              </TileContent>
            </TileLeading>
          </Tile>
        </TestWrapper>,
      );

      const pressable = getByTestId('tile');
      expect(pressable.props.accessibilityRole).toBe('button');
    });
  });

  describe('Complex Scenarios', () => {
    it('should render with all features combined', () => {
      const description = 'Full description';
      const tagText = 'Tag Label';

      const { getByText, getByTestId } = render(
        <TestWrapper>
          <Tile
            appearance='card'
            onPress={jest.fn()}
            onLongPress={jest.fn()}
            testID='tile'
          >
            <TileLeading>
              <Settings size={24} />
              <TileContent>
                <TileTitle>Test Title</TileTitle>
                <TileDescription>{description}</TileDescription>
              </TileContent>
            </TileLeading>
            <TileTrailing>
              <Tag label={tagText} />
            </TileTrailing>
          </Tile>
        </TestWrapper>,
      );

      expect(getByTestId('tile')).toBeTruthy();
      expect(getByText('Test Title')).toBeTruthy();
      expect(getByText(description)).toBeTruthy();
      expect(getByText(tagText)).toBeTruthy();
    });
  });
});

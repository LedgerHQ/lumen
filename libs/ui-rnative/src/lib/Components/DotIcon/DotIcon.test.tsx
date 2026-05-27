import { describe, it, expect } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render } from '@testing-library/react-native';
import { createRef } from 'react';
import type { View } from 'react-native';
import { Text } from 'react-native';
import { ArrowDown } from '../../Symbols';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { DotIcon } from './DotIcon';

const { colors, sizes, borderRadius } = ledgerLiveThemes.dark;

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);

describe('DotIcon Component', () => {
  describe('Rendering', () => {
    it('should render children', () => {
      const { getByText } = render(
        <TestWrapper>
          <DotIcon testID='dot-icon' appearance='success' icon={ArrowDown}>
            <Text>Child</Text>
          </DotIcon>
        </TestWrapper>,
      );

      expect(getByText('Child')).toBeTruthy();
    });

    it('should render without children', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <DotIcon testID='dot-icon' appearance='success' icon={ArrowDown} />
        </TestWrapper>,
      );

      expect(getByTestId('dot-icon')).toBeTruthy();
    });

    it('should have correct displayName', () => {
      expect(DotIcon.displayName).toBe('DotIcon');
    });
  });

  describe('Appearances', () => {
    it.each([
      {
        appearance: 'success' as const,
        expectedColor: colors.bg.successStrong,
      },
      { appearance: 'muted' as const, expectedColor: colors.bg.mutedStrong },
      { appearance: 'error' as const, expectedColor: colors.bg.errorStrong },
    ])(
      'should apply $appearance background color to the dot',
      ({ appearance, expectedColor }) => {
        const { getByTestId } = render(
          <TestWrapper>
            <DotIcon
              testID='dot-icon'
              appearance={appearance}
              icon={ArrowDown}
            />
          </TestWrapper>,
        );

        const dotView = getByTestId('dot-icon-dot');
        expect(dotView.props.style.backgroundColor).toBe(expectedColor);
      },
    );
  });

  describe('Sizes', () => {
    it.each([
      { size: 16 as const, expectedSize: sizes.s16 },
      { size: 20 as const, expectedSize: sizes.s20 },
      { size: 24 as const, expectedSize: sizes.s24 },
    ])(
      'should apply correct width and height for size $size',
      ({ size, expectedSize }) => {
        const { getByTestId } = render(
          <TestWrapper>
            <DotIcon
              testID='dot-icon'
              appearance='success'
              icon={ArrowDown}
              size={size}
            />
          </TestWrapper>,
        );

        const dotView = getByTestId('dot-icon-dot');
        expect(dotView.props.style.width).toBe(expectedSize);
        expect(dotView.props.style.height).toBe(expectedSize);
      },
    );
  });

  describe('Pins', () => {
    it.each([
      {
        pin: 'bottom-end' as const,
        verticalKey: 'bottom',
        horizontalKey: 'right',
      },
      {
        pin: 'bottom-start' as const,
        verticalKey: 'bottom',
        horizontalKey: 'left',
      },
      {
        pin: 'top-end' as const,
        verticalKey: 'top',
        horizontalKey: 'right',
      },
      {
        pin: 'top-start' as const,
        verticalKey: 'top',
        horizontalKey: 'left',
      },
    ])('should position dot at $pin', ({ pin, verticalKey, horizontalKey }) => {
      const { getByTestId } = render(
        <TestWrapper>
          <DotIcon
            testID='dot-icon'
            appearance='success'
            icon={ArrowDown}
            pin={pin}
          />
        </TestWrapper>,
      );

      const dotView = getByTestId('dot-icon-dot');
      expect(dotView.props.style[verticalKey]).toBe(-3);
      expect(dotView.props.style[horizontalKey]).toBe(-3);
    });
  });

  describe('Shapes', () => {
    it('should apply full border radius for circle shape', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <DotIcon
            testID='dot-icon'
            appearance='success'
            icon={ArrowDown}
            shape='circle'
          />
        </TestWrapper>,
      );

      const dotView = getByTestId('dot-icon-dot');
      expect(dotView.props.style.borderRadius).toBe(borderRadius.full);
    });

    it.each([
      { size: 16 as const, expectedRadius: 5 },
      { size: 20 as const, expectedRadius: 6 },
      { size: 24 as const, expectedRadius: 8 },
    ])(
      'should apply correct border radius for square shape at size $size',
      ({ size, expectedRadius }) => {
        const { getByTestId } = render(
          <TestWrapper>
            <DotIcon
              testID='dot-icon'
              appearance='success'
              icon={ArrowDown}
              shape='square'
              size={size}
            />
          </TestWrapper>,
        );

        const dotView = getByTestId('dot-icon-dot');
        expect(dotView.props.style.borderRadius).toBe(expectedRadius);
      },
    );
  });

  describe('Ref forwarding', () => {
    it('should forward ref to the root element', () => {
      const ref = createRef<View>();

      render(
        <TestWrapper>
          <DotIcon ref={ref} appearance='success' icon={ArrowDown} />
        </TestWrapper>,
      );

      expect(ref.current).not.toBeNull();
    });
  });

  describe('Styling', () => {
    it('should apply custom styles', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <DotIcon
            testID='dot-icon'
            appearance='success'
            icon={ArrowDown}
            style={{ marginTop: 10 }}
          />
        </TestWrapper>,
      );

      const root = getByTestId('dot-icon');
      expect(root.props.style.marginTop).toBe(10);
    });

    it('should pass additional props', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <DotIcon testID='custom-dot' appearance='success' icon={ArrowDown} />
        </TestWrapper>,
      );

      expect(getByTestId('custom-dot')).toBeTruthy();
    });
  });
});

import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import React, { createRef } from 'react';
import { Text, TextProps } from 'react-native';
import { LumenStyleSheetProvider } from '../provider/LumenStyleSheetProvider';
import { createStyledText } from './createStyledText';

const testThemes: any = {
  light: {
    spacings: { s8: 8 },
    sizes: {},
    colors: {
      bg: {},
      text: { base: '#000000', muted: '#666666' },
      border: {},
    },
    borderRadius: {},
    shadows: {},
    typographies: {
      xs: {
        heading: {},
        body: {
          body1: {
            fontSize: 16,
            fontWeight: '500',
            lineHeight: 24,
            letterSpacing: 0,
          },
        },
      },
    },
  },
  dark: {
    spacings: { s8: 8 },
    sizes: {},
    colors: {
      bg: {},
      text: { base: '#FFFFFF', muted: '#8E8E93' },
      border: {},
    },
    borderRadius: {},
    shadows: {},
    typographies: {
      xs: {
        heading: {},
        body: {
          body1: {
            fontSize: 16,
            fontWeight: '500',
            lineHeight: 24,
            letterSpacing: 0,
          },
        },
      },
    },
  },
};

const renderWithProvider = (children: React.ReactElement) =>
  render(
    <LumenStyleSheetProvider themes={testThemes}>
      {children}
    </LumenStyleSheetProvider>,
  );

describe('createStyledText', () => {
  const StyledText = createStyledText(Text);

  it('should have correct display name', () => {
    expect(StyledText.displayName).toBe('StyledText(Text)');
  });

  it('should apply typography typography', () => {
    renderWithProvider(
      <StyledText testID='text' typography='body1'>
        Hello
      </StyledText>,
    );

    const style = screen.getByTestId('text').props.style;
    expect(style).toMatchObject({
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 24,
    });
  });

  it('should apply color token', () => {
    renderWithProvider(
      <StyledText testID='text' lx={{ color: 'muted' }}>
        Muted
      </StyledText>,
    );

    expect(screen.getByTestId('text').props.style.color).toBe('#666666');
  });

  it('should combine typography, color and spacing', () => {
    renderWithProvider(
      <StyledText
        testID='text'
        typography='body1'
        lx={{ color: 'base', marginTop: 's8' }}
      >
        Styled
      </StyledText>,
    );

    const style = screen.getByTestId('text').props.style;

    expect(style).toMatchObject({
      color: '#000000',
      marginTop: 8,
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 24,
      letterSpacing: 0,
    });
  });

  it('should merge style prop with resolved tokens', () => {
    renderWithProvider(
      <StyledText
        testID='text'
        typography='body1'
        style={{ textDecorationLine: 'underline' }}
      >
        Underlined
      </StyledText>,
    );

    const style = screen.getByTestId('text').props.style;

    expect(style.fontSize).toBe(16);
    expect(style.textDecorationLine).toBe('underline');
  });

  it('should forward ref', () => {
    const ref = createRef<Text>();
    renderWithProvider(
      <StyledText ref={ref} testID='text'>
        Ref
      </StyledText>,
    );
    expect(ref.current).toBeTruthy();
  });

  describe('performance (memo)', () => {
    it('should not re-render when props are unchanged', () => {
      const renderCount = jest.fn();
      const TrackedText = (props: TextProps) => {
        renderCount();
        return <Text {...props} />;
      };
      const StyledTracked = createStyledText(TrackedText as any);

      const { rerender } = renderWithProvider(
        <StyledTracked testID='text' typography='body1'>
          Hello
        </StyledTracked>,
      );

      expect(renderCount).toHaveBeenCalledTimes(1);

      // Re-render with same props
      rerender(
        <LumenStyleSheetProvider themes={testThemes}>
          <StyledTracked testID='text' typography='body1'>
            Hello
          </StyledTracked>
        </LumenStyleSheetProvider>,
      );

      // memo should prevent re-render
      expect(renderCount).toHaveBeenCalledTimes(1);
    });

    it('should re-render when token props change', () => {
      const renderCount = jest.fn();
      const TrackedText = (props: TextProps) => {
        renderCount();
        return <Text {...props} />;
      };
      const StyledTracked = createStyledText(TrackedText as any);

      const { rerender } = renderWithProvider(
        <StyledTracked testID='text' typography='body1'>
          Hello
        </StyledTracked>,
      );

      expect(renderCount).toHaveBeenCalledTimes(1);

      // Re-render with different props
      rerender(
        <LumenStyleSheetProvider themes={testThemes}>
          <StyledTracked testID='text' lx={{ color: 'muted' }}>
            Hello
          </StyledTracked>
        </LumenStyleSheetProvider>,
      );

      // Should re-render due to prop change
      expect(renderCount).toHaveBeenCalledTimes(2);
    });

    it('should re-render when children change', () => {
      const renderCount = jest.fn();
      const TrackedText = (props: TextProps) => {
        renderCount();
        return <Text {...props} />;
      };
      const StyledTracked = createStyledText(TrackedText as any);

      const { rerender } = renderWithProvider(
        <StyledTracked testID='text' typography='body1'>
          Hello
        </StyledTracked>,
      );

      expect(renderCount).toHaveBeenCalledTimes(1);

      // Re-render with different children
      rerender(
        <LumenStyleSheetProvider themes={testThemes}>
          <StyledTracked testID='text' typography='body1'>
            World
          </StyledTracked>
        </LumenStyleSheetProvider>,
      );

      // Should re-render due to children change
      expect(renderCount).toHaveBeenCalledTimes(2);
    });
  });
});

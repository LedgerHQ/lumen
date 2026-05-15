import { describe, it, expect, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, screen } from '@testing-library/react-native';
import type { ViewStyle } from 'react-native';
import { Text } from 'react-native';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { BaseTag } from './BaseTag';
import type { BaseTagProps } from './types';

const { colors } = ledgerLiveThemes.dark;

const renderWithProvider = (component: React.ReactElement) =>
  render(
    <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
      {component}
    </ThemeProvider>,
  );

const baseProps = {
  consumerName: 'BaseTagTest',
  variant: 'tag',
  label: 'Label',
  testID: 'base-tag',
} satisfies BaseTagProps;

describe('BaseTag Component', () => {
  describe('Rendering', () => {
    it('should render label text', () => {
      renderWithProvider(<BaseTag {...baseProps} label='Bitcoin' />);
      expect(screen.getByText('Bitcoin')).toBeTruthy();
    });

    it('should render testID on root element', () => {
      renderWithProvider(<BaseTag {...baseProps} />);
      expect(screen.getByTestId('base-tag')).toBeTruthy();
    });

    it('should not render any icon when renderIcon is not provided', () => {
      renderWithProvider(<BaseTag {...baseProps} />);
      expect(screen.queryByTestId('test-icon')).toBeNull();
    });

    it('should call renderIcon with the computed icon style', () => {
      const renderIcon = jest.fn(() => (
        <Text testID='test-icon'>icon</Text>
      )) as BaseTagProps['renderIcon'];
      renderWithProvider(<BaseTag {...baseProps} renderIcon={renderIcon} />);
      expect(screen.getByTestId('test-icon')).toBeTruthy();
      expect(renderIcon).toHaveBeenCalledWith(
        expect.objectContaining({ color: expect.any(String) }),
      );
    });
  });

  describe('Appearances', () => {
    const cases: [NonNullable<BaseTagProps['appearance']>, string][] = [
      ['base', colors.bg.mutedTransparent],
      ['gray', colors.bg.mutedTransparent],
      ['accent', colors.bg.accent],
      ['accent-subtle', colors.bg.activeSubtle],
      ['success', colors.bg.success],
      ['error', colors.bg.error],
      ['warning', colors.bg.warning],
    ];

    it.each(cases)(
      'should render with %s background color',
      (appearance, expected) => {
        renderWithProvider(<BaseTag {...baseProps} appearance={appearance} />);
        expect(screen.getByTestId('base-tag').props.style.backgroundColor).toBe(
          expected,
        );
      },
    );
  });

  describe('Sizes', () => {
    it.each(['sm', 'md'] as const)('should render with %s size', (size) => {
      renderWithProvider(<BaseTag {...baseProps} size={size} />);
      expect(screen.getByTestId('base-tag')).toBeTruthy();
    });

    it('should use smaller padding for sm than md (tag variant)', () => {
      const { rerender } = renderWithProvider(
        <BaseTag {...baseProps} size='md' />,
      );
      const mdPadding =
        screen.getByTestId('base-tag').props.style.paddingHorizontal;

      rerender(
        <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
          <BaseTag {...baseProps} size='sm' />
        </ThemeProvider>,
      );
      const smPadding =
        screen.getByTestId('base-tag').props.style.paddingHorizontal;

      expect(smPadding).toBeLessThan(mdPadding);
    });
  });

  describe('Variants', () => {
    it('should use paddingHorizontal for tag variant', () => {
      renderWithProvider(<BaseTag {...baseProps} variant='tag' />);
      const style = screen.getByTestId('base-tag').props.style;
      expect(style.paddingHorizontal).toBeDefined();
      expect(style.paddingLeft).toBeUndefined();
      expect(style.paddingRight).toBeUndefined();
    });

    it('should use asymmetric paddingLeft / paddingRight for media variant', () => {
      renderWithProvider(<BaseTag {...baseProps} variant='media' />);
      const style = screen.getByTestId('base-tag').props.style;
      expect(style.paddingLeft).toBeDefined();
      expect(style.paddingRight).toBeDefined();
      expect(style.paddingHorizontal).toBeUndefined();
    });
  });

  describe('Disabled', () => {
    it('should apply disabled background when disabled', () => {
      renderWithProvider(<BaseTag {...baseProps} disabled />);
      expect(screen.getByTestId('base-tag').props.style.backgroundColor).toBe(
        colors.bg.disabled,
      );
    });
  });

  describe('Styling', () => {
    it('should merge custom style with computed root style', () => {
      const custom: ViewStyle = { marginTop: 16 };
      renderWithProvider(<BaseTag {...baseProps} style={custom} />);
      expect(screen.getByTestId('base-tag').props.style.marginTop).toBe(16);
    });
  });
});

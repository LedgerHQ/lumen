import { describe, it, expect } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, screen } from '@testing-library/react-native';
import React from 'react';
import { Path } from 'react-native-svg';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { Icon } from './Icon';
import type { IconSize } from './types';

const { icon: iconTokens } = ledgerLiveThemes.dark;

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
      {component}
    </ThemeProvider>,
  );
};

describe('Icon', () => {
  it('should render children with default props', () => {
    renderWithProvider(
      <Icon viewBox='0 0 24 24' testID='icon'>
        <Path d='M12 2L2 7l10 5 10-5-10-5z' testID='path' />
      </Icon>,
    );

    const svg = screen.getByTestId('icon');
    expect(screen.getByTestId('path')).toBeTruthy();
    expect(svg.props.fill).toBe('none');
    expect(svg.props.width).toBe(iconTokens.width.s24);
    expect(svg.props.height).toBe(iconTokens.height.s24);
    expect(svg.props.strokeWidth).toBe(iconTokens.borderWidth.s24);
  });

  it.each([12, 16, 20, 24, 40, 48, 56] as IconSize[])(
    'should apply correct dimensions for size %i',
    (size) => {
      renderWithProvider(
        <Icon viewBox='0 0 24 24' size={size} testID='icon'>
          <Path d='M12 2L2 7l10 5 10-5-10-5z' />
        </Icon>,
      );

      const sizeKey = `s${size}` as `s${typeof size}`;
      const svg = screen.getByTestId('icon');

      expect(svg.props.width).toBe(iconTokens.width[sizeKey]);
      expect(svg.props.height).toBe(iconTokens.height[sizeKey]);
      expect(svg.props.strokeWidth).toBe(iconTokens.borderWidth[sizeKey]);
    },
  );

  it('should apply color from style prop', () => {
    renderWithProvider(
      <Icon viewBox='0 0 24 24' testID='icon' color='error'>
        <Path d='M12 2L2 7l10 5 10-5-10-5z' />
      </Icon>,
    );

    expect(screen.getByTestId('icon').props.color).toBe('#fca6a7');
  });

  it('should forward ref and spread additional props', () => {
    const ref = { current: null };
    renderWithProvider(
      <Icon
        viewBox='0 0 24 24'
        ref={ref}
        testID='icon'
        accessibilityLabel='Test icon'
        fill='currentColor'
      >
        <Path d='M12 2L2 7l10 5 10-5-10-5z' />
      </Icon>,
    );

    const svg = screen.getByTestId('icon');
    expect(ref.current).not.toBeNull();
    expect(svg.props.accessibilityLabel).toBe('Test icon');
    expect(svg.props.fill).toBe('currentColor');
  });
});

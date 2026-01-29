import { describe, it, expect } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render } from '@testing-library/react-native';
import React from 'react';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { Divider } from './Divider';

const { colors } = ledgerLiveThemes.dark;

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);

describe('Divider Component', () => {
  it('should render with horizontal orientation by default', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <Divider testID='divider' />
      </TestWrapper>,
    );
    const divider = getByTestId('divider');
    expect(divider).toBeTruthy();
    const style = divider.props.style;
    // Style might be an array or object after flattening
    const flatStyle = Array.isArray(style)
      ? Object.assign({}, ...style)
      : style;
    expect(flatStyle.borderTopWidth).toBe(1);
    expect(flatStyle.borderTopColor).toBe(colors.border.mutedSubtle);
  });

  it('should render with vertical orientation', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <Divider testID='divider' orientation='vertical' />
      </TestWrapper>,
    );
    const divider = getByTestId('divider');
    const style = divider.props.style;
    // Style might be an array or object after flattening
    const flatStyle = Array.isArray(style)
      ? Object.assign({}, ...style)
      : style;
    expect(flatStyle.borderLeftWidth).toBe(1);
    expect(flatStyle.borderLeftColor).toBe(colors.border.mutedSubtle);
  });

  it('should apply custom lx props', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <Divider testID='divider' lx={{ marginVertical: 's16' }} />
      </TestWrapper>,
    );
    const divider = getByTestId('divider');
    const style = divider.props.style;
    const flatStyle = Array.isArray(style)
      ? Object.assign({}, ...style)
      : style;
    expect(flatStyle.marginVertical).toBe(16);
  });

  it('should pass through additional props', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <Divider testID='custom-divider' />
      </TestWrapper>,
    );
    const divider = getByTestId('custom-divider');
    expect(divider).toBeTruthy();
  });

  it('should handle style merging with lx props', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <Divider
          testID='divider'
          lx={{ marginTop: 's8' }}
          style={{ opacity: 0.5 }}
        />
      </TestWrapper>,
    );
    const divider = getByTestId('divider');
    const style = divider.props.style;
    const flatStyle = Array.isArray(style)
      ? Object.assign({}, ...style)
      : style;
    expect(flatStyle.marginTop).toBe(8);
    expect(flatStyle.opacity).toBe(0.5);
  });
});

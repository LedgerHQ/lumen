import { describe, it, expect } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render } from '@testing-library/react-native';
import React from 'react';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { SegmentedControl } from './SegmentedControl';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);

describe('SegmentedControl', () => {
  it('renders with value and onValueChange', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <SegmentedControl
          value='one'
          onValueChange={() => {}}
          testID='segmented-control'
        >
          <React.Fragment />
        </SegmentedControl>
      </TestWrapper>,
    );
    expect(getByTestId('segmented-control')).toBeTruthy();
  });
});

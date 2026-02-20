import { describe, it, expect } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render } from '@testing-library/react-native';
import React from 'react';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { SegmentedControl, SegmentedControlButton } from './SegmentedControl';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);

describe('SegmentedControl', () => {
  it('renders with onChange and buttons', () => {
    const { getByTestId, getByText } = render(
      <TestWrapper>
        <SegmentedControl
          onChange={() => {}}
          accessibilityLabel='File view'
          testID='segmented-control'
        >
          <SegmentedControlButton selected>Preview</SegmentedControlButton>
          <SegmentedControlButton selected={false}>Raw</SegmentedControlButton>
        </SegmentedControl>
      </TestWrapper>,
    );
    expect(getByTestId('segmented-control')).toBeTruthy();
    expect(getByText('Preview')).toBeTruthy();
    expect(getByText('Raw')).toBeTruthy();
  });
});

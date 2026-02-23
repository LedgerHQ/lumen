import { describe, it, expect, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, fireEvent } from '@testing-library/react-native';
import React from 'react';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { SegmentedControl, SegmentedControlButton } from './SegmentedControl';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);

describe('SegmentedControl', () => {
  it('renders segments with labels', () => {
    const { getByText } = render(
      <TestWrapper>
        <SegmentedControl
          selectedIndex={0}
          onChange={() => {}}
          accessibilityLabel='Transaction type'
        >
          <SegmentedControlButton selected>Send</SegmentedControlButton>
          <SegmentedControlButton selected={false}>Receive</SegmentedControlButton>
        </SegmentedControl>
      </TestWrapper>,
    );
    expect(getByText('Send')).toBeTruthy();
    expect(getByText('Receive')).toBeTruthy();
  });

  it('calls onChange with segment index when a segment is pressed', () => {
    const onChange = jest.fn();
    const { getByText } = render(
      <TestWrapper>
        <SegmentedControl
          selectedIndex={0}
          onChange={onChange}
          accessibilityLabel='Transaction type'
        >
          <SegmentedControlButton selected>Send</SegmentedControlButton>
          <SegmentedControlButton selected={false}>Receive</SegmentedControlButton>
        </SegmentedControl>
      </TestWrapper>,
    );

    fireEvent.press(getByText('Receive'));

    expect(onChange).toHaveBeenCalledWith(1);
  });
});

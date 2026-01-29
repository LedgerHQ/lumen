import { describe, it, expect, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, fireEvent } from '@testing-library/react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { GlobalTooltipBottomSheet } from './GlobalTooltipBottomSheet';
import { GlobalTooltipProvider } from './GlobalTooltipContext';
import { Tooltip, TooltipTrigger, TooltipContent } from './Tooltip';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    <GlobalTooltipProvider>
      {children}
      <GlobalTooltipBottomSheet />
    </GlobalTooltipProvider>
  </ThemeProvider>
);

describe('Tooltip', () => {
  it('renders and triggers tooltip', () => {
    const { getByText } = render(
      <TestWrapper>
        <Tooltip>
          <TooltipTrigger>
            <View>
              <Text>Press me</Text>
            </View>
          </TooltipTrigger>
          <TooltipContent
            title='Help'
            content={<Text>Helpful information</Text>}
          />
        </Tooltip>
      </TestWrapper>,
    );

    expect(getByText('Press me')).toBeTruthy();

    fireEvent.press(getByText('Press me'));

    expect(getByText('Help')).toBeTruthy();
    expect(getByText('Helpful information')).toBeTruthy();
  });

  it('works in controlled mode', () => {
    const onOpenChange = jest.fn();
    const { getByText } = render(
      <TestWrapper>
        <Tooltip onOpenChange={onOpenChange}>
          <TooltipTrigger>
            <View>
              <Text>Press me</Text>
            </View>
          </TooltipTrigger>
          <TooltipContent title='Help' content={<Text>Info</Text>} />
        </Tooltip>
      </TestWrapper>,
    );

    fireEvent.press(getByText('Press me'));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('requires GlobalTooltipProvider', () => {
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(
        <Tooltip>
          <TooltipTrigger>
            <Text>Trigger</Text>
          </TooltipTrigger>
          <TooltipContent title='Title' content={<Text>Content</Text>} />
        </Tooltip>,
      );
    }).toThrow();

    console.error = originalError;
  });
});

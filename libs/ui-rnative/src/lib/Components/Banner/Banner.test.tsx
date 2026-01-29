import { describe, it, expect, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Button } from '../Button';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { Banner } from './Banner';

const { colors } = ledgerLiveThemes.dark;

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);

describe('Banner Component', () => {
  it('should render correctly with minimal props', () => {
    const { getByText } = render(
      <TestWrapper>
        <Banner title='banner-title' description='banner-description' />
      </TestWrapper>,
    );
    getByText('banner-title');
    getByText('banner-description');
  });

  it('should render with different appearances', () => {
    const { getByTestId, rerender } = render(
      <TestWrapper>
        <Banner testID='banner-id' title='Info Banner' appearance='info' />
      </TestWrapper>,
    );
    expect(getByTestId('banner-id').props.style.backgroundColor).toBe(
      colors.bg.surface,
    );

    rerender(
      <TestWrapper>
        <Banner
          testID='banner-id'
          title='Success Banner'
          appearance='success'
        />
      </TestWrapper>,
    );
    expect(getByTestId('banner-id').props.style.backgroundColor).toBe(
      colors.bg.success,
    );

    rerender(
      <TestWrapper>
        <Banner
          testID='banner-id'
          title='Warning Banner'
          appearance='warning'
        />
      </TestWrapper>,
    );
    expect(getByTestId('banner-id').props.style.backgroundColor).toBe(
      colors.bg.warning,
    );

    rerender(
      <TestWrapper>
        <Banner testID='banner-id' title='Error Banner' appearance='error' />
      </TestWrapper>,
    );
    expect(getByTestId('banner-id').props.style.backgroundColor).toBe(
      colors.bg.error,
    );
  });

  it('should render primary and secondary actions', () => {
    const { getByText } = render(
      <TestWrapper>
        <Banner
          title='Banner with Primary'
          primaryAction={<Button>Primary</Button>}
          secondaryAction={<Button>Secondary</Button>}
        />
      </TestWrapper>,
    );

    getByText('Primary');
    getByText('Secondary');
  });

  it('should handle primaryAction button clicks', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <TestWrapper>
        <Banner
          title='Banner with Primary'
          primaryAction={<Button onPress={onPressMock}>Primary</Button>}
        />
      </TestWrapper>,
    );

    expect(onPressMock).not.toHaveBeenCalled();
    fireEvent.press(getByText('Primary'));
    expect(onPressMock).toHaveBeenCalled();
  });

  it('should handle onClose button clicks', () => {
    const onCloseMock = jest.fn();
    const { getByTestId } = render(
      <TestWrapper>
        <Banner title='Banner with Primary' onClose={onCloseMock} />
      </TestWrapper>,
    );

    expect(onCloseMock).not.toHaveBeenCalled();
    fireEvent.press(getByTestId('banner-close-button'));
    expect(onCloseMock).toHaveBeenCalled();
  });
});

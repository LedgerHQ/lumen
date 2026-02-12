import { describe, it, expect } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render } from '@testing-library/react-native';
import React from 'react';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { Skeleton } from './Skeleton';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);

describe('Skeleton Component', () => {
  it('should render correctly', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <Skeleton />
      </TestWrapper>,
    );
    const skeletonElement = getByTestId('skeleton');
    expect(skeletonElement).toBeTruthy();
  });

  it('should render list-item variant', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <Skeleton testID='list-item-skeleton' component='list-item' />
      </TestWrapper>,
    );
    const skeletonElement = getByTestId('list-item-skeleton');
    expect(skeletonElement).toBeTruthy();
  });

  it('should render tile variant', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <Skeleton testID='tile-skeleton' component='tile' />
      </TestWrapper>,
    );
    const skeletonElement = getByTestId('tile-skeleton');
    expect(skeletonElement).toBeTruthy();
  });

  it('should accept additional props', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <Skeleton testID='custom-skeleton' />
      </TestWrapper>,
    );
    const skeletonElement = getByTestId('custom-skeleton');
    expect(skeletonElement).toBeTruthy();
  });
});

import { describe, it, expect } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render } from '@testing-library/react-native';
import { createRef } from 'react';
import { Text, type View } from 'react-native';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { DotCount } from './DotCount';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);

describe('DotCount', () => {
  it('should render the value', () => {
    const { getByText } = render(
      <TestWrapper>
        <DotCount value={5} size='md' />
      </TestWrapper>,
    );

    expect(getByText('5')).toBeTruthy();
  });

  it('should hide text when value is 0', () => {
    const { queryByText } = render(
      <TestWrapper>
        <DotCount value={0} size='md' />
      </TestWrapper>,
    );

    expect(queryByText('0')).toBeNull();
  });

  it('should cap value at max and show overflow indicator', () => {
    const { getByText } = render(
      <TestWrapper>
        <DotCount value={100} max={50} size='md' />
      </TestWrapper>,
    );

    expect(getByText('50+')).toBeTruthy();
  });

  it('should default max to 99', () => {
    const { getByText } = render(
      <TestWrapper>
        <DotCount value={150} size='md' />
      </TestWrapper>,
    );

    expect(getByText('99+')).toBeTruthy();
  });

  it('should clamp max to 1 when given zero or negative', () => {
    const { getByText } = render(
      <TestWrapper>
        <DotCount value={5} max={0} size='md' />
      </TestWrapper>,
    );

    expect(getByText('1+')).toBeTruthy();
  });

  it('should render children alongside the count', () => {
    const { getByText } = render(
      <TestWrapper>
        <DotCount value={3} size='sm'>
          <Text>Child</Text>
        </DotCount>
      </TestWrapper>,
    );

    expect(getByText('3')).toBeTruthy();
    expect(getByText('Child')).toBeTruthy();
  });

  it('should forward testID to the outer wrapper', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <DotCount testID='dot-count' value={3} size='md' />
      </TestWrapper>,
    );

    expect(getByTestId('dot-count')).toBeTruthy();
  });

  it('should forward pointerEvents to the outer wrapper', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <DotCount testID='dot-count' value={3} size='md' pointerEvents='none' />
      </TestWrapper>,
    );

    expect(getByTestId('dot-count').props.pointerEvents).toBe('none');
  });

  it('should forward ref to the outer wrapper', () => {
    const ref = createRef<View>();

    render(
      <TestWrapper>
        <DotCount ref={ref} value={3} size='md' />
      </TestWrapper>,
    );

    expect(ref.current).toBeTruthy();
  });

  it('should render with negative appearance', () => {
    const { getByText } = render(
      <TestWrapper>
        <DotCount value={5} size='md' appearance='negative' />
      </TestWrapper>,
    );

    expect(getByText('5')).toBeTruthy();
  });

  it('should render with disabled state', () => {
    const { getByText } = render(
      <TestWrapper>
        <DotCount value={5} size='md' disabled />
      </TestWrapper>,
    );

    expect(getByText('5')).toBeTruthy();
  });

  it('should render in sm size', () => {
    const { getByText } = render(
      <TestWrapper>
        <DotCount value={5} size='sm' />
      </TestWrapper>,
    );

    expect(getByText('5')).toBeTruthy();
  });

  it('should default size to md when omitted', () => {
    const { getByText } = render(
      <TestWrapper>
        <DotCount value={5} />
      </TestWrapper>,
    );

    expect(getByText('5')).toBeTruthy();
  });
});

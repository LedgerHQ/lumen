import { describe, it, expect } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render } from '@testing-library/react-native';
import { createRef } from 'react';
import { Text, type View } from 'react-native';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { DotIndicator } from './DotIndicator';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);

describe('DotIndicator', () => {
  it('should render without crashing', () => {
    const { toJSON } = render(
      <TestWrapper>
        <DotIndicator />
      </TestWrapper>,
    );

    expect(toJSON()).toBeTruthy();
  });

  it('should render children', () => {
    const { getByText } = render(
      <TestWrapper>
        <DotIndicator>
          <Text>Child</Text>
        </DotIndicator>
      </TestWrapper>,
    );

    expect(getByText('Child')).toBeTruthy();
  });

  it('should apply accessibility label', () => {
    const { getByLabelText } = render(
      <TestWrapper>
        <DotIndicator accessibilityLabel='New notifications' />
      </TestWrapper>,
    );

    expect(getByLabelText('New notifications')).toBeTruthy();
  });

  it('should forward testID to the outer wrapper', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <DotIndicator testID='dot-indicator' />
      </TestWrapper>,
    );

    expect(getByTestId('dot-indicator')).toBeTruthy();
  });

  it('should forward pointerEvents to the outer wrapper', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <DotIndicator testID='dot-indicator' pointerEvents='none' />
      </TestWrapper>,
    );

    expect(getByTestId('dot-indicator').props.pointerEvents).toBe('none');
  });

  it('should forward ref to the outer wrapper', () => {
    const ref = createRef<View>();

    render(
      <TestWrapper>
        <DotIndicator ref={ref} />
      </TestWrapper>,
    );

    expect(ref.current).toBeTruthy();
  });

  it('should render with negative appearance', () => {
    const { toJSON } = render(
      <TestWrapper>
        <DotIndicator appearance='negative' />
      </TestWrapper>,
    );

    expect(toJSON()).toBeTruthy();
  });

  it('should render with disabled state', () => {
    const { toJSON } = render(
      <TestWrapper>
        <DotIndicator disabled />
      </TestWrapper>,
    );

    expect(toJSON()).toBeTruthy();
  });

  it('should render pinned overlay when children provided', () => {
    const { getByTestId, getByText } = render(
      <TestWrapper>
        <DotIndicator testID='dot-indicator'>
          <Text>Content</Text>
        </DotIndicator>
      </TestWrapper>,
    );

    expect(getByTestId('dot-indicator')).toBeTruthy();
    expect(getByText('Content')).toBeTruthy();
  });
});

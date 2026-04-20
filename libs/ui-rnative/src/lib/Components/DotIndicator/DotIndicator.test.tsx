import { describe, it, expect } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
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
});

import { describe, it, expect } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
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
});

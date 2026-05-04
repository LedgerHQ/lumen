import { describe, it, expect } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { Trend } from './Trend';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);

describe('Trend Component', () => {
  it('should render positive value', () => {
    const { getByText } = render(
      <TestWrapper>
        <Trend value={5.5} />
      </TestWrapper>,
    );
    expect(getByText('5.50%')).toBeTruthy();
  });

  it('should render negative value', () => {
    const { getByText } = render(
      <TestWrapper>
        <Trend value={-3.2} />
      </TestWrapper>,
    );
    expect(getByText('-3.20%')).toBeTruthy();
  });

  it('should render neutral when value is zero', () => {
    const { getByText } = render(
      <TestWrapper>
        <Trend value={0} />
      </TestWrapper>,
    );
    expect(getByText('0.00%')).toBeTruthy();
  });

  it('should render with sm size', () => {
    const { getByText } = render(
      <TestWrapper>
        <Trend value={1.5} size='sm' />
      </TestWrapper>,
    );
    expect(getByText('1.50%')).toBeTruthy();
  });

  it('should render with md size', () => {
    const { getByText } = render(
      <TestWrapper>
        <Trend value={1.5} size='md' />
      </TestWrapper>,
    );
    expect(getByText('1.50%')).toBeTruthy();
  });

  it('should render in disabled state', () => {
    const { getByText } = render(
      <TestWrapper>
        <Trend value={5} disabled />
      </TestWrapper>,
    );
    expect(getByText('5.00%')).toBeTruthy();
  });

  it('should pass testID to root element', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <Trend testID='trend-id' value={10} />
      </TestWrapper>,
    );
    expect(getByTestId('trend-id')).toBeTruthy();
  });

  it('should format value to 2 decimal places', () => {
    const { getByText } = render(
      <TestWrapper>
        <Trend value={1.123456} />
      </TestWrapper>,
    );
    expect(getByText('1.12%')).toBeTruthy();
  });

  it('should render all variants side by side', () => {
    const { getByText } = render(
      <TestWrapper>
        <Trend value={10} />
        <Trend value={-10} />
        <Trend value={0} />
      </TestWrapper>,
    );
    expect(getByText('10.00%')).toBeTruthy();
    expect(getByText('-10.00%')).toBeTruthy();
    expect(getByText('0.00%')).toBeTruthy();
  });
});

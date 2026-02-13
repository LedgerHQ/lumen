import { describe, it, expect } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, screen } from '@testing-library/react-native';
import React from 'react';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { AmountDisplay } from './AmountDisplay';
import { FormattedValue } from './types';

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);

describe('AmountDisplay', () => {
  const createFormatter =
    (overrides: Partial<FormattedValue> = {}) =>
    (): FormattedValue => ({
      integerPart: '1234',
      decimalPart: '56',
      currencyText: 'USD',
      currencyPosition: 'start',
      decimalSeparator: '.',
      ...overrides,
    });

  it('renders with basic formatter', () => {
    const formatter = createFormatter();
    render(
      <TestWrapper>
        <AmountDisplay value={1234.56} formatter={formatter} />
      </TestWrapper>,
    );

    expect(screen.getByText('USD')).toBeTruthy();
    expect(screen.getByText('1234')).toBeTruthy();
    expect(screen.getByText('.56')).toBeTruthy();
  });

  it('renders currency at start position', () => {
    const formatter = createFormatter({ currencyPosition: 'start' });
    render(
      <TestWrapper>
        <AmountDisplay value={1234.56} formatter={formatter} />
      </TestWrapper>,
    );

    expect(screen.getByText('USD')).toBeTruthy();
    expect(screen.getByText('1234')).toBeTruthy();
  });

  it('renders currency at end position', () => {
    const formatter = createFormatter({ currencyPosition: 'end' });
    render(
      <TestWrapper>
        <AmountDisplay value={1234.56} formatter={formatter} />
      </TestWrapper>,
    );

    expect(screen.getByText('USD')).toBeTruthy();
    expect(screen.getByText('.56')).toBeTruthy();
  });

  it('renders without decimal part', () => {
    const formatter = createFormatter({ decimalPart: undefined });
    render(
      <TestWrapper>
        <AmountDisplay value={1234} formatter={formatter} />
      </TestWrapper>,
    );

    expect(screen.getByText('1234')).toBeTruthy();
    expect(screen.queryByText(/\./)).toBeNull();
  });

  it('uses comma as decimal separator', () => {
    const formatter = createFormatter({ decimalSeparator: ',' });
    render(
      <TestWrapper>
        <AmountDisplay value={1234.56} formatter={formatter} />
      </TestWrapper>,
    );

    expect(screen.getByText(',56')).toBeTruthy();
  });

  it('uses default dot separator when not specified', () => {
    const formatter = createFormatter({ decimalSeparator: undefined });
    render(
      <TestWrapper>
        <AmountDisplay value={1234.56} formatter={formatter} />
      </TestWrapper>,
    );

    expect(screen.getByText('.56')).toBeTruthy();
  });

  it('forwards additional props', () => {
    const formatter = createFormatter();
    render(
      <TestWrapper>
        <AmountDisplay
          value={1234.56}
          formatter={formatter}
          testID='amount-display'
        />
      </TestWrapper>,
    );

    expect(screen.getByTestId('amount-display')).toBeTruthy();
  });

  it('handles zero value', () => {
    const formatter = createFormatter({
      integerPart: '0',
      decimalPart: '00',
    });
    render(
      <TestWrapper>
        <AmountDisplay value={0} formatter={formatter} />
      </TestWrapper>,
    );

    expect(screen.getByText('0')).toBeTruthy();
    expect(screen.getByText('.00')).toBeTruthy();
  });

  it('handles large numbers', () => {
    const formatter = createFormatter({
      integerPart: '1,234,567',
      decimalPart: '89',
    });
    render(
      <TestWrapper>
        <AmountDisplay value={1234567.89} formatter={formatter} />
      </TestWrapper>,
    );

    expect(screen.getByText('1,234,567')).toBeTruthy();
    expect(screen.getByText('.89')).toBeTruthy();
  });

  it('displays bullet points when hidden is true', () => {
    const formatter = createFormatter();
    render(
      <TestWrapper>
        <AmountDisplay value={1234.56} formatter={formatter} hidden={true} />
      </TestWrapper>,
    );

    expect(screen.getByText('••••')).toBeTruthy();
    expect(screen.getByText('USD')).toBeTruthy();
    expect(screen.queryByText('1234')).toBeNull();
    expect(screen.queryByText('.56')).toBeNull();
  });

  it('displays amount normally when hidden is false', () => {
    const formatter = createFormatter();
    render(
      <TestWrapper>
        <AmountDisplay value={1234.56} formatter={formatter} hidden={false} />
      </TestWrapper>,
    );

    expect(screen.getByText('1234')).toBeTruthy();
    expect(screen.getByText('.56')).toBeTruthy();
    expect(screen.queryByText('••••')).toBeNull();
  });

  it('hides decimal part and shows only bullets when hidden', () => {
    const formatter = createFormatter({ currencyPosition: 'end' });
    render(
      <TestWrapper>
        <AmountDisplay value={1234.56} formatter={formatter} hidden={true} />
      </TestWrapper>,
    );

    expect(screen.getByText('••••')).toBeTruthy();
    expect(screen.queryByText('.56')).toBeNull();
  });

  it('renders correctly when loading is true', () => {
    const formatter = createFormatter();
    render(
      <TestWrapper>
        <AmountDisplay value={1234.56} formatter={formatter} loading={true} />
      </TestWrapper>,
    );

    expect(screen.getByText('USD')).toBeTruthy();
    expect(screen.getByText('1234')).toBeTruthy();
    expect(screen.getByText('.56')).toBeTruthy();
  });
});

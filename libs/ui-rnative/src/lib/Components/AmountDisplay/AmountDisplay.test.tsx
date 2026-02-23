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

const hidden = { includeHiddenElements: true } as const;

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

  type TestNode = {
    type: unknown;
    props: {
      accessibilityValue?: { text?: string };
      [key: string]: unknown;
    };
  };

  const getDigitStripValues = (): number[] => {
    return screen.root
      .findAll(
        (node: TestNode) =>
          typeof node.type !== 'function' &&
          node.props.accessibilityValue?.text !== undefined,
      )
      .map((node: TestNode) => Number(node.props.accessibilityValue?.text));
  };

  it('renders with basic formatter', () => {
    const formatter = createFormatter();
    render(
      <TestWrapper>
        <AmountDisplay value={1234.56} formatter={formatter} hidden={false} />
      </TestWrapper>,
    );

    expect(screen.getByText('USD', hidden)).toBeTruthy();
    expect(screen.getByText('.', hidden)).toBeTruthy();
    expect(getDigitStripValues()).toEqual([1, 2, 3, 4, 5, 6]);
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

    expect(getDigitStripValues()).toEqual([0, 0, 0]);
    expect(screen.getByText('.', hidden)).toBeTruthy();
  });

  it('handles large numbers', () => {
    const formatter = createFormatter({
      integerPart: '1234567',
      decimalPart: '89',
    });
    render(
      <TestWrapper>
        <AmountDisplay value={1234567.89} formatter={formatter} />
      </TestWrapper>,
    );

    expect(getDigitStripValues()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(screen.getByText('.', hidden)).toBeTruthy();
  });

  it('renders currency at start position', () => {
    const formatter = createFormatter({ currencyPosition: 'start' });
    render(
      <TestWrapper>
        <AmountDisplay value={1234.56} formatter={formatter} />
      </TestWrapper>,
    );

    expect(screen.getByText('USD', hidden)).toBeTruthy();
  });

  it('renders currency at end position', () => {
    const formatter = createFormatter({ currencyPosition: 'end' });
    render(
      <TestWrapper>
        <AmountDisplay value={1234.56} formatter={formatter} />
      </TestWrapper>,
    );

    expect(screen.getByText('USD', hidden)).toBeTruthy();
  });

  it('renders without decimal part', () => {
    const formatter = createFormatter({ decimalPart: undefined });
    render(
      <TestWrapper>
        <AmountDisplay value={1234} formatter={formatter} />
      </TestWrapper>,
    );

    expect(screen.queryByText('.', hidden)).toBeNull();
  });

  it('uses comma as decimal separator', () => {
    const formatter = createFormatter({ decimalSeparator: ',' });
    render(
      <TestWrapper>
        <AmountDisplay value={1234.56} formatter={formatter} />
      </TestWrapper>,
    );

    expect(screen.getByText(',', hidden)).toBeTruthy();
  });

  it('uses default dot separator', () => {
    const formatter = createFormatter();
    render(
      <TestWrapper>
        <AmountDisplay value={1234.56} formatter={formatter} />
      </TestWrapper>,
    );

    expect(screen.getByText('.', hidden)).toBeTruthy();
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

  it('displays bullet points when hidden is true', () => {
    const formatter = createFormatter();
    render(
      <TestWrapper>
        <AmountDisplay value={1234.56} formatter={formatter} hidden={true} />
      </TestWrapper>,
    );

    expect(screen.getByText('••••', hidden)).toBeTruthy();
    expect(screen.getByText('USD', hidden)).toBeTruthy();
    expect(screen.queryByText('.', hidden)).toBeNull();
  });

  it('renders correctly when loading is true', () => {
    const formatter = createFormatter();
    render(
      <TestWrapper>
        <AmountDisplay value={1234.56} formatter={formatter} loading={true} />
      </TestWrapper>,
    );

    expect(screen.getByText('USD', hidden)).toBeTruthy();
    expect(screen.getByText('.', hidden)).toBeTruthy();
  });

  it('renders correctly when loading is false', () => {
    const formatter = createFormatter();
    render(
      <TestWrapper>
        <AmountDisplay value={1234.56} formatter={formatter} loading={false} />
      </TestWrapper>,
    );

    expect(screen.getByText('USD', hidden)).toBeTruthy();
    expect(screen.getByText('.', hidden)).toBeTruthy();
  });

  it('sets accessibilityLabel with currency at start', () => {
    const formatter = createFormatter({ currencyPosition: 'start' });
    render(
      <TestWrapper>
        <AmountDisplay value={1234.56} formatter={formatter} />
      </TestWrapper>,
    );

    expect(screen.getByLabelText('USD 1234.56')).toBeTruthy();
  });

  it('sets accessibilityLabel with currency at end', () => {
    const formatter = createFormatter({ currencyPosition: 'end' });
    render(
      <TestWrapper>
        <AmountDisplay value={1234.56} formatter={formatter} />
      </TestWrapper>,
    );

    expect(screen.getByLabelText('1234.56 USD')).toBeTruthy();
  });

  it('sets accessibilityLabel to "Amount hidden" when hidden', () => {
    const formatter = createFormatter();
    render(
      <TestWrapper>
        <AmountDisplay value={1234.56} formatter={formatter} hidden={true} />
      </TestWrapper>,
    );

    expect(screen.getByLabelText('Amount hidden')).toBeTruthy();
  });

  it('renders group separators', () => {
    const formatter = createFormatter({
      integerPart: '1,234,567',
      decimalPart: '89',
      decimalSeparator: '.',
    });
    render(
      <TestWrapper>
        <AmountDisplay value={1234567.89} formatter={formatter} />
      </TestWrapper>,
    );

    expect(screen.getAllByText(',', hidden)).toHaveLength(2);
  });
});

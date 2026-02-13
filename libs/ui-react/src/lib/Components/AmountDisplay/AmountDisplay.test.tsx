import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';

import { AmountDisplay } from './AmountDisplay';
import { FormattedValue } from './types';

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
    render(<AmountDisplay value={1234.56} formatter={formatter} />);

    expect(screen.getByText('USD')).toBeInTheDocument();
    expect(screen.getByText('1234')).toBeInTheDocument();
    expect(screen.getByText('.56')).toBeInTheDocument();
  });

  it('renders currency at start position', () => {
    const formatter = createFormatter({ currencyPosition: 'start' });
    render(<AmountDisplay value={1234.56} formatter={formatter} />);

    const currencyElement = screen.getByText('USD');
    const integerElement = screen.getByText('1234');

    expect(currencyElement.compareDocumentPosition(integerElement)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(currencyElement).toHaveClass('me-4');
  });

  it('renders currency at end position', () => {
    const formatter = createFormatter({ currencyPosition: 'end' });
    render(<AmountDisplay value={1234.56} formatter={formatter} />);

    const currencyElement = screen.getByText('USD');
    const decimalElement = screen.getByText('.56');

    expect(decimalElement.compareDocumentPosition(currencyElement)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(currencyElement).toHaveClass('ms-4');
  });

  it('renders without decimal part', () => {
    const formatter = createFormatter({ decimalPart: undefined });
    render(<AmountDisplay value={1234} formatter={formatter} />);

    expect(screen.getByText('1234')).toBeInTheDocument();
    expect(screen.queryByText(/\./)).not.toBeInTheDocument();
  });

  it('uses comma as decimal separator', () => {
    const formatter = createFormatter({ decimalSeparator: ',' });
    render(<AmountDisplay value={1234.56} formatter={formatter} />);

    expect(screen.getByText(',56')).toBeInTheDocument();
  });

  it('uses default dot separator when not specified', () => {
    const formatter = createFormatter({ decimalSeparator: undefined });
    render(<AmountDisplay value={1234.56} formatter={formatter} />);

    expect(screen.getByText('.56')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const formatter = createFormatter();
    const { container } = render(
      <AmountDisplay
        value={1234.56}
        formatter={formatter}
        // eslint-disable-next-line better-tailwindcss/no-unknown-classes
        className='custom-class'
      />,
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('forwards additional props', () => {
    const formatter = createFormatter();
    render(
      <AmountDisplay
        value={1234.56}
        formatter={formatter}
        data-testid='amount-display'
      />,
    );

    expect(screen.getByTestId('amount-display')).toBeInTheDocument();
  });

  it('handles zero value', () => {
    const formatter = createFormatter({
      integerPart: '0',
      decimalPart: '00',
    });
    render(<AmountDisplay value={0} formatter={formatter} />);

    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('.00')).toBeInTheDocument();
  });

  it('handles large numbers', () => {
    const formatter = createFormatter({
      integerPart: '1,234,567',
      decimalPart: '89',
    });
    render(<AmountDisplay value={1234567.89} formatter={formatter} />);

    expect(screen.getByText('1,234,567')).toBeInTheDocument();
    expect(screen.getByText('.89')).toBeInTheDocument();
  });

  it('displays bullet points when hidden is true', () => {
    const formatter = createFormatter();
    render(
      <AmountDisplay value={1234.56} formatter={formatter} hidden={true} />,
    );

    expect(screen.getByText('••••')).toBeInTheDocument();
    expect(screen.getByText('USD')).toBeInTheDocument();
    expect(screen.queryByText('1234')).not.toBeInTheDocument();
    expect(screen.queryByText('.56')).not.toBeInTheDocument();
  });

  it('displays amount normally when hidden is false', () => {
    const formatter = createFormatter();
    render(
      <AmountDisplay value={1234.56} formatter={formatter} hidden={false} />,
    );

    expect(screen.getByText('1234')).toBeInTheDocument();
    expect(screen.getByText('.56')).toBeInTheDocument();
    expect(screen.queryByText('••••')).not.toBeInTheDocument();
  });

  it('hides decimal part and shows only bullets when hidden', () => {
    const formatter = createFormatter({ currencyPosition: 'end' });
    render(
      <AmountDisplay value={1234.56} formatter={formatter} hidden={true} />,
    );

    expect(screen.getByText('••••')).toBeInTheDocument();
    expect(screen.queryByText('.56')).not.toBeInTheDocument();
  });
  it('has animate-pulse class when loading prop is set to true', () => {
    const formatter = createFormatter();
    const { container } = render(
      <AmountDisplay value={1234.56} formatter={formatter} loading={true} />,
    );

    expect(container.firstChild).toHaveClass('animate-pulse');
  });

  it('does not have animate-pulse class when loading is false', () => {
    const formatter = createFormatter();
    const { container } = render(
      <AmountDisplay value={1234.56} formatter={formatter} loading={false} />,
    );

    expect(container.firstChild).not.toHaveClass('animate-pulse');
  });
});

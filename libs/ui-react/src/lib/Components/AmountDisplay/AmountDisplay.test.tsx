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

  const getDigitStripValues = (container: HTMLElement): number[] => {
    const strips = container.querySelectorAll<HTMLElement>(
      '[style*="translateY"]',
    );
    return Array.from(strips).map((el) => {
      const match = el.style.transform.match(/translateY\(-(\d+)%\)/);
      return match ? parseInt(match[1]) / 10 : -1;
    });
  };

  it('renders with basic formatter', () => {
    const formatter = createFormatter();
    const { container } = render(
      <AmountDisplay value={1234.56} formatter={formatter} hidden={false} />,
    );

    expect(screen.getByText('USD')).toBeInTheDocument();
    expect(screen.getByText('.')).toBeInTheDocument();
    expect(getDigitStripValues(container)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('handles zero value', () => {
    const formatter = createFormatter({
      integerPart: '0',
      decimalPart: '00',
    });
    const { container } = render(
      <AmountDisplay value={0} formatter={formatter} />,
    );

    expect(getDigitStripValues(container)).toEqual([0, 0, 0]);
    expect(screen.getByText('.')).toBeInTheDocument();
  });

  it('handles large numbers', () => {
    const formatter = createFormatter({
      integerPart: '1234567',
      decimalPart: '89',
    });
    const { container } = render(
      <AmountDisplay value={1234567.89} formatter={formatter} />,
    );

    expect(getDigitStripValues(container)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(screen.getByText('.')).toBeInTheDocument();
  });

  it('renders currency at start position', () => {
    const formatter = createFormatter({ currencyPosition: 'start' });
    render(<AmountDisplay value={1234.56} formatter={formatter} />);

    expect(screen.getByText('USD')).toHaveClass('me-4');
  });

  it('renders currency at end position', () => {
    const formatter = createFormatter({ currencyPosition: 'end' });
    render(<AmountDisplay value={1234.56} formatter={formatter} />);

    expect(screen.getByText('USD')).toHaveClass('ms-4');
  });

  it('renders without decimal part', () => {
    const formatter = createFormatter({ decimalPart: undefined });
    render(<AmountDisplay value={1234} formatter={formatter} />);

    expect(screen.queryByText('.')).not.toBeInTheDocument();
  });

  it('uses comma as decimal separator', () => {
    const formatter = createFormatter({ decimalSeparator: ',' });
    render(<AmountDisplay value={1234.56} formatter={formatter} />);

    expect(screen.getByText(',')).toBeInTheDocument();
  });

  it('uses default dot separator', () => {
    const formatter = createFormatter();
    render(<AmountDisplay value={1234.56} formatter={formatter} />);

    expect(screen.getByText('.')).toBeInTheDocument();
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

  it('displays bullet points when hidden is true', () => {
    const formatter = createFormatter();
    render(
      <AmountDisplay value={1234.56} formatter={formatter} hidden={true} />,
    );

    expect(screen.getByText('••••')).toBeInTheDocument();
    expect(screen.getByText('USD')).toBeInTheDocument();
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
  it('has aria-label with currency at start', () => {
    const formatter = createFormatter();
    const { container } = render(
      <AmountDisplay value={1234.56} formatter={formatter} />,
    );

    expect(container.firstChild).toHaveAttribute('aria-label', 'USD 1234.56');
  });

  it('has aria-label with currency at end', () => {
    const formatter = createFormatter({ currencyPosition: 'end' });
    const { container } = render(
      <AmountDisplay value={1234.56} formatter={formatter} />,
    );

    expect(container.firstChild).toHaveAttribute('aria-label', '1234.56 USD');
  });

  it('has aria-label "Amount hidden" when hidden', () => {
    const formatter = createFormatter();
    const { container } = render(
      <AmountDisplay value={1234.56} formatter={formatter} hidden={true} />,
    );

    expect(container.firstChild).toHaveAttribute(
      'aria-label',
      'components.amountDisplay.amountHiddenAriaLabel',
    );
  });

  it('hides visual spans from screen readers with aria-hidden', () => {
    const formatter = createFormatter();
    const { container } = render(
      <AmountDisplay value={1234.56} formatter={formatter} />,
    );

    const root = container.firstChild as HTMLElement;
    const children = Array.from(root.children);
    expect(children).toHaveLength(2);
    expect(children[0]).toHaveAttribute('aria-hidden', 'true');
    expect(children[1]).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders group separators', () => {
    const formatter = createFormatter({
      integerPart: '1,234,567',
      decimalPart: '89',
      decimalSeparator: '.',
    });
    render(<AmountDisplay value={1234567.89} formatter={formatter} />);

    expect(screen.getAllByText(',')).toHaveLength(2);
  });
});

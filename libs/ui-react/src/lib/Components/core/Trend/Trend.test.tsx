import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { Trend } from './Trend';

describe('Trend Component', () => {
  it('should render positive value', () => {
    render(<Trend value={5.5} />);
    expect(screen.getByText('5.50%')).toBeInTheDocument();
  });

  it('should render negative value', () => {
    render(<Trend value={-3.2} />);
    expect(screen.getByText('-3.20%')).toBeInTheDocument();
  });

  it('should render neutral when value is zero', () => {
    render(<Trend value={0} />);
    expect(screen.getByText('0.00%')).toBeInTheDocument();
  });

  it('should render with sm size', () => {
    render(<Trend value={1.5} size='sm' />);
    expect(screen.getByText('1.50%')).toBeInTheDocument();
  });

  it('should render with md size', () => {
    render(<Trend value={1.5} size='md' />);
    expect(screen.getByText('1.50%')).toBeInTheDocument();
  });

  it('should render in disabled state', () => {
    render(<Trend value={5} disabled />);
    expect(screen.getByText('5.00%')).toBeInTheDocument();
  });

  it('should pass data-testid', () => {
    render(<Trend data-testid='trend-id' value={10} />);
    expect(screen.getByTestId('trend-id')).toBeInTheDocument();
  });

  it('should format value to 2 decimal places', () => {
    render(<Trend value={1.123456} />);
    expect(screen.getByText('1.12%')).toBeInTheDocument();
  });

  it('should render all variants side by side', () => {
    render(
      <>
        <Trend value={10} />
        <Trend value={-10} />
        <Trend value={0} />
      </>,
    );
    expect(screen.getByText('10.00%')).toBeInTheDocument();
    expect(screen.getByText('-10.00%')).toBeInTheDocument();
    expect(screen.getByText('0.00%')).toBeInTheDocument();
  });

  it('should apply positive color class', () => {
    render(<Trend data-testid='trend' value={5} />);
    expect(screen.getByTestId('trend')).toHaveClass('text-success');
  });

  it('should apply negative color class', () => {
    render(<Trend data-testid='trend' value={-5} />);
    expect(screen.getByTestId('trend')).toHaveClass('text-error');
  });

  it('should apply neutral color class', () => {
    render(<Trend data-testid='trend' value={0} />);
    expect(screen.getByTestId('trend')).toHaveClass('text-muted');
  });

  it('should apply disabled color class', () => {
    render(<Trend data-testid='trend' value={5} disabled />);
    expect(screen.getByTestId('trend')).toHaveClass('text-disabled');
  });

  it('should apply md typography class', () => {
    render(<Trend data-testid='trend' value={5} size='md' />);
    expect(screen.getByTestId('trend')).toHaveClass('body-2');
  });

  it('should apply sm typography class', () => {
    render(<Trend data-testid='trend' value={5} size='sm' />);
    expect(screen.getByTestId('trend')).toHaveClass('body-3');
  });

  it('should merge custom className', () => {
    render(<Trend data-testid='trend' value={5} className='mt-4' />);
    expect(screen.getByTestId('trend')).toHaveClass('mt-4');
  });

  it('should set aria-label for positive variant', () => {
    render(<Trend data-testid='trend' value={5.5} />);
    expect(screen.getByTestId('trend')).toHaveAttribute(
      'aria-label',
      'components.trend.positiveAriaLabel',
    );
  });

  it('should set aria-label for negative variant', () => {
    render(<Trend data-testid='trend' value={-3.2} />);
    expect(screen.getByTestId('trend')).toHaveAttribute(
      'aria-label',
      'components.trend.negativeAriaLabel',
    );
  });

  it('should set aria-label for neutral variant', () => {
    render(<Trend data-testid='trend' value={0} />);
    expect(screen.getByTestId('trend')).toHaveAttribute(
      'aria-label',
      'components.trend.neutralAriaLabel',
    );
  });

  it('should forward ref', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Trend ref={ref} value={5} />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});

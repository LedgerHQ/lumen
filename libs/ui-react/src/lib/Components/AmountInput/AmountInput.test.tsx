import { getFontSize } from '@ledgerhq/lumen-utils-shared';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { AmountInput } from './AmountInput';

// Helper to create required controlled props
const createControlledProps = (overrides = {}) => ({
  value: '',
  onChange: vi.fn(),
  ...overrides,
});

describe('AmountInput', () => {
  it('renders with default props', () => {
    render(
      <AmountInput placeholder='Enter amount' value='' onChange={vi.fn()} />,
    );
    expect(screen.getByPlaceholderText('Enter amount')).toBeInTheDocument();
  });

  it('renders with currency text on the left by default', () => {
    render(
      <AmountInput
        currencyText='$'
        placeholder='0'
        {...createControlledProps()}
      />,
    );
    const currencyElement = screen.getByText('$');
    const input = screen.getByRole('textbox');
    expect(currencyElement).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    // Check if currency appears before input in document order
    expect(
      currencyElement.compareDocumentPosition(input) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('renders with currency text on the right when specified', () => {
    render(
      <AmountInput
        currencyText='USD'
        currencyPosition='right'
        placeholder='0'
        {...createControlledProps()}
      />,
    );
    const currencyElement = screen.getByText('USD');
    const input = screen.getByRole('textbox');
    expect(currencyElement).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    // Check if input appears before currency in document order
    expect(
      input.compareDocumentPosition(currencyElement) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('handles numeric input correctly', async () => {
    const handleChange = vi.fn();
    render(<AmountInput onChange={handleChange} currencyText='$' value='' />);

    const input = screen.getByRole('textbox');
    await userEvent.type(input, '123.45');

    expect(input).toHaveValue('123.45');
    expect(handleChange).toHaveBeenCalled();
  });

  it('applies error styles when aria-invalid is true', () => {
    render(
      <AmountInput
        currencyText='$'
        aria-invalid={true}
        {...createControlledProps()}
      />,
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('handles disabled state correctly', () => {
    render(
      <AmountInput currencyText='$' disabled {...createControlledProps()} />,
    );
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('forwards ref to input element', () => {
    const ref = { current: null };
    render(<AmountInput ref={ref} {...createControlledProps()} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('applies custom className to input element', () => {
    const customClass = 'custom-class';
    render(
      <AmountInput className={customClass} {...createControlledProps()} />,
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass(customClass);
  });

  it('updates currency text when prop changes', () => {
    const { rerender } = render(
      <AmountInput currencyText='$' {...createControlledProps()} />,
    );
    expect(screen.getByText('$')).toBeInTheDocument();

    rerender(<AmountInput currencyText='€' {...createControlledProps()} />);
    expect(screen.getByText('€')).toBeInTheDocument();
  });

  it('applies heading-0 typography class for md size', () => {
    render(<AmountInput {...createControlledProps({ value: '100' })} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('heading-0-semi-bold');
  });

  it('applies heading-2-semi-bold typography class for sm size', () => {
    render(
      <AmountInput size='sm' {...createControlledProps({ value: '55 555' })} />,
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('heading-2-semi-bold');
  });

  it('uses sm font size mapping for sm size', () => {
    render(
      <AmountInput size='sm' {...createControlledProps({ value: '5' })} />,
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveStyle({
      fontSize: `${getFontSize('5', 'sm')}px`,
    });
  });

  it('centers content by default', () => {
    const { container } = render(
      <AmountInput currencyText='$' {...createControlledProps()} />,
    );
    expect(container.firstChild).toHaveClass('justify-center');
  });

  it('applies start alignment', () => {
    const { container } = render(
      <AmountInput
        align='start'
        currencyText='$'
        {...createControlledProps()}
      />,
    );
    expect(container.firstChild).toHaveClass('justify-start');
  });

  it('applies end alignment', () => {
    const { container } = render(
      <AmountInput align='end' currencyText='$' {...createControlledProps()} />,
    );
    expect(container.firstChild).toHaveClass('justify-end');
  });

  it('uses extra width when currencyText is undefined', () => {
    const { rerender } = render(
      <AmountInput {...createControlledProps({ value: '55 555' })} />,
    );
    const widthWithoutCurrency = Number.parseInt(
      screen.getByRole('textbox').style.width,
      10,
    );

    rerender(
      <AmountInput
        currencyText='$'
        {...createControlledProps({ value: '55 555' })}
      />,
    );
    const widthWithCurrency = Number.parseInt(
      screen.getByRole('textbox').style.width,
      10,
    );

    expect(widthWithoutCurrency).toBeGreaterThan(widthWithCurrency);
  });

  it('maintains input value when currency position changes', () => {
    const { rerender } = render(
      <AmountInput
        currencyText='$'
        currencyPosition='left'
        value='123.45'
        onChange={vi.fn()}
      />,
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('123.45');

    rerender(
      <AmountInput
        currencyText='$'
        currencyPosition='right'
        value='123.45'
        onChange={vi.fn()}
      />,
    );
    expect(input).toHaveValue('123.45');
  });
});

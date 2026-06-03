import { getFontSize } from '@ledgerhq/lumen-utils-shared';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { AmountInput } from './AmountInput';

beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

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

  it('applies heading-0-semi-bold typography class for md size', () => {
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

  it('syncs input when value prop changes externally', () => {
    const { rerender } = render(<AmountInput value='100' onChange={vi.fn()} />);
    expect(screen.getByRole('textbox')).toHaveValue('100');

    rerender(<AmountInput value='200' onChange={vi.fn()} />);
    expect(screen.getByRole('textbox')).toHaveValue('200');
  });

  it('calls onChange with the cleaned value', async () => {
    const handleChange = vi.fn();
    render(
      <AmountInput
        value=''
        onChange={handleChange}
        thousandsSeparator={false}
      />,
    );
    await userEvent.type(screen.getByRole('textbox'), '5');
    expect(handleChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: '5' }),
      }),
    );
  });

  it('blocks decimal input when allowDecimals is false', async () => {
    render(
      <AmountInput
        value=''
        onChange={vi.fn()}
        allowDecimals={false}
        thousandsSeparator={false}
      />,
    );
    const input = screen.getByRole('textbox');
    await userEvent.type(input, '12.34');
    expect(input).toHaveValue('1234');
  });

  it('limits integer digits with maxIntegerLength', async () => {
    render(
      <AmountInput
        value=''
        onChange={vi.fn()}
        maxIntegerLength={3}
        allowDecimals={false}
        thousandsSeparator={false}
      />,
    );
    const input = screen.getByRole('textbox');
    await userEvent.type(input, '12345');
    expect(input).toHaveValue('123');
  });

  it('limits decimal digits with maxDecimalLength', async () => {
    render(
      <AmountInput
        value=''
        onChange={vi.fn()}
        maxDecimalLength={2}
        thousandsSeparator={false}
      />,
    );
    const input = screen.getByRole('textbox');
    await userEvent.type(input, '1.2345');
    expect(input).toHaveValue('1.23');
  });

  it('formats value with thousands separator by default', async () => {
    render(<AmountInput value='' onChange={vi.fn()} allowDecimals={false} />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, '1000');
    expect(input).toHaveValue('1 000');
  });

  it('does not format with thousands separator when disabled', async () => {
    render(
      <AmountInput
        value=''
        onChange={vi.fn()}
        allowDecimals={false}
        thousandsSeparator={false}
      />,
    );
    const input = screen.getByRole('textbox');
    await userEvent.type(input, '1000');
    expect(input).toHaveValue('1000');
  });

  it('has larger input width when empty than when filled', () => {
    const { rerender } = render(
      <AmountInput value='' onChange={vi.fn()} currencyText='$' />,
    );
    const emptyWidth = Number.parseInt(
      screen.getByRole('textbox').style.width,
      10,
    );

    rerender(<AmountInput value='1' onChange={vi.fn()} currencyText='$' />);
    const filledWidth = Number.parseInt(
      screen.getByRole('textbox').style.width,
      10,
    );

    expect(emptyWidth).toBeGreaterThan(filledWidth);
  });

  it('has inputMode set to decimal', () => {
    render(<AmountInput {...createControlledProps()} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('inputmode', 'decimal');
  });

  it('applies h-36 height class for sm size', () => {
    render(<AmountInput size='sm' {...createControlledProps()} />);
    expect(screen.getByRole('textbox')).toHaveClass('h-36');
  });

  it('applies h-56 height class for md size', () => {
    render(<AmountInput size='md' {...createControlledProps()} />);
    expect(screen.getByRole('textbox')).toHaveClass('h-56');
  });
});

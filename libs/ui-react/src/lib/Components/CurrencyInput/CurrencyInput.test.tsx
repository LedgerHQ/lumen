import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { CurrencyInput } from './CurrencyInput';

beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const StringWrapper = ({
  onValue,
  initial = '',
}: {
  onValue?: (value: string) => void;
  initial?: string;
}) => {
  const [value, setValue] = useState(initial);
  return (
    <CurrencyInput
      value={value}
      onChange={(next) => {
        setValue(next);
        onValue?.(next);
      }}
    />
  );
};

describe('CurrencyInput', () => {
  it('renders with a placeholder', () => {
    render(<CurrencyInput placeholder='0' value='' onChange={vi.fn()} />);
    expect(screen.getByPlaceholderText('0')).toBeInTheDocument();
  });

  it('renders currency text on the left by default', () => {
    render(<CurrencyInput currencyText='$' value='' onChange={vi.fn()} />);
    const currency = screen.getByText('$');
    const input = screen.getByRole('textbox');
    expect(
      currency.compareDocumentPosition(input) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('renders currency text on the right when specified', () => {
    render(
      <CurrencyInput
        currencyText='USD'
        currencyPosition='right'
        value=''
        onChange={vi.fn()}
      />,
    );
    const currency = screen.getByText('USD');
    const input = screen.getByRole('textbox');
    expect(
      input.compareDocumentPosition(currency) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('formats on change and emits the canonical string value', async () => {
    const onValue = vi.fn();
    render(<StringWrapper onValue={onValue} />);
    const input = screen.getByRole('textbox');

    await userEvent.type(input, '1234.5');

    expect(onValue).toHaveBeenLastCalledWith('1234.5');
    expect(input).toHaveValue('1 234.5');
  });

  it('strips invalid characters through the default sanitize', async () => {
    const onValue = vi.fn();
    render(<StringWrapper onValue={onValue} />);
    const input = screen.getByRole('textbox');

    await userEvent.type(input, '12a3$');

    expect(onValue).toHaveBeenLastCalledWith('123');
    expect(input).toHaveValue('123');
  });

  it('accepts comma as a decimal separator on input', async () => {
    const onValue = vi.fn();
    render(<StringWrapper onValue={onValue} />);

    await userEvent.type(screen.getByRole('textbox'), '1,5');

    expect(onValue).toHaveBeenLastCalledWith('1.5');
  });

  it('supports a custom value type via parse/format', async () => {
    const onValue = vi.fn();
    const NumberWrapper = () => {
      const [value, setValue] = useState<number | null>(null);
      return (
        <CurrencyInput<number | null>
          value={value}
          onChange={(next) => {
            setValue(next);
            onValue(next);
          }}
          parse={(safe) => (safe === '' ? null : Number(safe))}
          format={(val) => (val === null ? '' : String(val))}
        />
      );
    };
    render(<NumberWrapper />);

    await userEvent.type(screen.getByRole('textbox'), '12');

    expect(onValue).toHaveBeenLastCalledWith(12);
  });

  it('syncs the display when the value changes externally', () => {
    const { rerender } = render(
      <CurrencyInput value='1000' onChange={vi.fn()} />,
    );
    expect(screen.getByRole('textbox')).toHaveValue('1 000');

    rerender(<CurrencyInput value='2000000' onChange={vi.fn()} />);
    expect(screen.getByRole('textbox')).toHaveValue('2 000 000');
  });

  it('keeps the caret at the end after typing', async () => {
    const rafCallbacks: FrameRequestCallback[] = [];
    const rafSpy = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((cb: FrameRequestCallback) => {
        rafCallbacks.push(cb);
        return rafCallbacks.length;
      });

    render(<StringWrapper />);
    const input = screen.getByRole<HTMLInputElement>('textbox');

    await userEvent.type(input, '1234');
    rafCallbacks.forEach((cb) => cb(0));

    expect(input.selectionStart).toBe(input.value.length);
    expect(input.selectionEnd).toBe(input.value.length);

    rafSpy.mockRestore();
  });

  it('forwards ref to the input element', () => {
    const ref = { current: null };
    render(<CurrencyInput ref={ref} value='' onChange={vi.fn()} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('applies a custom className to the input element', () => {
    const customClass = 'custom-class';
    render(
      <CurrencyInput className={customClass} value='' onChange={vi.fn()} />,
    );
    expect(screen.getByRole('textbox')).toHaveClass(customClass);
  });

  it('handles disabled state', () => {
    render(<CurrencyInput disabled value='' onChange={vi.fn()} />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('applies error styles when aria-invalid is true', () => {
    render(<CurrencyInput aria-invalid value='' onChange={vi.fn()} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('has inputMode set to decimal', () => {
    render(<CurrencyInput value='' onChange={vi.fn()} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('inputmode', 'decimal');
  });
});

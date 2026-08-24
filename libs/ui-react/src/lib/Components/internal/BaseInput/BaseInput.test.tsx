import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import type { ChangeEvent, ComponentProps } from 'react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { BaseInput } from './BaseInput';

const createProps = (
  overrides: Partial<ComponentProps<typeof BaseInput>> = {},
): ComponentProps<typeof BaseInput> => ({
  onChange: vi.fn(),
  ...overrides,
});

const CLEAR_LABEL = 'components.baseInput.clearInputAriaLabel';

/** Mirrors how a consumer drives BaseInput as a fully controlled input. */
const ControlledBaseInput = ({
  initialValue,
  onChange,
}: {
  initialValue: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) => {
  const [value, setValue] = useState(initialValue);

  return (
    <BaseInput
      label='Wallet address'
      value={value}
      onChange={(event) => {
        setValue(event.target.value);
        onChange(event);
      }}
    />
  );
};

describe('BaseInput', () => {
  it('shows neutral helper text without invalid or alert semantics', () => {
    render(
      <BaseInput
        id='wallet-address'
        label='Wallet address'
        helperText='Enter your ETH address'
        {...createProps()}
      />,
    );

    const input = screen.getByRole('textbox');

    expect(input).toHaveAttribute('aria-describedby', 'wallet-address-helper');
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(screen.getByText('Enter your ETH address')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(document.querySelector('svg.text-muted')).toBeInTheDocument();
  });

  it('shows success helper text with icon and keeps the input valid', () => {
    render(
      <BaseInput
        id='recipient'
        label='Recipient'
        helperText='Address verified'
        status='success'
        {...createProps()}
      />,
    );

    const input = screen.getByRole('textbox');

    expect(input).toHaveAttribute('aria-describedby', 'recipient-helper');
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByText('Address verified')).toBeInTheDocument();
    expect(document.querySelector('svg.text-success')).toBeInTheDocument();
  });

  it('derives invalid semantics from error status and styles the label', () => {
    render(
      <BaseInput
        id='email'
        label='Email'
        helperText='Email is required'
        status='error'
        {...createProps()}
      />,
    );

    const input = screen.getByRole('textbox');
    const label = screen.getByText('Email');

    expect(input).toHaveAttribute('aria-describedby', 'email-helper');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(label).toHaveClass('text-error');
    expect(document.querySelector('svg.text-error')).toBeInTheDocument();
  });

  it('lets explicit aria-invalid override the derived error state', () => {
    render(
      <BaseInput
        label='Email'
        helperText='Email is required'
        status='error'
        aria-invalid={false}
        {...createProps()}
      />,
    );

    expect(screen.getByRole('textbox')).toHaveAttribute(
      'aria-invalid',
      'false',
    );
  });

  it('defaults to a single-space placeholder when there is no label and no placeholder prop (placeholder-shown + legacy behavior)', () => {
    render(
      <BaseInput
        id='addr'
        prefix={
          <span className='body-1' aria-hidden={true}>
            To:
          </span>
        }
        {...createProps()}
      />,
    );
    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', ' ');
  });

  it('supports label and placeholder together without using the placeholder-only label position', () => {
    render(
      <BaseInput
        id='username'
        label='Username'
        placeholder='jane.doe'
        {...createProps()}
      />,
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'jane.doe');

    const label = screen.getByText('Username');
    expect(label.className).toContain('peer-placeholder-shown:top-6');
  });

  it('does not add helper semantics when helperText is omitted', () => {
    render(
      <BaseInput
        id='username'
        label='Username'
        status='success'
        {...createProps()}
      />,
    );

    const input = screen.getByRole('textbox');

    expect(input).not.toHaveAttribute('aria-describedby');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(document.querySelector('svg.text-success')).not.toBeInTheDocument();
  });

  it('reaches a controlled consumer through React onChange when cleared', () => {
    const onChange = vi.fn();
    render(<ControlledBaseInput initialValue='0xabc' onChange={onChange} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('0xabc');

    fireEvent.click(screen.getByLabelText(CLEAR_LABEL));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].target.value).toBe('');
    // The consumer's state round-trip is what empties the rendered input.
    expect(input).toHaveValue('');
    expect(screen.queryByLabelText(CLEAR_LABEL)).not.toBeInTheDocument();
  });

  it('forwards the cleared value to onChange when uncontrolled', () => {
    const onChange = vi.fn();
    render(
      <BaseInput
        label='Wallet address'
        defaultValue='0xabc'
        {...createProps({ onChange })}
      />,
    );

    const input = screen.getByRole('textbox');

    fireEvent.click(screen.getByLabelText(CLEAR_LABEL));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].target.value).toBe('');
    expect(input).toHaveValue('');
    expect(screen.queryByLabelText(CLEAR_LABEL)).not.toBeInTheDocument();
  });

  it('keeps a controlled value that the consumer refuses to clear', () => {
    const onChange = vi.fn();
    render(
      <BaseInput
        label='Wallet address'
        value='0xabc'
        {...createProps({ onChange })}
      />,
    );

    fireEvent.click(screen.getByLabelText(CLEAR_LABEL));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('textbox')).toHaveValue('0xabc');
  });
});

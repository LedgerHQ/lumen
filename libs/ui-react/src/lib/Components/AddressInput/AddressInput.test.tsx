import { render, screen, fireEvent } from '@testing-library/react';
import { expect, describe, it, vi } from 'vitest';
import '@testing-library/jest-dom';

import { AddressInput } from './AddressInput';

describe('AddressInput', () => {
  it('uses default prefix when none provided', () => {
    render(<AddressInput placeholder='Enter address or ENS' />);

    // Should use default "To:" prefix
    const defaultPrefix = screen.getByText('To:');
    expect(defaultPrefix).toBeInTheDocument();
  });
  it('renders with default "To:" prefix label', () => {
    render(<AddressInput placeholder='Enter address or ENS' />);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();

    // Check that the "To:" prefix is present
    const prefixLabel = screen.getByText('To:');
    expect(prefixLabel).toBeInTheDocument();
  });

  it('renders with custom prefix when provided', () => {
    render(<AddressInput prefix='From:' placeholder='Enter address or ENS' />);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();

    // Check that the custom prefix is present
    const prefixLabel = screen.getByText('From:');
    expect(prefixLabel).toBeInTheDocument();

    // Check that the default "To:" prefix is not present
    const defaultPrefix = screen.queryByText('To:');
    expect(defaultPrefix).not.toBeInTheDocument();
  });

  it('renders with empty prefix when provided', () => {
    render(<AddressInput prefix='' placeholder='Enter address or ENS' />);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();

    // Check that no prefix text is rendered (empty span should still exist for consistency)
    const defaultPrefix = screen.queryByText('To:');
    expect(defaultPrefix).not.toBeInTheDocument();
  });

  it('renders with QR code icon when onQrCodeClick is provided', () => {
    const { container } = render(
      <AddressInput
        placeholder='Enter address or ENS'
        onQrCodeClick={() => {
          console.log('QR code clicked');
        }}
      />,
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();

    // Check that the QR code button is present
    const qrButton = screen.getByLabelText(
      'components.addressInput.qrCodeAriaLabel',
    );
    expect(qrButton).toBeInTheDocument();

    // Check that the QR code icon is present (it should be in the DOM as an SVG)
    const qrIcon = container.querySelector('svg');
    expect(qrIcon).toBeInTheDocument();
  });

  it('does not render QR code icon when onQrCodeClick is not provided', () => {
    const { container } = render(
      <AddressInput placeholder='Enter address or ENS' />,
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();

    // Check that the QR code button is NOT present
    const qrButton = screen.queryByLabelText(
      'components.addressInput.qrCodeAriaLabel',
    );
    expect(qrButton).not.toBeInTheDocument();

    // Check that no SVG icon is present
    const qrIcon = container.querySelector('svg');
    expect(qrIcon).not.toBeInTheDocument();
  });

  it('displays placeholder correctly', () => {
    render(<AddressInput placeholder='Enter address or ENS' />);

    const input = screen.getByPlaceholderText('Enter address or ENS');
    expect(input).toBeInTheDocument();
  });

  it('handles controlled input', () => {
    const handleChange = vi.fn();
    render(
      <AddressInput
        placeholder='Enter address or ENS'
        value='0x742d35cc6234567c3c3c2f308bcfb8d6e80f3434'
        onChange={handleChange}
      />,
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('0x742d35cc6234567c3c3c2f308bcfb8d6e80f3434');

    fireEvent.change(input, { target: { value: '0x123456789abcdef' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('shows clear button when input has content', () => {
    render(
      <AddressInput
        placeholder='Enter address or ENS'
        defaultValue='0x123456789'
      />,
    );

    const clearButton = screen.getByLabelText(
      'components.baseInput.clearInputAriaLabel',
    );
    expect(clearButton).toBeInTheDocument();
  });

  it('shows clear button when input has content (no QR code when no handler)', () => {
    render(
      <AddressInput
        placeholder='Enter address or ENS'
        defaultValue='0x742d35cc6234567c3c3c2f308bcfb8d6e80f3434'
      />,
    );

    // When there's content, the clear button should be visible
    const clearButton = screen.getByLabelText(
      'components.baseInput.clearInputAriaLabel',
    );
    expect(clearButton).toBeInTheDocument();

    // QR button should not be visible (no onQrCodeClick provided)
    const qrButton = screen.queryByLabelText(
      'components.addressInput.qrCodeAriaLabel',
    );
    expect(qrButton).not.toBeInTheDocument();
  });

  it('hides clear button when hideClearButton is true', () => {
    render(
      <AddressInput
        placeholder='Enter address or ENS'
        defaultValue='0x742d35cc6234567c3c3c2f308bcfb8d6e80f3434'
        hideClearButton={true}
      />,
    );

    const clearButton = screen.queryByLabelText(
      'components.baseInput.clearInputAriaLabel',
    );
    expect(clearButton).not.toBeInTheDocument();
  });

  it('clears input when clear button is clicked', () => {
    const handleClear = vi.fn();
    render(
      <AddressInput
        placeholder='Enter address or ENS'
        defaultValue='0x742d35cc6234567c3c3c2f308bcfb8d6e80f3434'
        onClear={handleClear}
      />,
    );

    const clearButton = screen.getByLabelText(
      'components.baseInput.clearInputAriaLabel',
    );
    fireEvent.click(clearButton);

    expect(handleClear).toHaveBeenCalled();
  });

  it('displays helper text when provided with error status', () => {
    render(
      <AddressInput
        placeholder='Enter address or ENS'
        helperText='Invalid address format'
        status='error'
      />,
    );

    const helperTextEl = screen.getByText('Invalid address format');
    expect(helperTextEl).toBeInTheDocument();

    // The role="alert" is on the error container, not the text span
    const errorContainer = screen.getByRole('alert');
    expect(errorContainer).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(<AddressInput placeholder='Enter address or ENS' disabled />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('supports custom suffix', () => {
    const customSuffix = <span data-testid='custom-suffix'>Custom</span>;
    render(
      <AddressInput placeholder='Enter address or ENS' suffix={customSuffix} />,
    );

    const customElement = screen.getByTestId('custom-suffix');
    expect(customElement).toBeInTheDocument();
  });

  it('handles uncontrolled input changes', () => {
    const handleChange = vi.fn();
    render(
      <AddressInput
        placeholder='Enter address or ENS'
        onChange={handleChange}
      />,
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '0x123456789' } });

    expect(handleChange).toHaveBeenCalled();
  });

  it('handles QR code click when provided', () => {
    const handleQrClick = vi.fn();
    render(
      <AddressInput
        placeholder='Enter address or ENS'
        onQrCodeClick={handleQrClick}
      />,
    );

    const qrButton = screen.getByLabelText(
      'components.addressInput.qrCodeAriaLabel',
    );
    fireEvent.click(qrButton);

    expect(handleQrClick).toHaveBeenCalled();
  });

  it('enables QR code button when onQrCodeClick handler is provided', () => {
    const handleQrClick = vi.fn();
    render(
      <AddressInput
        placeholder='Enter address or ENS'
        onQrCodeClick={handleQrClick}
      />,
    );

    const qrButton = screen.getByLabelText(
      'components.addressInput.qrCodeAriaLabel',
    );
    expect(qrButton).toBeInTheDocument();
    expect(qrButton).not.toBeDisabled();
  });

  it('hides QR code button when input has content (shows clear button instead)', () => {
    const handleQrClick = vi.fn();
    render(
      <AddressInput
        placeholder='Enter address or ENS'
        defaultValue='0x742d35cc6234567c3c3c2f308bcfb8d6e80f3434'
        onQrCodeClick={handleQrClick}
      />,
    );

    // When there's content, the QR code button should be hidden
    const qrButton = screen.queryByLabelText(
      'components.addressInput.qrCodeAriaLabel',
    );
    expect(qrButton).not.toBeInTheDocument();

    // And the clear button should be visible instead
    const clearButton = screen.getByLabelText(
      'components.baseInput.clearInputAriaLabel',
    );
    expect(clearButton).toBeInTheDocument();
  });

  it('works with custom prefix and other features', () => {
    const handleQrClick = vi.fn();
    const handleChange = vi.fn();
    render(
      <AddressInput
        prefix='Send to:'
        placeholder='Enter destination address'
        onQrCodeClick={handleQrClick}
        onChange={handleChange}
      />,
    );

    // Check custom prefix
    const prefixLabel = screen.getByText('Send to:');
    expect(prefixLabel).toBeInTheDocument();

    // Check input functionality
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Enter destination address');

    // Check QR code button
    const qrButton = screen.getByLabelText(
      'components.addressInput.qrCodeAriaLabel',
    );
    expect(qrButton).toBeInTheDocument();
    expect(qrButton).not.toBeDisabled();

    // Test interactions
    fireEvent.click(qrButton);
    expect(handleQrClick).toHaveBeenCalled();

    fireEvent.change(input, { target: { value: '0x123' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('conditionally shows QR code based on onQrCodeClick prop', () => {
    const { rerender } = render(
      <AddressInput placeholder='Enter address or ENS' />,
    );

    // Without onQrCodeClick, no QR code button
    let qrButton = screen.queryByLabelText(
      'components.addressInput.qrCodeAriaLabel',
    );
    expect(qrButton).not.toBeInTheDocument();

    // With onQrCodeClick, QR code button appears
    rerender(
      <AddressInput
        placeholder='Enter address or ENS'
        onQrCodeClick={() => {
          console.log('QR code clicked');
        }}
      />,
    );

    qrButton = screen.getByLabelText('components.addressInput.qrCodeAriaLabel');
    expect(qrButton).toBeInTheDocument();
  });
});

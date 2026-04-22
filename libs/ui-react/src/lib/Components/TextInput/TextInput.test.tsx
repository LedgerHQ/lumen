import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

import { TextInput } from './TextInput';

// Helper function to create controlled input props
const createControlledProps = (overrides = {}) => ({
  value: '',
  onChange: () => {
    console.log('onChange');
  },
  ...overrides,
});

describe('Input Component', () => {
  it('should render correctly with floating label', () => {
    render(<TextInput label='Username' {...createControlledProps()} />);
    const inputElement = screen.getByRole('textbox');
    const labelElement = screen.getByText('Username');
    expect(inputElement).toBeInTheDocument();
    expect(labelElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('placeholder', ' ');
  });

  it('should render with error state when aria-invalid is true', () => {
    render(
      <TextInput
        label='Email'
        {...createControlledProps()}
        aria-invalid={true}
      />,
    );
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toHaveAttribute('aria-invalid', 'true');
  });

  it('should be disabled when disabled prop is true', () => {
    render(
      <TextInput label='Username' {...createControlledProps()} disabled />,
    );
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toBeDisabled();
  });

  it('should handle onChange events', () => {
    const handleChange = vi.fn();
    render(
      <TextInput
        label='Username'
        {...createControlledProps({ onChange: handleChange })}
      />,
    );
    const inputElement = screen.getByRole('textbox');

    fireEvent.change(inputElement, { target: { value: 'test' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('should render with different input types', () => {
    render(
      <TextInput
        label='Password'
        type='password'
        {...createControlledProps()}
      />,
    );
    const inputElement = screen.getByLabelText('Password');
    expect(inputElement).toHaveAttribute('type', 'password');
  });

  it('should forward ref correctly', () => {
    const ref = { current: null };
    render(
      <TextInput label='Username' {...createControlledProps()} ref={ref} />,
    );
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('should set aria-describedby and show helper text for error status', () => {
    const helperText = 'This field is required';
    render(
      <TextInput
        label='Email'
        id='test-input'
        helperText={helperText}
        status='error'
        {...createControlledProps()}
      />,
    );

    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toHaveAttribute(
      'aria-describedby',
      'test-input-helper',
    );
    expect(inputElement).toHaveAttribute('aria-invalid', 'true');

    const errorElement = screen.getByText(helperText);
    expect(errorElement).toBeInTheDocument();
    expect(errorElement.parentElement).toHaveAttribute(
      'id',
      'test-input-helper',
    );
    expect(errorElement.parentElement).toHaveAttribute('role', 'alert');
  });

  it('should show error helper with icon', () => {
    const helperText = 'This field is required';
    render(
      <TextInput
        label='Email'
        helperText={helperText}
        status='error'
        {...createControlledProps()}
      />,
    );

    const messageElement = screen.getByText(helperText);
    expect(messageElement).toBeInTheDocument();

    const errorIcon = document.querySelector('svg.text-error');
    expect(errorIcon).toBeInTheDocument();
  });

  it('should show neutral helper without alert role', () => {
    const helperText = 'Enter your ETH address';
    render(
      <TextInput
        label='Address'
        id='addr'
        helperText={helperText}
        {...createControlledProps()}
      />,
    );

    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toHaveAttribute('aria-describedby', 'addr-helper');
    expect(screen.getByText(helperText)).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should show success helper with icon', () => {
    const helperText = 'Address verified';
    render(
      <TextInput
        label='Address'
        helperText={helperText}
        status='success'
        {...createControlledProps()}
      />,
    );

    expect(screen.getByText(helperText)).toBeInTheDocument();
    expect(document.querySelector('svg.text-success')).toBeInTheDocument();
  });

  it('should accept all standard HTML input props', () => {
    render(
      <TextInput
        label='Username'
        maxLength={10}
        minLength={3}
        required
        autoComplete='username'
        {...createControlledProps()}
      />,
    );
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toHaveAttribute('maxLength', '10');
    expect(inputElement).toHaveAttribute('minLength', '3');
    expect(inputElement).toHaveAttribute('required');
    expect(inputElement).toHaveAttribute('autoComplete', 'username');
  });

  it('should render label with correct htmlFor attribute when id is provided', () => {
    render(
      <TextInput
        label='Username'
        id='username-input'
        {...createControlledProps()}
      />,
    );
    const labelElement = screen.getByText('Username');
    expect(labelElement).toHaveAttribute('for', 'username-input');
  });

  it('should handle focus and blur events correctly', () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();

    render(
      <TextInput
        label='Username'
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...createControlledProps()}
      />,
    );
    const inputElement = screen.getByRole('textbox');

    fireEvent.focus(inputElement);
    expect(handleFocus).toHaveBeenCalledTimes(1);

    fireEvent.blur(inputElement);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('should show clear button when input has content by default', () => {
    render(
      <TextInput
        label='Username'
        {...createControlledProps({ value: 'test content' })}
      />,
    );
    const clearButton = screen.getByRole('button', {
      name: /components.baseInput.clearInputAriaLabel/i,
    });
    expect(clearButton).toBeInTheDocument();
  });

  it('should not show clear button when input is empty', () => {
    render(<TextInput label='Username' {...createControlledProps()} />);
    const clearButton = screen.queryByRole('button', {
      name: /components.baseInput.clearInputAriaLabel/i,
    });
    expect(clearButton).not.toBeInTheDocument();
  });

  it('should not show clear button when input is disabled', () => {
    render(
      <TextInput
        label='Username'
        {...createControlledProps({ value: 'test content' })}
        disabled
      />,
    );
    const clearButton = screen.queryByRole('button', {
      name: /components.baseInput.clearInputAriaLabel/i,
    });
    expect(clearButton).not.toBeInTheDocument();
  });

  it('should call onClear after default clearing when clear button is clicked', () => {
    const handleClear = vi.fn();
    const handleChange = vi.fn();
    render(
      <TextInput
        label='Username'
        {...createControlledProps({
          value: 'test content',
          onChange: handleChange,
        })}
        onClear={handleClear}
      />,
    );

    const clearButton = screen.getByRole('button', {
      name: /components.baseInput.clearInputAriaLabel/i,
    });
    fireEvent.click(clearButton);

    // Both default clearing (onChange) and custom onClear should be called
    expect(handleChange).toHaveBeenCalled();
    expect(handleClear).toHaveBeenCalledTimes(1);
  });

  it('should render custom suffix element when provided', () => {
    const CustomElement = () => <div data-testid='custom-element'>Custom</div>;
    render(
      <TextInput
        label='Username'
        {...createControlledProps()}
        suffix={<CustomElement />}
      />,
    );
    expect(screen.getByTestId('custom-element')).toBeInTheDocument();
  });

  it('should hide clear button when hideClearButton is true', () => {
    render(
      <TextInput
        label='Username'
        {...createControlledProps({ value: 'test content' })}
        hideClearButton={true}
      />,
    );
    const clearButton = screen.queryByRole('button', {
      name: /components.baseInput.clearInputAriaLabel/i,
    });
    expect(clearButton).not.toBeInTheDocument();
  });

  it('should components.baseInput.clearInputAriaLabel with default behavior when no onClear provided', () => {
    const handleChange = vi.fn();
    render(
      <TextInput
        label='Username'
        {...createControlledProps({
          value: 'test content',
          onChange: handleChange,
        })}
      />,
    );

    const clearButton = screen.getByRole('button', {
      name: /components.baseInput.clearInputAriaLabel/i,
    });
    fireEvent.click(clearButton);

    // Default clearing should trigger onChange with empty value
    expect(handleChange).toHaveBeenCalled();
  });

  it('should apply className to container element', () => {
    render(
      <TextInput
        label='Username'
        className='min-w-full'
        {...createControlledProps()}
      />,
    );
    const inputElement = screen.getByRole('textbox');
    const containerElement = inputElement.closest('[class*="min-w-full"]');
    expect(containerElement).toBeInTheDocument();
  });

  it('should hide suffix when clear button is shown', () => {
    const CustomElement = () => <div data-testid='custom-suffix'>Suffix</div>;
    render(
      <TextInput
        label='Username'
        {...createControlledProps({ value: 'test content' })}
        suffix={<CustomElement />}
      />,
    );

    // Suffix should be hidden when clear button is present
    expect(screen.queryByTestId('custom-suffix')).not.toBeInTheDocument();

    // Clear button should be visible
    const clearButton = screen.getByRole('button', {
      name: /components.baseInput.clearInputAriaLabel/i,
    });
    expect(clearButton).toBeInTheDocument();
  });

  it('should focus input after clearing', () => {
    const handleChange = vi.fn();
    render(
      <TextInput
        label='Username'
        {...createControlledProps({
          value: 'test content',
          onChange: handleChange,
        })}
      />,
    );

    const inputElement = screen.getByRole('textbox');
    const clearButton = screen.getByRole('button', {
      name: /components.baseInput.clearInputAriaLabel/i,
    });

    // Clear the input
    fireEvent.click(clearButton);

    // Input should be focused after clearing
    expect(inputElement).toHaveFocus();
  });
});

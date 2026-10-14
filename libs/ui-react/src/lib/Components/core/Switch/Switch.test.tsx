import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { Switch } from './Switch';

describe('Switch Component', () => {
  it('should render correctly in default state', () => {
    render(<Switch />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeInTheDocument();
    expect(switchElement).not.toBeChecked();
  });

  it('should render with default selected state when defaultSelected is true', () => {
    render(<Switch defaultSelected />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeChecked();
  });

  it('should render with controlled selected state', () => {
    const { rerender } = render(<Switch selected={false} />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).not.toBeChecked();

    rerender(<Switch selected={true} />);
    expect(switchElement).toBeChecked();
  });

  it('should be disabled when the disabled prop is true', () => {
    render(<Switch disabled />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeDisabled();
    expect(switchElement).toHaveAttribute('data-disabled');
  });

  it('should call the onChange handler when clicked', () => {
    const handleSelectedChange = vi.fn();
    render(<Switch onChange={handleSelectedChange} />);

    const switchElement = screen.getByRole('switch');
    fireEvent.click(switchElement);

    expect(handleSelectedChange).toHaveBeenCalledTimes(1);
    expect(handleSelectedChange).toHaveBeenCalledWith(true);
  });

  it('should call onChange with false when toggling from selected state', () => {
    const handleSelectedChange = vi.fn();
    render(<Switch selected={true} onChange={handleSelectedChange} />);

    const switchElement = screen.getByRole('switch');
    fireEvent.click(switchElement);

    expect(handleSelectedChange).toHaveBeenCalledTimes(1);
    expect(handleSelectedChange).toHaveBeenCalledWith(false);
  });

  it('should not call the onChange handler when disabled', async () => {
    const handleSelectedChange = vi.fn();
    render(<Switch onChange={handleSelectedChange} disabled />);

    const switchElement = screen.getByRole('switch');
    await userEvent.click(switchElement);

    expect(handleSelectedChange).not.toHaveBeenCalled();
  });

  it('should apply custom className', () => {
    render(<Switch className='mt-2' />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement.parentElement).toHaveClass('mt-2');
  });

  it('should forward ref correctly', () => {
    const ref = vi.fn();
    render(<Switch ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it('should have correct accessibility attributes', () => {
    render(<Switch />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAttribute('type', 'checkbox');
    expect(switchElement).toHaveAttribute('role', 'switch');
  });

  it('should be focusable and have keyboard accessibility', () => {
    render(<Switch />);
    const switchElement = screen.getByRole('switch');

    // Test that the element is focusable
    switchElement.focus();
    expect(document.activeElement).toBe(switchElement);

    // Test that it has the right tabIndex (should be 0 or undefined for focusable elements)
    expect(switchElement.tabIndex).toBeGreaterThanOrEqual(0);
  });

  it('should handle uncontrolled usage correctly', () => {
    const handleSelectedChange = vi.fn();
    render(<Switch onChange={handleSelectedChange} />);

    const switchElement = screen.getByRole('switch');

    // Initial state should be false
    expect(switchElement).not.toBeChecked();

    // Click to switch
    fireEvent.click(switchElement);
    expect(handleSelectedChange).toHaveBeenCalledWith(true);

    // Component should update its internal state
    expect(switchElement).toBeChecked();
  });

  it('should support additional HTML attributes', () => {
    render(<Switch id='test-switch' data-testid='switch-component' />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAttribute('id', 'test-switch');
    expect(switchElement).toHaveAttribute('data-testid', 'switch-component');
  });

  it('should submit its value with the form only when selected', () => {
    render(
      <form data-testid='form'>
        <Switch name='on' defaultSelected />
        <Switch name='off' value='yes' />
        <Switch name='disabled' defaultSelected disabled />
      </form>,
    );
    const data = new FormData(screen.getByTestId('form') as HTMLFormElement);
    expect(data.get('on')).toBe('on');
    expect(data.has('off')).toBe(false);
    expect(data.has('disabled')).toBe(false);
  });

  describe('Form integration', () => {
    it('should call onBlur when focus leaves the switch', async () => {
      const handleBlur = vi.fn();
      render(<Switch onBlur={handleBlur} />);

      await userEvent.tab();
      expect(screen.getByRole('switch')).toHaveFocus();
      await userEvent.tab();

      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('should fail form validation when required and not selected', async () => {
      render(
        <form data-testid='form'>
          <Switch name='terms' required />
        </form>,
      );
      const form = screen.getByTestId('form') as HTMLFormElement;
      expect(form.checkValidity()).toBe(false);

      await userEvent.click(screen.getByRole('switch'));
      expect(form.checkValidity()).toBe(true);
    });

    it('should not submit a required form until selected', async () => {
      const handleSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
      render(
        <form onSubmit={handleSubmit}>
          <Switch name='terms' required />
          <button type='submit'>Submit</button>
        </form>,
      );

      await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
      expect(handleSubmit).not.toHaveBeenCalled();

      await userEvent.click(screen.getByRole('switch'));
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    it('should call onChange with the restored value on form reset', async () => {
      const handleChange = vi.fn();
      render(
        <form data-testid='form'>
          <Switch onChange={handleChange} />
        </form>,
      );
      await userEvent.click(screen.getByRole('switch'));
      handleChange.mockClear();

      (screen.getByTestId('form') as HTMLFormElement).reset();

      await waitFor(() => expect(handleChange).toHaveBeenCalledWith(false));
    });

    it('should restore the default state on form reset', async () => {
      render(
        <form data-testid='form'>
          <Switch name='off' />
          <Switch name='on' defaultSelected />
        </form>,
      );
      const [off, on] = screen.getAllByRole('switch');
      await userEvent.click(off);
      await userEvent.click(on);
      expect(off).toBeChecked();
      expect(on).not.toBeChecked();

      (screen.getByTestId('form') as HTMLFormElement).reset();

      await waitFor(() => {
        expect(off).not.toBeChecked();
        expect(on).toBeChecked();
        expect(off).toHaveAttribute('data-state', 'unchecked');
        expect(on).toHaveAttribute('data-state', 'checked');
      });
    });
  });
});

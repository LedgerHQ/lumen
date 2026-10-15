import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

import { Checkbox } from './Checkbox';

describe('Checkbox Component', () => {
  it('should render unchecked by default', () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
    expect(checkbox).toHaveAttribute('data-state', 'unchecked');
  });

  it('should render checked when checked prop is true', () => {
    render(<Checkbox checked />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
    expect(checkbox).toHaveAttribute('data-state', 'checked');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Checkbox disabled />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });

  it('should be required when required prop is true', () => {
    render(<Checkbox required />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeRequired();
  });

  it('should toggle state and call onCheckedChange when clicked', () => {
    const handleChange = vi.fn();
    render(<Checkbox onCheckedChange={handleChange} />);
    const checkbox = screen.getByRole('checkbox');

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(handleChange).toHaveBeenCalledWith(true);

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(handleChange).toHaveBeenCalledWith(false);
  });

  it('should not toggle or call onCheckedChange when disabled', async () => {
    const handleChange = vi.fn();
    render(<Checkbox disabled onCheckedChange={handleChange} />);
    const checkbox = screen.getByRole('checkbox');

    await userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('should apply custom className', () => {
    render(<Checkbox className='my-12' />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox.parentElement).toHaveClass('my-12');
  });

  it('should render checked when defaultChecked is true', () => {
    render(<Checkbox defaultChecked />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('should forward ref correctly', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Checkbox ref={ref} />);
    expect(ref.current).toBe(screen.getByRole('checkbox'));
  });

  it('should support additional HTML attributes', () => {
    render(<Checkbox id='test-checkbox' data-testid='checkbox-component' />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('id', 'test-checkbox');
    expect(checkbox).toHaveAttribute('data-testid', 'checkbox-component');
  });

  it('should submit its value with the form only when checked', () => {
    render(
      <form data-testid='form'>
        <Checkbox name='on' defaultChecked />
        <Checkbox name='off' value='yes' />
        <Checkbox name='disabled' defaultChecked disabled />
      </form>,
    );
    const data = new FormData(screen.getByTestId('form') as HTMLFormElement);
    expect(data.get('on')).toBe('on');
    expect(data.has('off')).toBe(false);
    expect(data.has('disabled')).toBe(false);
  });

  describe('Form integration', () => {
    it('should call onBlur when focus leaves the checkbox', async () => {
      const handleBlur = vi.fn();
      render(<Checkbox onBlur={handleBlur} />);

      await userEvent.tab();
      expect(screen.getByRole('checkbox')).toHaveFocus();
      await userEvent.tab();

      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('should fail form validation when required and not checked', async () => {
      render(
        <form data-testid='form'>
          <Checkbox name='terms' required />
        </form>,
      );
      const form = screen.getByTestId('form') as HTMLFormElement;
      expect(form.checkValidity()).toBe(false);

      await userEvent.click(screen.getByRole('checkbox'));
      expect(form.checkValidity()).toBe(true);
    });

    it('should not submit a required form until checked', async () => {
      const handleSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
      render(
        <form onSubmit={handleSubmit}>
          <Checkbox name='terms' required />
          <button type='submit'>Submit</button>
        </form>,
      );

      await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
      expect(handleSubmit).not.toHaveBeenCalled();

      await userEvent.click(screen.getByRole('checkbox'));
      await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    it('should call onCheckedChange with the restored value on form reset', async () => {
      const handleChange = vi.fn();
      render(
        <form data-testid='form'>
          <Checkbox onCheckedChange={handleChange} />
        </form>,
      );
      await userEvent.click(screen.getByRole('checkbox'));
      handleChange.mockClear();

      (screen.getByTestId('form') as HTMLFormElement).reset();

      await waitFor(() => expect(handleChange).toHaveBeenCalledWith(false));
    });

    it('should restore the default state on form reset', async () => {
      render(
        <form data-testid='form'>
          <Checkbox name='off' />
          <Checkbox name='on' defaultChecked />
        </form>,
      );
      const [off, on] = screen.getAllByRole('checkbox');
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

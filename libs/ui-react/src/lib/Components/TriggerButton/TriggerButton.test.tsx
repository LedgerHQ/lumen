import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

import { Settings } from '../../Symbols';
import { TriggerButton } from './TriggerButton';

describe('TriggerButton', () => {
  it('should render with label text', () => {
    render(<TriggerButton>All accounts</TriggerButton>);
    expect(
      screen.getByRole('button', { name: /all accounts/i }),
    ).toBeInTheDocument();
  });

  it('should always render a chevron icon', () => {
    const { container } = render(<TriggerButton>Label</TriggerButton>);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should render with a flat interface icon', () => {
    const { container } = render(
      <TriggerButton
        icon={<Settings size={20} data-testid='icon' />}
        iconType='flat'
      >
        Network
      </TriggerButton>,
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(container.querySelectorAll('svg').length).toBeGreaterThanOrEqual(2);
  });

  it('should render with a rounded icon', () => {
    render(
      <TriggerButton
        icon={<span data-testid='crypto-icon'>BTC</span>}
        iconType='rounded'
      >
        Bitcoin
      </TriggerButton>,
    );
    expect(screen.getByTestId('crypto-icon')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /bitcoin/i }),
    ).toBeInTheDocument();
  });

  it('should be disabled when the disabled prop is true', () => {
    render(<TriggerButton disabled>Label</TriggerButton>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should call onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<TriggerButton onClick={handleClick}>Label</TriggerButton>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick handler when disabled', () => {
    const handleClick = vi.fn();
    render(
      <TriggerButton onClick={handleClick} disabled>
        Label
      </TriggerButton>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should forward ref to the button element', () => {
    const ref = vi.fn();
    render(<TriggerButton ref={ref}>Label</TriggerButton>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });

  it('should apply custom className', () => {
    render(<TriggerButton className='ml-16'>Label</TriggerButton>);
    expect(screen.getByRole('button')).toHaveClass('ml-16');
  });
});

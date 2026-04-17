import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

import { Settings } from '../../Symbols';
import { MediaButton } from './MediaButton';

describe('MediaButton', () => {
  it('should render with label text', () => {
    render(<MediaButton>All accounts</MediaButton>);
    expect(
      screen.getByRole('button', { name: /all accounts/i }),
    ).toBeInTheDocument();
  });

  it('should always render a chevron icon', () => {
    const { container } = render(<MediaButton>Label</MediaButton>);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should render with a flat interface icon', () => {
    const { container } = render(
      <MediaButton
        icon={<Settings size={20} data-testid='icon' />}
        iconType='flat'
      >
        Network
      </MediaButton>,
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(container.querySelectorAll('svg').length).toBeGreaterThanOrEqual(2);
  });

  it('should render with a rounded icon', () => {
    render(
      <MediaButton
        icon={<span data-testid='crypto-icon'>BTC</span>}
        iconType='rounded'
      >
        Bitcoin
      </MediaButton>,
    );
    expect(screen.getByTestId('crypto-icon')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /bitcoin/i }),
    ).toBeInTheDocument();
  });

  it('should be disabled when the disabled prop is true', () => {
    render(<MediaButton disabled>Label</MediaButton>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should call onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<MediaButton onClick={handleClick}>Label</MediaButton>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick handler when disabled', () => {
    const handleClick = vi.fn();
    render(
      <MediaButton onClick={handleClick} disabled>
        Label
      </MediaButton>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should forward ref to the button element', () => {
    const ref = vi.fn();
    render(<MediaButton ref={ref}>Label</MediaButton>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });

  it('should apply custom className', () => {
    render(<MediaButton className='ml-16'>Label</MediaButton>);
    expect(screen.getByRole('button')).toHaveClass('ml-16');
  });
});

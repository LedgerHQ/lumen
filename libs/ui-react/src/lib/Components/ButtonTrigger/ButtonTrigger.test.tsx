import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

import { Settings } from '../../Symbols';
import { ButtonTrigger } from './ButtonTrigger';

describe('ButtonTrigger', () => {
  it('should render with label text', () => {
    render(<ButtonTrigger>All accounts</ButtonTrigger>);
    expect(
      screen.getByRole('button', { name: /all accounts/i }),
    ).toBeInTheDocument();
  });

  it('should always render a chevron icon', () => {
    const { container } = render(<ButtonTrigger>Label</ButtonTrigger>);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should render with a flat interface icon', () => {
    const { container } = render(
      <ButtonTrigger
        icon={<Settings size={20} data-testid='icon' />}
        iconType='flat'
      >
        Network
      </ButtonTrigger>,
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(container.querySelectorAll('svg').length).toBeGreaterThanOrEqual(2);
  });

  it('should render with a rounded icon', () => {
    render(
      <ButtonTrigger
        icon={<span data-testid='crypto-icon'>BTC</span>}
        iconType='rounded'
      >
        Bitcoin
      </ButtonTrigger>,
    );
    expect(screen.getByTestId('crypto-icon')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /bitcoin/i }),
    ).toBeInTheDocument();
  });

  it('should be disabled when the disabled prop is true', () => {
    render(<ButtonTrigger disabled>Label</ButtonTrigger>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should call onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<ButtonTrigger onClick={handleClick}>Label</ButtonTrigger>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick handler when disabled', () => {
    const handleClick = vi.fn();
    render(
      <ButtonTrigger onClick={handleClick} disabled>
        Label
      </ButtonTrigger>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should forward ref to the button element', () => {
    const ref = vi.fn();
    render(<ButtonTrigger ref={ref}>Label</ButtonTrigger>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });

  it('should apply custom className', () => {
    render(<ButtonTrigger className='ml-16'>Label</ButtonTrigger>);
    expect(screen.getByRole('button')).toHaveClass('ml-16');
  });
});

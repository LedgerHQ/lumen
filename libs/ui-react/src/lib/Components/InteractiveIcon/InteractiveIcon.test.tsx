import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

import { Settings, Plus } from '../../Symbols';
import { InteractiveIcon } from './InteractiveIcon';

describe('InteractiveIcon Component', () => {
  it('should render correctly with icon prop', () => {
    render(
      <InteractiveIcon
        iconType='filled'
        icon={Settings}
        aria-label='Settings'
      />,
    );
    const buttonElement = screen.getByRole('button', { name: /settings/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it('should render with filled iconType variant', () => {
    render(
      <InteractiveIcon iconType='filled' icon={Plus} aria-label='Add item' />,
    );
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toHaveClass('inline-flex');
    expect(buttonElement).toHaveClass('rounded-full');
  });

  it('should render with stroked iconType variant', () => {
    render(
      <InteractiveIcon
        iconType='stroked'
        icon={Settings}
        aria-label='Settings'
      />,
    );
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toHaveClass('bg-base-transparent');
    expect(buttonElement).toHaveClass('hover:bg-base-transparent-hover');
  });

  it('should have correct aria-label for accessibility', () => {
    render(
      <InteractiveIcon
        iconType='filled'
        icon={Settings}
        aria-label='Open menu'
      />,
    );
    const buttonElement = screen.getByRole('button', { name: /open menu/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it('should be disabled when the disabled prop is true', () => {
    render(
      <InteractiveIcon
        iconType='filled'
        icon={Settings}
        aria-label='Disabled button'
        disabled
      />,
    );
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeDisabled();
  });

  it('should call the onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(
      <InteractiveIcon
        iconType='filled'
        icon={Plus}
        aria-label='Clickable'
        onClick={handleClick}
      />,
    );

    const buttonElement = screen.getByRole('button');
    fireEvent.click(buttonElement);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call the onClick handler when disabled', () => {
    const handleClick = vi.fn();
    render(
      <InteractiveIcon
        iconType='filled'
        icon={Settings}
        aria-label='Disabled'
        onClick={handleClick}
        disabled
      />,
    );

    const buttonElement = screen.getByRole('button');
    fireEvent.click(buttonElement);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should apply custom className', () => {
    render(
      <InteractiveIcon
        iconType='filled'
        icon={Settings}
        aria-label='Custom'
        className='mt-2'
      />,
    );
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toHaveClass('mt-2');
  });

  it('should forward ref correctly', () => {
    const ref = vi.fn();
    render(
      <InteractiveIcon
        iconType='stroked'
        icon={Plus}
        aria-label='Ref test'
        ref={ref}
      />,
    );
    expect(ref).toHaveBeenCalled();
  });

  it('should render with custom size', () => {
    render(
      <InteractiveIcon
        iconType='filled'
        icon={Settings}
        size={24}
        aria-label='Custom size'
      />,
    );
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeInTheDocument();
  });
});

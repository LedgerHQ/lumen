import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

import { AvatarButton } from './AvatarButton';

describe('AvatarButton Component', () => {
  const validSrc = 'https://example.com/photo.jpg';

  it('should render a button wrapping the avatar', () => {
    render(<AvatarButton src={validSrc} alt='Open menu' />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('should default to type="button"', () => {
    render(<AvatarButton src={validSrc} />);

    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('should call onClick when clicked', () => {
    const onClick = vi.fn();
    render(<AvatarButton src={validSrc} onClick={onClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should forward props to the underlying Avatar', () => {
    render(<AvatarButton src={validSrc} alt='User profile' />);

    expect(screen.getByRole('img')).toHaveAttribute(
      'aria-label',
      'User profile',
    );
  });

  it('should forward ref to the button element', () => {
    const ref = vi.fn();
    render(<AvatarButton src={validSrc} ref={ref} />);

    expect(ref).toHaveBeenCalled();
  });

  it('should apply custom className to the button', () => {
    render(<AvatarButton src={validSrc} className='mr-8' />);

    expect(screen.getByRole('button')).toHaveClass('mr-8');
  });
});

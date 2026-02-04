import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

import { Avatar } from './Avatar';

describe('Avatar Component', () => {
  const validSrc =
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  it('should render with image when valid src is provided', () => {
    render(<Avatar src={validSrc} />);

    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', validSrc);
  });

  it('should render fallback icon when no src is provided', () => {
    render(<Avatar src='' />);

    const img = screen.queryByRole('img');
    expect(img).not.toBeInTheDocument();

    const { container } = render(<Avatar src='' />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should render fallback icon when image fails to load', () => {
    const { container } = render(
      <Avatar src='https://broken-link.com/404.jpg' />,
    );

    const img = screen.getByRole('img');

    fireEvent.error(img);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should render with md size by default', () => {
    const { container } = render(<Avatar src={validSrc} />);

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('size-48');
  });

  it('should render with sm size when specified', () => {
    const { container } = render(<Avatar src={validSrc} size='sm' />);

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('size-40');
  });

  it('should not show notification indicator by default', () => {
    const { container } = render(<Avatar src={validSrc} />);

    const notificationDot = container.querySelector('.bg-error-strong');
    expect(notificationDot).not.toBeInTheDocument();
  });

  it('should show notification indicator when showNotification is true', () => {
    const { container } = render(<Avatar src={validSrc} showNotification />);

    const notificationDot = container.querySelector('.bg-error-strong');
    expect(notificationDot).toBeInTheDocument();
  });

  it('should use default alt text when not provided', () => {
    render(<Avatar src={validSrc} />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', 'avatar');
  });

  it('should use custom alt text when provided', () => {
    render(<Avatar src={validSrc} alt='User profile picture' />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', 'User profile picture');
  });

  it('should apply custom className', () => {
    const { container } = render(<Avatar src={validSrc} className='mt-16' />);

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('mt-16');
  });

  it('should forward ref correctly', () => {
    const ref = vi.fn();
    render(<Avatar src={validSrc} ref={ref} />);

    expect(ref).toHaveBeenCalled();
  });

  it('should pass additional HTML attributes', () => {
    render(<Avatar src={validSrc} data-testid='avatar' id='user-avatar' />);

    const wrapper = screen.getByTestId('avatar');
    expect(wrapper).toHaveAttribute('id', 'user-avatar');
  });

  it('should render correct fallback icon size for sm', () => {
    const { container } = render(<Avatar src='' size='sm' />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('icon-w-24');
    expect(svg).toHaveClass('icon-h-24');
  });

  it('should render correct fallback icon size for md', () => {
    const { container } = render(<Avatar src='' size='md' />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('icon-w-32');
    expect(svg).toHaveClass('icon-h-32');
  });
});

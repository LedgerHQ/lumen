import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

import { Button } from '../Button';
import { Banner } from './Banner';

describe('Banner Component', () => {
  it('should render correctly with minimal props', () => {
    render(<Banner title='Basic Banner' />);
    const bannerElement = screen.getByText('Basic Banner');
    expect(bannerElement).toBeInTheDocument();
  });

  it('should render with title and description', () => {
    render(
      <Banner title='Banner Title' description='Banner description text' />,
    );

    expect(screen.getByText('Banner Title')).toBeInTheDocument();
    expect(screen.getByText('Banner description text')).toBeInTheDocument();
  });

  it('should render with different appearances', () => {
    const { container, rerender } = render(
      <Banner title='Info Banner' appearance='info' />,
    );
    expect(container.firstChild).toHaveClass('bg-surface');

    rerender(<Banner title='Success Banner' appearance='success' />);
    expect(container.firstChild).toHaveClass('bg-success');

    rerender(<Banner title='Warning Banner' appearance='warning' />);
    expect(container.firstChild).toHaveClass('bg-warning');

    rerender(<Banner title='Error Banner' appearance='error' />);
    expect(container.firstChild).toHaveClass('bg-error');
  });

  it('should render primary action button', () => {
    const handlePrimary = vi.fn();
    render(
      <Banner
        title='Banner with Primary'
        primaryAction={
          <Button appearance='transparent' size='sm' onClick={handlePrimary}>
            Primary
          </Button>
        }
      />,
    );

    const primaryButton = screen.getByRole('button', { name: /primary/i });
    expect(primaryButton).toBeInTheDocument();
    fireEvent.click(primaryButton);
    expect(handlePrimary).toHaveBeenCalledTimes(1);
  });

  it('should render secondary action button', () => {
    const handleSecondary = vi.fn();
    render(
      <Banner
        title='Banner with Secondary'
        secondaryAction={
          <Button
            appearance='no-background'
            size='sm'
            onClick={handleSecondary}
          >
            Secondary
          </Button>
        }
      />,
    );

    const secondaryButton = screen.getByRole('button', { name: /secondary/i });
    expect(secondaryButton).toBeInTheDocument();
    fireEvent.click(secondaryButton);
    expect(handleSecondary).toHaveBeenCalledTimes(1);
  });

  it('should render both action buttons', () => {
    const handlePrimary = vi.fn();
    const handleSecondary = vi.fn();
    render(
      <Banner
        title='Banner with Both Actions'
        primaryAction={
          <Button appearance='transparent' size='sm' onClick={handlePrimary}>
            Primary
          </Button>
        }
        secondaryAction={
          <Button
            appearance='no-background'
            size='sm'
            onClick={handleSecondary}
          >
            Secondary
          </Button>
        }
      />,
    );

    expect(
      screen.getByRole('button', { name: /primary/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /secondary/i }),
    ).toBeInTheDocument();
  });

  it('should render close button and handle click', () => {
    const handleClose = vi.fn();
    render(<Banner title='Closable Banner' onClose={handleClose} />);

    const closeButton = screen.getByRole('button'); // assuming it's the only button
    expect(closeButton).toBeInTheDocument();
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should apply custom className', () => {
    const { container } = render(
      <Banner title='Custom Banner' className='mb-16' />,
    );
    expect(container.firstChild).toHaveClass('mb-16');
  });

  it('should handle long title text with line clamping', () => {
    const longTitle =
      'This is a very long title that should be clamped to 2 lines when it exceeds the available space';
    render(<Banner title={longTitle} />);

    const titleElement = screen.getByText(longTitle);
    expect(titleElement).toHaveClass('line-clamp-2');
  });

  it('should handle long description text with line clamping', () => {
    const longDescription =
      'This is a very long description that should be clamped to 5 lines when it exceeds the available space in the banner component';
    render(<Banner title='Title' description={longDescription} />);

    const descriptionElement = screen.getByText(longDescription);
    expect(descriptionElement).toHaveClass('line-clamp-5');
  });

  it('should forward ref correctly', () => {
    const ref = vi.fn();
    render(<Banner title='Ref Test' ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it('should not render close button if onClose is not provided', () => {
    render(<Banner title='Banner' />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should render close button when onClose is provided', () => {
    const handleClose = vi.fn();
    render(<Banner title='Banner' onClose={handleClose} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should apply default aria-label to close button when closeAriaLabel is not provided', () => {
    const handleClose = vi.fn();
    render(<Banner title='Banner' onClose={handleClose} />);
    const closeButton = screen.getByRole('button');
    expect(closeButton).toHaveAttribute(
      'aria-label',
      'components.banner.closeAriaLabel',
    );
  });

  it('should apply custom aria-label to close button when provided', () => {
    const handleClose = vi.fn();
    render(
      <Banner
        title='Banner'
        onClose={handleClose}
        closeAriaLabel='Close notification'
      />,
    );
    const closeButton = screen.getByRole('button');
    expect(closeButton).toHaveAttribute('aria-label', 'Close notification');
  });
});

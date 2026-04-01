import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

import { MediaImage } from './MediaImage';

describe('MediaImage Component', () => {
  const validSrc = 'https://crypto-icons.ledger.com/ADA.png';

  it('should render image when valid src is provided', () => {
    const { container } = render(
      <MediaImage src={validSrc} alt='Cardano' />,
    );

    const root = screen.getByRole('img');
    expect(root).toBeInTheDocument();

    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', validSrc);
  });

  it('should render fallback when no src is provided', () => {
    const { container } = render(<MediaImage alt='Empty' />);

    const img = container.querySelector('img');
    expect(img).not.toBeInTheDocument();

    const fallback = container.querySelector('span[aria-hidden="true"]');
    expect(fallback).toBeInTheDocument();
  });

  it('should render fallback when src is empty string', () => {
    const { container } = render(<MediaImage src='' alt='Empty' />);

    const img = container.querySelector('img');
    expect(img).not.toBeInTheDocument();
  });

  it('should render fallback when image fails to load', () => {
    const { container } = render(
      <MediaImage src='https://broken-link.com/404.png' alt='Broken' />,
    );

    const img = screen.getByAltText('');
    fireEvent.error(img);

    const fallback = container.querySelector('span[aria-hidden="true"]');
    expect(fallback).toBeInTheDocument();
    expect(container.querySelector('img')).not.toBeInTheDocument();
  });

  it('should reset error state when src changes', () => {
    const { container, rerender } = render(
      <MediaImage src='https://broken-link.com/404.png' alt='Test' />,
    );

    const img = screen.getByAltText('');
    fireEvent.error(img);
    expect(container.querySelector('img')).not.toBeInTheDocument();

    rerender(<MediaImage src={validSrc} alt='Test' />);
    expect(container.querySelector('img')).toBeInTheDocument();
  });

  it('should apply default size class (48)', () => {
    const { container } = render(<MediaImage src={validSrc} alt='Test' />);
    expect(container.firstChild).toHaveClass('size-48');
  });

  it('should apply specified size class', () => {
    const { container } = render(
      <MediaImage src={validSrc} alt='Test' size={24} />,
    );
    expect(container.firstChild).toHaveClass('size-24');
  });

  it('should apply circle shape', () => {
    const { container } = render(
      <MediaImage src={validSrc} alt='Test' shape='circle' />,
    );
    expect(container.firstChild).toHaveClass('rounded-full');
  });

  it('should set aria-label from alt prop', () => {
    render(<MediaImage src={validSrc} alt='Cardano icon' />);

    const root = screen.getByRole('img');
    expect(root).toHaveAttribute('aria-label', 'Cardano icon');
  });

  it('should set lazy loading when imgLoading is lazy', () => {
    render(<MediaImage src={validSrc} alt='Test' imgLoading='lazy' />);

    const img = screen.getByAltText('');
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  it('should apply custom className', () => {
    const { container } = render(
      <MediaImage src={validSrc} alt='Test' className='mt-16' />,
    );
    expect(container.firstChild).toHaveClass('mt-16');
  });

  it('should forward ref correctly', () => {
    const ref = vi.fn();
    render(<MediaImage src={validSrc} alt='Test' ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it('should pass additional HTML attributes', () => {
    render(
      <MediaImage src={validSrc} alt='Test' data-testid='media' id='mi' />,
    );

    const el = screen.getByTestId('media');
    expect(el).toHaveAttribute('id', 'mi');
  });
});

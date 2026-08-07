import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

import { MediaImage } from './MediaImage';

describe('MediaImage Component', () => {
  const validSrc = 'https://crypto-icons.ledger.com/ADA.png';

  it('should render image when valid src is provided', () => {
    const { container } = render(<MediaImage src={validSrc} alt='Cardano' />);

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

  it('should render single-letter fallback (uppercased) when fallback is provided and src is missing', () => {
    const { container } = render(<MediaImage fallback='bitcoin' alt='BTC' />);

    expect(container.querySelector('img')).not.toBeInTheDocument();

    const fallback = screen.getByText('B');
    expect(fallback).toBeInTheDocument();
    expect(fallback).toHaveAttribute('aria-hidden', 'true');
  });

  it('should render single-letter fallback when fallback is provided and src is empty string', () => {
    render(<MediaImage src='' fallback='ethereum' alt='ETH' />);

    expect(screen.getByText('E')).toBeInTheDocument();
  });

  it('should size the fallback letter according to the size prop', () => {
    render(<MediaImage fallback='cardano' alt='ADA' size={32} />);

    const fallback = screen.getByText('C');
    expect(fallback).toHaveStyle({ fontSize: '16px' });
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

  it('should render single-letter fallback when image fails to load and fallback is provided', () => {
    const { container } = render(
      <MediaImage
        src='https://broken-link.com/404.png'
        fallback='solana'
        alt='SOL'
      />,
    );

    const img = screen.getByAltText('');
    fireEvent.error(img);

    expect(container.querySelector('img')).not.toBeInTheDocument();
    expect(screen.getByText('S')).toBeInTheDocument();
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

  describe('loading state', () => {
    it('should render the skeleton overlay when loading is true', () => {
      render(<MediaImage src={validSrc} alt='Test' loading />);

      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    });

    it('should hide the image when loading is true even if src is valid', () => {
      const { container } = render(
        <MediaImage src={validSrc} alt='Test' loading />,
      );

      expect(container.querySelector('img')).not.toBeInTheDocument();
    });

    it('should hide the fallback letter when loading is true', () => {
      render(<MediaImage fallback='bitcoin' alt='BTC' loading />);

      expect(screen.queryByText('B')).not.toBeInTheDocument();
      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    });

    it('should hide the empty fallback placeholder when loading is true', () => {
      const { container } = render(<MediaImage alt='Empty' loading />);

      expect(container.querySelector('span[aria-hidden="true"]')).toBeNull();
      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    });

    it('should not render the skeleton when loading is false (default)', () => {
      render(<MediaImage src={validSrc} alt='Test' />);

      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
    });
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

import {
  MediaBanner,
  MediaBannerTitle,
  MediaBannerDescription,
} from './MediaBanner';

const IMAGE_URL = 'https://example.com/image.jpg';

describe('MediaBanner', () => {
  it('should render title and description', () => {
    render(
      <MediaBanner imageUrl={IMAGE_URL}>
        <MediaBannerTitle>Banner Title</MediaBannerTitle>
        <MediaBannerDescription>Banner description</MediaBannerDescription>
      </MediaBanner>,
    );

    expect(screen.getByText('Banner Title')).toBeInTheDocument();
    expect(screen.getByText('Banner description')).toBeInTheDocument();
  });

  it('should render close button when onClose is provided', () => {
    const handleClose = vi.fn();
    render(
      <MediaBanner imageUrl={IMAGE_URL} onClose={handleClose}>
        <MediaBannerTitle>Title</MediaBannerTitle>
      </MediaBanner>,
    );

    const closeButton = screen.getByRole('button');
    expect(closeButton).toBeInTheDocument();
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should not render close button when onClose is not provided', () => {
    render(
      <MediaBanner imageUrl={IMAGE_URL}>
        <MediaBannerTitle>Title</MediaBannerTitle>
      </MediaBanner>,
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <MediaBanner imageUrl={IMAGE_URL} className='mb-16'>
        <MediaBannerTitle>Title</MediaBannerTitle>
      </MediaBanner>,
    );

    expect(container.firstChild).toHaveClass('mb-16');
  });

  it('should render the image', () => {
    render(
      <MediaBanner imageUrl={IMAGE_URL}>
        <MediaBannerTitle>Title</MediaBannerTitle>
      </MediaBanner>,
    );

    const img = screen.getByRole('presentation', { hidden: true });
    expect(img).toHaveAttribute('src', IMAGE_URL);
  });

  it('should forward ref', () => {
    const ref = vi.fn();
    render(
      <MediaBanner ref={ref} imageUrl={IMAGE_URL}>
        <MediaBannerTitle>Title</MediaBannerTitle>
      </MediaBanner>,
    );

    expect(ref).toHaveBeenCalled();
  });
});

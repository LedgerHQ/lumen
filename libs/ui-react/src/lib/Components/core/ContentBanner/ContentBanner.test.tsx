import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

import {
  ContentBanner,
  ContentBannerContent,
  ContentBannerTitle,
  ContentBannerDescription,
} from './ContentBanner';

describe('ContentBanner', () => {
  it('should render children', () => {
    render(
      <ContentBanner>
        <ContentBannerContent>
          <ContentBannerTitle>Title</ContentBannerTitle>
        </ContentBannerContent>
      </ContentBanner>,
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
  });

  it('should render title and description', () => {
    render(
      <ContentBanner>
        <ContentBannerContent>
          <ContentBannerTitle>Banner Title</ContentBannerTitle>
          <ContentBannerDescription>
            Banner description
          </ContentBannerDescription>
        </ContentBannerContent>
      </ContentBanner>,
    );

    expect(screen.getByText('Banner Title')).toBeInTheDocument();
    expect(screen.getByText('Banner description')).toBeInTheDocument();
  });

  it('should render close button when onClose is provided', () => {
    const handleClose = vi.fn();
    render(
      <ContentBanner onClose={handleClose}>
        <ContentBannerContent>
          <ContentBannerTitle>Title</ContentBannerTitle>
        </ContentBannerContent>
      </ContentBanner>,
    );

    const closeButton = screen.getByRole('button');
    expect(closeButton).toBeInTheDocument();
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should not render close button when onClose is not provided', () => {
    render(
      <ContentBanner>
        <ContentBannerContent>
          <ContentBannerTitle>Title</ContentBannerTitle>
        </ContentBannerContent>
      </ContentBanner>,
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should apply custom closeAriaLabel', () => {
    const handleClose = vi.fn();
    render(
      <ContentBanner onClose={handleClose} closeAriaLabel='Dismiss'>
        <ContentBannerContent>
          <ContentBannerTitle>Title</ContentBannerTitle>
        </ContentBannerContent>
      </ContentBanner>,
    );

    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Dismiss');
  });

  it('should apply custom className', () => {
    const { container } = render(
      <ContentBanner className='mb-16'>
        <ContentBannerContent>
          <ContentBannerTitle>Title</ContentBannerTitle>
        </ContentBannerContent>
      </ContentBanner>,
    );

    expect(container.firstChild).toHaveClass('mb-16');
  });

  it('should forward ref', () => {
    const ref = vi.fn();
    render(
      <ContentBanner ref={ref}>
        <ContentBannerContent>
          <ContentBannerTitle>Title</ContentBannerTitle>
        </ContentBannerContent>
      </ContentBanner>,
    );

    expect(ref).toHaveBeenCalled();
  });
});

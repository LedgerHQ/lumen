import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

import { MediaCard, MediaCardTitle } from './MediaCard';

const makeProps = () => ({
  imageUrl: '/test.jpg',
  onClick: vi.fn(),
  onClose: vi.fn(),
});

describe('MediaCard', () => {
  it('should render title', () => {
    render(
      <MediaCard {...makeProps()}>
        <MediaCardTitle>Title</MediaCardTitle>
      </MediaCard>,
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
  });

  it('should render leading content and title', () => {
    render(
      <MediaCard {...makeProps()}>
        <span>Tag</span>
        <MediaCardTitle>Title</MediaCardTitle>
      </MediaCard>,
    );

    expect(screen.getByText('Tag')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
  });

  it('should fire onClick on click', () => {
    const props = makeProps();
    const { container } = render(
      <MediaCard {...props}>
        <MediaCardTitle>Title</MediaCardTitle>
      </MediaCard>,
    );

    fireEvent.click(container.firstChild as HTMLElement);
    expect(props.onClick).toHaveBeenCalledTimes(1);
  });

  it('should fire onClose without triggering onClick', () => {
    const props = makeProps();
    render(
      <MediaCard {...props}>
        <MediaCardTitle>Title</MediaCardTitle>
      </MediaCard>,
    );

    const closeButton = screen.getByLabelText(/close/i);
    fireEvent.click(closeButton);
    expect(props.onClose).toHaveBeenCalledTimes(1);
    expect(props.onClick).not.toHaveBeenCalled();
  });

  it('should hide image on error by applying opacity-0', () => {
    const { container } = render(
      <MediaCard {...makeProps()}>
        <MediaCardTitle>Title</MediaCardTitle>
      </MediaCard>,
    );

    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    fireEvent.error(img as HTMLImageElement);

    expect(img).toHaveClass('opacity-0');
  });

  it('should show image after successful load', () => {
    const { container } = render(
      <MediaCard {...makeProps()}>
        <MediaCardTitle>Title</MediaCardTitle>
      </MediaCard>,
    );

    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    fireEvent.load(img as HTMLImageElement);

    expect(img).not.toHaveClass('opacity-0');
  });

  it('should apply custom className', () => {
    const { container } = render(
      <MediaCard {...makeProps()} className='w-320'>
        <MediaCardTitle>Title</MediaCardTitle>
      </MediaCard>,
    );

    expect(container.firstChild).toHaveClass('w-320');
  });

  it('should forward ref', () => {
    const ref = vi.fn();
    render(
      <MediaCard {...makeProps()} ref={ref}>
        <MediaCardTitle>Title</MediaCardTitle>
      </MediaCard>,
    );

    expect(ref).toHaveBeenCalled();
  });
});

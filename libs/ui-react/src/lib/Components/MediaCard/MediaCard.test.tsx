import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

import { MediaCard } from './MediaCard';

const makeProps = () => ({
  imageUrl: '/test.jpg',
  text: 'Title',
  onClick: vi.fn(),
  onClose: vi.fn(),
});

describe('MediaCard', () => {
  it('should render text', () => {
    render(<MediaCard {...makeProps()} />);

    expect(screen.getByText('Title')).toBeInTheDocument();
  });

  it('should render leading content', () => {
    render(<MediaCard {...makeProps()} leadingContent={<span>Tag</span>} />);

    expect(screen.getByText('Tag')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
  });

  it('should fire onClick on click', () => {
    const props = makeProps();
    const { container } = render(<MediaCard {...props} />);

    fireEvent.click(container.firstChild as HTMLElement);
    expect(props.onClick).toHaveBeenCalledTimes(1);
  });

  it('should fire onClose without triggering onClick', () => {
    const props = makeProps();
    render(<MediaCard {...props} />);

    const closeButton = screen.getByLabelText(/close/i);
    fireEvent.click(closeButton);
    expect(props.onClose).toHaveBeenCalledTimes(1);
    expect(props.onClick).not.toHaveBeenCalled();
  });

  it('should hide image on error and show fallback', () => {
    const { container } = render(<MediaCard {...makeProps()} />);

    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    fireEvent.error(img as HTMLImageElement);

    expect(img).toHaveClass('opacity-0');
  });

  it('should show image after successful load', () => {
    const { container } = render(<MediaCard {...makeProps()} />);

    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    fireEvent.load(img as HTMLImageElement);

    expect(img).not.toHaveClass('opacity-0');
  });

  it('should apply custom className', () => {
    const { container } = render(
      <MediaCard {...makeProps()} className='w-320' />,
    );

    expect(container.firstChild).toHaveClass('w-320');
  });

  it('should forward ref', () => {
    const ref = vi.fn();
    render(<MediaCard {...makeProps()} ref={ref} />);

    expect(ref).toHaveBeenCalled();
  });
});

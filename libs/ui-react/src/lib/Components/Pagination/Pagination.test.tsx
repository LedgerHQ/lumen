import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('should render navigation with page buttons', () => {
    render(
      <Pagination
        data-testid='pagination'
        page={2}
        totalPages={5}
        onPageChange={vi.fn()}
      />,
    );

    expect(screen.getByTestId('pagination')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should mark the active page with aria-current', () => {
    render(<Pagination page={2} totalPages={5} onPageChange={vi.fn()} />);

    const activePage = screen.getByRole('button', { current: 'page' });

    expect(activePage).toHaveTextContent('2');
  });

  it('should disable previous on the first page', () => {
    render(<Pagination page={1} totalPages={5} onPageChange={vi.fn()} />);

    expect(
      screen.getByRole('button', {
        name: 'components.pagination.previousPageAriaLabel',
      }),
    ).toBeDisabled();
  });

  it('should disable next on the last page', () => {
    render(<Pagination page={5} totalPages={5} onPageChange={vi.fn()} />);

    expect(
      screen.getByRole('button', {
        name: 'components.pagination.nextPageAriaLabel',
      }),
    ).toBeDisabled();
  });

  it('should call onPageChange when a page is selected', () => {
    const onPageChange = vi.fn();

    render(<Pagination page={1} totalPages={5} onPageChange={onPageChange} />);

    const pageThreeButton = screen.getByText('3').closest('button');

    expect(pageThreeButton).not.toBeNull();
    fireEvent.click(pageThreeButton!);

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('should call onPageChange when next is clicked', () => {
    const onPageChange = vi.fn();

    render(<Pagination page={2} totalPages={5} onPageChange={onPageChange} />);

    fireEvent.click(
      screen.getByRole('button', {
        name: 'components.pagination.nextPageAriaLabel',
      }),
    );

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('should return null when totalPages is 0', () => {
    const { container } = render(
      <Pagination page={1} totalPages={0} onPageChange={vi.fn()} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('should accept ref and className', () => {
    const ref = createRef<HTMLElement>();

    render(
      <Pagination
        ref={ref}
        data-testid='pagination'
        className='mt-16'
        page={1}
        totalPages={3}
        onPageChange={vi.fn()}
      />,
    );

    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(screen.getByTestId('pagination')).toHaveClass('mt-16');
  });
});

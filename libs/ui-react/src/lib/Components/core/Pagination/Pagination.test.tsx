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

  it('should clamp page above totalPages to totalPages', () => {
    render(<Pagination page={99} totalPages={5} onPageChange={vi.fn()} />);

    expect(screen.getByRole('button', { current: 'page' })).toHaveTextContent(
      '5',
    );
    expect(
      screen.getByRole('button', {
        name: 'components.pagination.nextPageAriaLabel',
      }),
    ).toBeDisabled();
  });

  it('should clamp page below 1 to 1', () => {
    render(<Pagination page={-5} totalPages={5} onPageChange={vi.fn()} />);

    expect(screen.getByRole('button', { current: 'page' })).toHaveTextContent(
      '1',
    );
    expect(
      screen.getByRole('button', {
        name: 'components.pagination.previousPageAriaLabel',
      }),
    ).toBeDisabled();
  });

  it('should call onPageChange with clamped prev value when page is above totalPages', () => {
    const onPageChange = vi.fn();

    render(<Pagination page={99} totalPages={5} onPageChange={onPageChange} />);

    fireEvent.click(
      screen.getByRole('button', {
        name: 'components.pagination.previousPageAriaLabel',
      }),
    );

    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('should treat negative siblingCount as 0', () => {
    render(
      <Pagination
        page={10}
        totalPages={20}
        siblingCount={-1}
        onPageChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { current: 'page' })).toHaveTextContent(
      '10',
    );
  });

  it('should return null when totalPages is 0', () => {
    const { container } = render(
      <Pagination page={1} totalPages={0} onPageChange={vi.fn()} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('should render the current of total label instead of page buttons when compact', () => {
    render(
      <Pagination
        page={2}
        totalPages={8}
        density='compact'
        onPageChange={vi.fn()}
      />,
    );

    expect(
      screen.getByText('components.pagination.pageOfTotal'),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { current: 'page' }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('should navigate with previous and next when compact', () => {
    const onPageChange = vi.fn();

    render(
      <Pagination
        page={2}
        totalPages={8}
        density='compact'
        onPageChange={onPageChange}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'components.pagination.previousPageAriaLabel',
      }),
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: 'components.pagination.nextPageAriaLabel',
      }),
    );

    expect(onPageChange).toHaveBeenNthCalledWith(1, 1);
    expect(onPageChange).toHaveBeenNthCalledWith(2, 3);
  });

  it('should disable previous and next when compact with a single page', () => {
    render(
      <Pagination
        page={1}
        totalPages={1}
        density='compact'
        onPageChange={vi.fn()}
      />,
    );

    for (const button of screen.getAllByRole('button')) {
      expect(button).toBeDisabled();
    }
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

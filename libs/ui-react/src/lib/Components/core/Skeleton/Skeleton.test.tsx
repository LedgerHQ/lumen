import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Skeleton } from './Skeleton';

describe('Skeleton Component', () => {
  it('should render correctly', () => {
    render(<Skeleton />);
    const skeletonElement = screen.getByTestId('skeleton');
    expect(skeletonElement).toBeInTheDocument();
  });

  it('should have correct data-slot attribute', () => {
    render(<Skeleton />);
    const skeletonElement = screen.getByTestId('skeleton');
    expect(skeletonElement).toHaveAttribute('data-slot', 'skeleton');
  });

  it('should apply default classes', () => {
    render(<Skeleton />);
    const skeletonElement = screen.getByTestId('skeleton');
    expect(skeletonElement).toHaveClass(
      'animate-pulse',
      'rounded-md',
      'bg-muted-transparent',
    );
  });

  it('should accept custom className', () => {
    render(<Skeleton className='mt-2' />);
    const skeletonElement = screen.getByTestId('skeleton');
    expect(skeletonElement).toHaveClass('mt-2');
  });

  it('should accept additional props', () => {
    render(<Skeleton data-testid='custom-skeleton' />);
    const skeletonElement = screen.getByTestId('custom-skeleton');
    expect(skeletonElement).toBeInTheDocument();
  });
});

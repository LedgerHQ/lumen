import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';
import { DotCount } from './DotCount';

describe('DotCount', () => {
  it('should render the value', () => {
    render(<DotCount value={5} size='lg' />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should hide text when value is 0', () => {
    render(<DotCount value={0} size='lg' />);
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('should cap value at max and show overflow indicator', () => {
    render(<DotCount value={100} max={50} size='lg' />);
    expect(screen.getByText('50+')).toBeInTheDocument();
  });

  it('should default max to 99', () => {
    render(<DotCount value={150} size='lg' />);
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('should clamp max to 1 when given zero or negative', () => {
    render(<DotCount value={5} max={0} size='lg' />);
    expect(screen.getByText('1+')).toBeInTheDocument();
  });

  it('should render children alongside the count', () => {
    render(
      <DotCount value={3} size='md'>
        <span>Child</span>
      </DotCount>,
    );

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Child')).toBeInTheDocument();
  });

  it('should forward data-testid to the outer wrapper', () => {
    render(<DotCount data-testid='dot-count' value={3} size='lg' />);
    expect(screen.getByTestId('dot-count')).toBeInTheDocument();
  });

  it('should forward ref to the outer wrapper', () => {
    const ref = createRef<HTMLDivElement>();
    render(<DotCount ref={ref} value={3} size='lg' />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('should render with red appearance', () => {
    render(<DotCount value={5} size='lg' appearance='red' />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should render with disabled state', () => {
    render(<DotCount value={5} size='lg' disabled />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should let the disabled background override the appearance background', () => {
    render(<DotCount value={5} disabled aria-label='count' />);
    const dot = screen.getByRole('img');
    expect(dot).toHaveClass('bg-disabled');
    expect(dot).not.toHaveClass('bg-interactive');
  });

  it('should render in md size', () => {
    render(<DotCount value={5} size='md' />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should default size to md when omitted', () => {
    render(<DotCount value={5} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should apply aria-label to the inner dot', () => {
    render(<DotCount value={3} aria-label='3 notifications' />);
    expect(
      screen.getByRole('img', { name: '3 notifications' }),
    ).toBeInTheDocument();
  });

  it('should apply relative positioning when children provided', () => {
    render(
      <DotCount data-testid='dot-count' value={3}>
        <span>Child</span>
      </DotCount>,
    );
    expect(screen.getByTestId('dot-count')).toHaveClass('relative');
  });

  it('should keep the pinned dot above an open popup trigger', () => {
    render(
      <DotCount data-testid='dot-count' value={3} aria-label='3 notifications'>
        <span>Child</span>
      </DotCount>,
    );

    expect(screen.getByTestId('dot-count')).toHaveClass('group/dot-count');
    expect(screen.getByRole('img', { name: '3 notifications' })).toHaveClass(
      'group-has-data-popup-open/dot-count:z-above-trigger',
    );
  });

  it('should accept additional HTML attributes', () => {
    render(<DotCount value={3} data-testid='dot-count' id='my-dot' />);
    expect(screen.getByTestId('dot-count')).toHaveAttribute('id', 'my-dot');
  });

  it('should have correct displayName', () => {
    expect(DotCount.displayName).toBe('DotCount');
  });
});

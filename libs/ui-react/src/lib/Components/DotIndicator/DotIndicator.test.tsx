import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';
import { DotIndicator } from './DotIndicator';

describe('DotIndicator', () => {
  it('should render without crashing', () => {
    const { container } = render(<DotIndicator />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render children', () => {
    render(
      <DotIndicator>
        <span>Child</span>
      </DotIndicator>,
    );
    expect(screen.getByText('Child')).toBeInTheDocument();
  });

  it('should apply aria-label to the dot', () => {
    render(<DotIndicator aria-label='New notifications' />);
    expect(screen.getByLabelText('New notifications')).toBeInTheDocument();
  });

  it('should forward data-testid to the outer wrapper', () => {
    render(<DotIndicator data-testid='dot-indicator' />);
    expect(screen.getByTestId('dot-indicator')).toBeInTheDocument();
  });

  it('should forward ref to the outer wrapper', () => {
    const ref = createRef<HTMLDivElement>();
    render(<DotIndicator ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('should render in xs size', () => {
    const { container } = render(<DotIndicator size='xs' />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render in md size', () => {
    const { container } = render(<DotIndicator size='md' />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with red appearance', () => {
    const { container } = render(<DotIndicator appearance='red' />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with disabled state', () => {
    const { container } = render(<DotIndicator disabled />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render pinned overlay when children provided', () => {
    render(
      <DotIndicator data-testid='dot-indicator'>
        <span>Content</span>
      </DotIndicator>,
    );

    expect(screen.getByTestId('dot-indicator')).toHaveClass('relative');
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should accept additional HTML attributes', () => {
    render(<DotIndicator data-testid='dot-indicator' id='my-dot' />);
    expect(screen.getByTestId('dot-indicator')).toHaveAttribute('id', 'my-dot');
  });

  it('should have correct displayName', () => {
    expect(DotIndicator.displayName).toBe('DotIndicator');
  });
});

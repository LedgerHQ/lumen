import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { ArrowDown } from '../../Symbols';

import { DotIcon } from './DotIcon';

describe('DotIcon Component', () => {
  it('should render children and an icon', () => {
    const { container } = render(
      <DotIcon appearance='success' icon={ArrowDown}>
        <span data-testid='child'>Child</span>
      </DotIcon>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('img')).not.toBeInTheDocument();
  });

  it('should render without children', () => {
    const { container } = render(
      <DotIcon appearance='success' icon={ArrowDown} />,
    );

    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('should apply default props (pin=bottom-end, size=20, shape=circle)', () => {
    const { container } = render(
      <DotIcon appearance='success' icon={ArrowDown} />,
    );

    const dot = container.querySelector('.size-20');
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveClass('rounded-full');
    expect(dot).toHaveStyle({ bottom: '-3px', right: '-3px' });
  });

  it('should apply bottom-end pin offset', () => {
    const { container } = render(
      <DotIcon
        appearance='success'
        icon={ArrowDown}
        pin='bottom-end'
        size={16}
      />,
    );

    const dot = container.querySelector('.size-16');
    expect(dot).toHaveStyle({ bottom: '-3px', right: '-3px' });
  });

  it('should apply top-end pin offset', () => {
    const { container } = render(
      <DotIcon appearance='success' icon={ArrowDown} pin='top-end' size={16} />,
    );

    const dot = container.querySelector('.size-16');
    expect(dot).toHaveStyle({ top: '-3px', right: '-3px' });
  });

  it('should apply bottom-start pin offset', () => {
    const { container } = render(
      <DotIcon
        appearance='success'
        icon={ArrowDown}
        pin='bottom-start'
        size={16}
      />,
    );

    const dot = container.querySelector('.size-16');
    expect(dot).toHaveStyle({ bottom: '-3px', left: '-3px' });
  });

  it('should apply top-start pin offset', () => {
    const { container } = render(
      <DotIcon
        appearance='success'
        icon={ArrowDown}
        pin='top-start'
        size={16}
      />,
    );

    const dot = container.querySelector('.size-16');
    expect(dot).toHaveStyle({ top: '-3px', left: '-3px' });
  });

  it.each([
    { size: 16 as const, offset: '-3px' },
    { size: 20 as const, offset: '-3px' },
    { size: 24 as const, offset: '-3px' },
  ])('should apply correct offset for size $size', ({ size, offset }) => {
    const { container } = render(
      <DotIcon
        appearance='success'
        icon={ArrowDown}
        size={size}
        pin='bottom-end'
      />,
    );

    const dot = container.querySelector(`.size-${size}`);
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveStyle({ bottom: offset, right: offset });
  });

  it('should apply square shape class', () => {
    const { container } = render(
      <DotIcon
        appearance='success'
        icon={ArrowDown}
        shape='square'
        size={16}
      />,
    );

    const dot = container.querySelector('.size-16');
    expect(dot).toHaveClass('rounded-[5px]');
    expect(dot).not.toHaveClass('rounded-full');
  });

  it('should apply circle shape class', () => {
    const { container } = render(
      <DotIcon
        appearance='success'
        icon={ArrowDown}
        shape='circle'
        size={16}
      />,
    );

    const dot = container.querySelector('.size-16');
    expect(dot).toHaveClass('rounded-full');
  });

  it.each([
    { appearance: 'success' as const, expectedClass: 'bg-success-strong' },
    { appearance: 'muted' as const, expectedClass: 'bg-muted-strong' },
    { appearance: 'error' as const, expectedClass: 'bg-error-strong' },
  ])(
    'should apply $expectedClass for $appearance appearance',
    ({ appearance, expectedClass }) => {
      const { container } = render(
        <DotIcon appearance={appearance} icon={ArrowDown} />,
      );

      const dot = container.querySelector(`.${expectedClass}`);
      expect(dot).toBeInTheDocument();
    },
  );

  it('should apply custom className to the wrapper', () => {
    const { container } = render(
      <DotIcon appearance='success' icon={ArrowDown} className='mt-16' />,
    );

    expect(container.firstChild).toHaveClass('mt-16');
  });

  it('should keep the relative inline-flex layout on the wrapper', () => {
    const { container } = render(
      <DotIcon appearance='success' icon={ArrowDown} />,
    );

    expect(container.firstChild).toHaveClass('relative');
    expect(container.firstChild).toHaveClass('inline-flex');
  });

  it('should forward ref correctly', () => {
    const ref = vi.fn();
    render(<DotIcon appearance='success' icon={ArrowDown} ref={ref} />);

    expect(ref).toHaveBeenCalled();
  });

  it('should pass additional HTML attributes', () => {
    render(
      <DotIcon
        appearance='success'
        icon={ArrowDown}
        data-testid='dot'
        id='dot-icon'
      />,
    );

    const el = screen.getByTestId('dot');
    expect(el).toHaveAttribute('id', 'dot-icon');
  });

  it('should have correct displayName', () => {
    expect(DotIcon.displayName).toBe('DotIcon');
  });
});

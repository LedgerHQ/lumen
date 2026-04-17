import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { ArrowDown } from '../../Symbols';

import { DotSymbol } from './DotSymbol';

describe('DotSymbol Component', () => {
  const dotSrc = 'https://crypto-icons.ledger.com/BTC.png';

  it('should render children and dot image', () => {
    const { container } = render(
      <DotSymbol src={dotSrc} alt='Bitcoin'>
        <span data-testid='child'>Child</span>
      </DotSymbol>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();

    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', dotSrc);
    expect(img).toHaveAttribute('alt', 'Bitcoin');
  });

  it('should render without children', () => {
    const { container } = render(<DotSymbol src={dotSrc} />);

    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
  });

  it('should apply default props (pin=bottom-end, size=16, shape=circle)', () => {
    const { container } = render(<DotSymbol src={dotSrc} />);

    const dot = container.querySelector('.size-20');
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveClass('rounded-full');
    expect(dot).toHaveStyle({ bottom: '-3px', right: '-3px' });
  });

  it('should apply bottom-end pin offset', () => {
    const { container } = render(
      <DotSymbol src={dotSrc} pin='bottom-end' size={16} />,
    );

    const dot = container.querySelector('.size-16');
    expect(dot).toHaveStyle({ bottom: '-3px', right: '-3px' });
  });

  it('should apply top-end pin offset', () => {
    const { container } = render(
      <DotSymbol src={dotSrc} pin='top-end' size={16} />,
    );

    const dot = container.querySelector('.size-16');
    expect(dot).toHaveStyle({ top: '-3px', right: '-3px' });
  });

  it('should apply bottom-start pin offset', () => {
    const { container } = render(
      <DotSymbol src={dotSrc} pin='bottom-start' size={16} />,
    );

    const dot = container.querySelector('.size-16');
    expect(dot).toHaveStyle({ bottom: '-3px', left: '-3px' });
  });

  it('should apply top-start pin offset', () => {
    const { container } = render(
      <DotSymbol src={dotSrc} pin='top-start' size={16} />,
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
      <DotSymbol src={dotSrc} size={size} pin='bottom-end' />,
    );

    const dot = container.querySelector(`.size-${size}`);
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveStyle({ bottom: offset, right: offset });
  });

  it('should apply square shape class', () => {
    const { container } = render(
      <DotSymbol src={dotSrc} shape='square' size={16} />,
    );

    const dot = container.querySelector('.size-16');
    expect(dot).toHaveClass('rounded-[5px]');
    expect(dot).not.toHaveClass('rounded-full');
  });

  it('should apply circle shape class', () => {
    const { container } = render(
      <DotSymbol src={dotSrc} shape='circle' size={16} />,
    );

    const dot = container.querySelector('.size-16');
    expect(dot).toHaveClass('rounded-full');
  });

  it('should apply custom className to the wrapper', () => {
    const { container } = render(<DotSymbol src={dotSrc} className='mt-16' />);

    expect(container.firstChild).toHaveClass('mt-16');
  });

  it('should keep the relative inline-flex layout on the wrapper', () => {
    const { container } = render(<DotSymbol src={dotSrc} />);

    expect(container.firstChild).toHaveClass('relative');
    expect(container.firstChild).toHaveClass('inline-flex');
  });

  it('should forward ref correctly', () => {
    const ref = vi.fn();
    render(<DotSymbol src={dotSrc} ref={ref} />);

    expect(ref).toHaveBeenCalled();
  });

  it('should pass additional HTML attributes', () => {
    render(<DotSymbol src={dotSrc} data-testid='dot' id='dot-symbol' />);

    const el = screen.getByTestId('dot');
    expect(el).toHaveAttribute('id', 'dot-symbol');
  });

  it('should have correct displayName', () => {
    expect(DotSymbol.displayName).toBe('DotSymbol');
  });

  describe('Icon variant', () => {
    it('should render an icon instead of an image', () => {
      const { container } = render(
        <DotSymbol type='icon' appearance='success' icon={ArrowDown}>
          <span data-testid='child'>Child</span>
        </DotSymbol>,
      );

      expect(container.querySelector('svg')).toBeInTheDocument();
      expect(container.querySelector('img')).not.toBeInTheDocument();
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it.each([
      {
        appearance: 'success' as const,
        expectedClass: 'bg-success-strong',
      },
      {
        appearance: 'muted' as const,
        expectedClass: 'bg-muted-strong',
      },
      {
        appearance: 'error' as const,
        expectedClass: 'bg-error-strong',
      },
    ])(
      'should apply $expectedClass for $appearance appearance',
      ({ appearance, expectedClass }) => {
        const { container } = render(
          <DotSymbol type='icon' appearance={appearance} icon={ArrowDown} />,
        );

        const dot = container.querySelector(`.${expectedClass}`);
        expect(dot).toBeInTheDocument();
      },
    );

    it('should not apply bg-muted class in icon mode', () => {
      const { container } = render(
        <DotSymbol type='icon' appearance='success' icon={ArrowDown} />,
      );

      const dot = container.querySelector('.bg-muted');
      expect(dot).not.toBeInTheDocument();
    });

    it('should apply correct pin offset for icon variant', () => {
      const { container } = render(
        <DotSymbol
          type='icon'
          appearance='muted'
          icon={ArrowDown}
          size={16}
          pin='top-end'
        />,
      );

      const dot = container.querySelector('.size-16');
      expect(dot).toHaveStyle({ top: '-3px', right: '-3px' });
    });
  });
});

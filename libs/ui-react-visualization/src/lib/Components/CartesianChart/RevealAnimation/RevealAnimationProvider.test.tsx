import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { DrawingArea, Series } from '../../../utils/types';
import { OVERFLOW_BUFFER } from '../utils';

import { usePathReveal, usePointReveal } from './context';
import { RevealAnimationProvider } from './RevealAnimationProvider';

const drawingArea: DrawingArea = {
  x: 10,
  y: 10,
  width: 380,
  height: 180,
};

const series: Series[] = [{ id: 'a', stroke: '#000', data: [1, 2, 3] }];

function ClipConsumer() {
  const clipPath = usePathReveal();
  return <rect data-testid='consumer' clipPath={clipPath} />;
}

function PointConsumer() {
  const style = usePointReveal();
  return <g data-testid='point-consumer' style={style} />;
}

const renderInSvg = (ui: React.ReactElement) => render(<svg>{ui}</svg>);

describe('RevealAnimationProvider', () => {
  it('renders a clipPath with an animated rect', () => {
    const { container } = renderInSvg(
      <RevealAnimationProvider
        drawingArea={drawingArea}
        series={series}
        transitions={{ enter: { duration: 0.5, easing: 'ease-out' } }}
      >
        <rect data-testid='child' />
      </RevealAnimationProvider>,
    );

    const clipPathEl = container.querySelector('clipPath');
    expect(clipPathEl).not.toBeNull();

    const rect = clipPathEl!.querySelector('rect');
    expect(rect).not.toBeNull();
    expect(rect!.getAttribute('x')).toBe(
      `${drawingArea.x - OVERFLOW_BUFFER.left}`,
    );
    expect(rect!.getAttribute('y')).toBe(
      `${drawingArea.y - OVERFLOW_BUFFER.top}`,
    );
    expect(rect!.getAttribute('height')).toBe(
      `${drawingArea.height + OVERFLOW_BUFFER.top + OVERFLOW_BUFFER.bottom}`,
    );
    expect(rect!.getAttribute('width')).toBe(
      `${drawingArea.width + OVERFLOW_BUFFER.left + OVERFLOW_BUFFER.right}`,
    );
  });

  it('provides clip-path to consumers via context', () => {
    const { container } = renderInSvg(
      <RevealAnimationProvider drawingArea={drawingArea} series={series}>
        <ClipConsumer />
      </RevealAnimationProvider>,
    );

    const consumer = container.querySelector('[data-testid="consumer"]');
    expect(consumer).not.toBeNull();
    expect(consumer!.getAttribute('clip-path')).toMatch(/^url\(#/);
  });

  it('renders children', () => {
    const { getByTestId } = renderInSvg(
      <RevealAnimationProvider drawingArea={drawingArea} series={series}>
        <rect data-testid='child' />
      </RevealAnimationProvider>,
    );

    expect(getByTestId('child')).toBeTruthy();
  });

  it('skips clipPath when animate is false', () => {
    const { container } = renderInSvg(
      <RevealAnimationProvider drawingArea={drawingArea} series={series} animate={false}>
        <ClipConsumer />
      </RevealAnimationProvider>,
    );

    const clipPathEl = container.querySelector('clipPath');
    expect(clipPathEl).toBeNull();

    const consumer = container.querySelector('[data-testid="consumer"]');
    expect(consumer!.getAttribute('clip-path')).toBeNull();
  });

  it('falls back to default animation when transitions.enter is not defined', () => {
    const { container } = renderInSvg(
      <RevealAnimationProvider drawingArea={drawingArea} series={series}>
        <rect data-testid='child' />
      </RevealAnimationProvider>,
    );

    const clipPathEl = container.querySelector('clipPath');
    expect(clipPathEl).not.toBeNull();
  });

  it('injects a @keyframes style block', () => {
    const { container } = renderInSvg(
      <RevealAnimationProvider
        drawingArea={drawingArea}
        series={series}
        transitions={{ enter: { duration: 0.8, easing: 'linear' } }}
      >
        <rect />
      </RevealAnimationProvider>,
    );

    const styleEl = container.querySelector('style');
    expect(styleEl).not.toBeNull();
    expect(styleEl!.textContent).toContain('@keyframes');
    expect(styleEl!.textContent).toContain(
      `${drawingArea.width + OVERFLOW_BUFFER.left + OVERFLOW_BUFFER.right}px`,
    );
  });

  it('injects the point fade @keyframes into the style block', () => {
    const { container } = renderInSvg(
      <RevealAnimationProvider drawingArea={drawingArea} series={series}>
        <rect />
      </RevealAnimationProvider>,
    );

    const styleEl = container.querySelector('style');
    expect(styleEl!.textContent).toContain('@keyframes reveal-fade-');
    expect(styleEl!.textContent).toContain('opacity: 0');
    expect(styleEl!.textContent).toContain('opacity: 1');
  });

  it('provides an opacity fade-in style to point consumers via context', () => {
    const { getByTestId } = renderInSvg(
      <RevealAnimationProvider drawingArea={drawingArea} series={series}>
        <PointConsumer />
      </RevealAnimationProvider>,
    );

    const consumer = getByTestId('point-consumer');
    const animation = consumer.style.animation;
    expect(animation).toContain('reveal-fade-');
    expect(animation).toContain('both');
  });

  it('does not apply a point reveal style when animate is false', () => {
    const { getByTestId } = renderInSvg(
      <RevealAnimationProvider drawingArea={drawingArea} series={series} animate={false}>
        <PointConsumer />
      </RevealAnimationProvider>,
    );

    const consumer = getByTestId('point-consumer');
    expect(consumer.style.animation).toBe('');
  });

  it('applies animation style to the clip rect', () => {
    const { container } = renderInSvg(
      <RevealAnimationProvider
        drawingArea={drawingArea}
        series={series}
        transitions={{
          enter: { duration: 1.2, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
        }}
      >
        <rect />
      </RevealAnimationProvider>,
    );

    const rect = container.querySelector('clipPath rect');
    const style = rect!.getAttribute('style') ?? '';
    expect(style).toContain('1.2s');
    expect(style).toContain('cubic-bezier(0.4, 0, 0.2, 1)');
  });
});

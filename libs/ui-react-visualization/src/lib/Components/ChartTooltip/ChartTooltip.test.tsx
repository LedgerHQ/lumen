import { render, act, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { CartesianChart } from '../CartesianChart';
import { ChartTooltip } from './ChartTooltip';

const sampleSeries = [
  { id: 's1', stroke: '#7B61FF', data: [10, 20, 30, 40, 50] },
];

const renderTooltip = ({
  tooltipProps = { items: () => [] },
  width = 400,
  height = 200,
}: {
  tooltipProps?: React.ComponentProps<typeof ChartTooltip>;
  width?: number;
  height?: number;
} = {}) => {
  const result = render(
    <CartesianChart
      series={sampleSeries}
      width={width}
      height={height}
      enableScrubbing
    >
      <ChartTooltip {...tooltipProps} />
    </CartesianChart>,
  );

  const svg = result.getByTestId('chart-svg');
  vi.spyOn(svg, 'getBoundingClientRect').mockReturnValue({
    left: 0,
    top: 0,
    right: width,
    bottom: height,
    width,
    height,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  });

  return result;
};

const moveScrubber = (svg: Element, clientX: number) => {
  act(() => {
    fireEvent.mouseMove(svg, { clientX, clientY: 100 });
  });
};

describe('ChartTooltip', () => {
  it('is hidden when no scrubber position is active', () => {
    const { getByTestId } = renderTooltip({
      tooltipProps: { items: () => [{ label: 'Date', value: 'Jan' }] },
    });
    expect(getByTestId('chart-tooltip').style.opacity).toBe('0');
  });

  it('is hidden when items callback returns an empty array', () => {
    const { getByTestId } = renderTooltip({
      tooltipProps: { items: () => [] },
    });
    moveScrubber(getByTestId('chart-svg'), 200);
    expect(getByTestId('chart-tooltip').style.opacity).toBe('0');
  });

  it('is visible when scrubber is active and items are provided', () => {
    const { getByTestId } = renderTooltip({
      tooltipProps: { items: () => [{ label: 'Date', value: 'Jan' }] },
    });
    moveScrubber(getByTestId('chart-svg'), 200);
    expect(getByTestId('chart-tooltip').style.opacity).toBe('1');
  });

  it('renders item title and value text', () => {
    const { getByTestId, getByText } = renderTooltip({
      tooltipProps: { items: () => [{ label: 'Date', value: 'Jan' }] },
    });
    moveScrubber(getByTestId('chart-svg'), 200);
    expect(getByText('Date')).toBeTruthy();
    expect(getByText('Jan')).toBeTruthy();
  });

  it('renders multiple items', () => {
    const { getByTestId, getByText } = renderTooltip({
      tooltipProps: {
        items: () => [
          { label: 'Date', value: 'Jan' },
          { label: 'Price', value: '$10' },
        ],
      },
    });
    moveScrubber(getByTestId('chart-svg'), 200);
    expect(getByText('Date')).toBeTruthy();
    expect(getByText('Jan')).toBeTruthy();
    expect(getByText('Price')).toBeTruthy();
    expect(getByText('$10')).toBeTruthy();
  });

  it('passes the active data index to the items callback', () => {
    const items = vi.fn().mockReturnValue([{ label: 'i', value: '0' }]);
    const { getByTestId } = renderTooltip({ tooltipProps: { items } });
    moveScrubber(getByTestId('chart-svg'), 200);
    expect(items).toHaveBeenCalledWith(expect.any(Number));
  });

  it('suppresses the tooltip for specific indices when items returns empty', () => {
    const { getByTestId } = renderTooltip({
      tooltipProps: {
        items: (i) => (i === 0 ? [{ label: 'T', value: 'V' }] : []),
      },
    });
    const svg = getByTestId('chart-svg');
    moveScrubber(svg, 200); // snaps to a non-zero index
    expect(getByTestId('chart-tooltip').style.opacity).toBe('0');
  });

  it('hides the tooltip on mouseleave', () => {
    const { getByTestId } = renderTooltip({
      tooltipProps: { items: () => [{ label: 'T', value: 'V' }] },
    });
    const svg = getByTestId('chart-svg');
    moveScrubber(svg, 200);
    expect(getByTestId('chart-tooltip').style.opacity).toBe('1');
    act(() => {
      fireEvent.mouseLeave(svg);
    });
    expect(getByTestId('chart-tooltip').style.opacity).toBe('0');
  });

  it('positions the tooltip to the right of the scrubber by default', () => {
    const { getByTestId } = renderTooltip({
      tooltipProps: { items: () => [{ label: 'T', value: 'V' }] },
    });
    moveScrubber(getByTestId('chart-svg'), 0);
    const rect = getByTestId('chart-tooltip').querySelector('rect');
    const x = parseFloat(rect?.getAttribute('x') ?? '0');
    expect(x).toBeGreaterThan(0);
  });

  it('auto-flips the tooltip to the left when it would overflow the right edge', () => {
    const { getByTestId } = renderTooltip({
      tooltipProps: {
        tooltipWidth: 120,
        offset: 10,
        items: () => [{ label: 'T', value: 'V' }],
      },
    });
    // Move to the far right so pixelX + 10 + 120 > 400
    moveScrubber(getByTestId('chart-svg'), 380);
    const rect = getByTestId('chart-tooltip').querySelector('rect');
    const rectX = parseFloat(rect?.getAttribute('x') ?? '0');
    // Flipped: rect left edge should be < scrubber pixel position
    expect(rectX).toBeLessThan(380);
  });

  it('applies a custom offset to position the tooltip', () => {
    const { getByTestId } = renderTooltip({
      tooltipProps: {
        offset: 30,
        items: () => [{ label: 'T', value: 'V' }],
      },
    });
    moveScrubber(getByTestId('chart-svg'), 0);
    const rect = getByTestId('chart-tooltip').querySelector('rect');
    const rectX = parseFloat(rect?.getAttribute('x') ?? '0');
    expect(rectX).toBeGreaterThanOrEqual(30);
  });

  it('applies tooltipWidth to the rendered rect width', () => {
    const tooltipWidth = 180;
    const { getByTestId } = renderTooltip({
      tooltipProps: {
        tooltipWidth,
        items: () => [{ label: 'T', value: 'V' }],
      },
    });
    moveScrubber(getByTestId('chart-svg'), 100);
    const rect = getByTestId('chart-tooltip').querySelector('rect');
    expect(parseFloat(rect?.getAttribute('width') ?? '0')).toBe(tooltipWidth);
  });

  it('calls items with different indices as the scrubber moves to different positions', () => {
    const items = vi.fn().mockReturnValue([{ label: 'T', value: 'V' }]);
    const { getByTestId } = renderTooltip({ tooltipProps: { items } });
    const svg = getByTestId('chart-svg');
    moveScrubber(svg, 50);
    moveScrubber(svg, 300);
    const calledIndices = items.mock.calls.map((args) => args[0]);
    expect(new Set(calledIndices).size).toBeGreaterThan(1);
  });

  describe('title prop', () => {
    it('renders a static string title', () => {
      const { getByTestId, getByText } = renderTooltip({
        tooltipProps: {
          title: 'My Title',
          items: () => [{ label: 'T', value: 'V' }],
        },
      });
      moveScrubber(getByTestId('chart-svg'), 200);
      expect(getByText('My Title')).toBeTruthy();
    });

    it('renders the title returned by a callback', () => {
      const { getByTestId, getByText } = renderTooltip({
        tooltipProps: {
          title: (i) => `Index ${i}`,
          items: () => [{ label: 'T', value: 'V' }],
        },
      });
      moveScrubber(getByTestId('chart-svg'), 200);
      expect(getByText(/^Index \d+$/)).toBeTruthy();
    });

    it('passes the active data index to the title callback', () => {
      const title = vi.fn().mockReturnValue('Title');
      const { getByTestId } = renderTooltip({
        tooltipProps: {
          title,
          items: () => [{ label: 'T', value: 'V' }],
        },
      });
      moveScrubber(getByTestId('chart-svg'), 200);
      expect(title).toHaveBeenCalledWith(expect.any(Number));
    });

    it('does not render a title element when title is undefined', () => {
      const { getByTestId } = renderTooltip({
        tooltipProps: { items: () => [{ label: 'T', value: 'V' }] },
      });
      moveScrubber(getByTestId('chart-svg'), 200);
      const tooltip = getByTestId('chart-tooltip');
      expect(
        tooltip.querySelector('[data-testid="chart-tooltip-title"]'),
      ).toBeNull();
    });

    it('does not render a title element when title callback returns null', () => {
      const { getByTestId } = renderTooltip({
        tooltipProps: {
          title: () => null,
          items: () => [{ label: 'T', value: 'V' }],
        },
      });
      moveScrubber(getByTestId('chart-svg'), 200);
      const tooltip = getByTestId('chart-tooltip');
      expect(
        tooltip.querySelector('[data-testid="chart-tooltip-title"]'),
      ).toBeNull();
    });

    it('increases the tooltip rect height when a title is present', () => {
      const withTitle = renderTooltip({
        tooltipProps: {
          title: 'Title',
          items: () => [{ label: 'T', value: 'V' }],
        },
      });
      moveScrubber(withTitle.getByTestId('chart-svg'), 200);
      const heightWith = parseFloat(
        withTitle
          .getByTestId('chart-tooltip')
          .querySelector('rect')
          ?.getAttribute('height') ?? '0',
      );

      withTitle.unmount();

      const withoutTitle = renderTooltip({
        tooltipProps: { items: () => [{ label: 'T', value: 'V' }] },
      });
      moveScrubber(withoutTitle.getByTestId('chart-svg'), 200);
      const heightWithout = parseFloat(
        withoutTitle
          .getByTestId('chart-tooltip')
          .querySelector('rect')
          ?.getAttribute('height') ?? '0',
      );

      expect(heightWith).toBeGreaterThan(heightWithout);
    });
  });
});

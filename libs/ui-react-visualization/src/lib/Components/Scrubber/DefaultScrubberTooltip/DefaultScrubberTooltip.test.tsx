import { render, act, fireEvent } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CartesianChart } from '../../CartesianChart';
import { Scrubber } from '../Scrubber';
import type { ScrubberProps } from '../types';

beforeEach(() => {
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    cb(0);
    return 0;
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const sampleSeries = [
  { id: 's1', stroke: '#7B61FF', data: [10, 20, 30, 40, 50] },
];

const renderScrubberTooltip = ({
  scrubberProps,
  width = 400,
  height = 200,
}: {
  scrubberProps: ScrubberProps & {
    tooltip: NonNullable<ScrubberProps['tooltip']>;
  };
  width?: number;
  height?: number;
}) => {
  const { tooltip: tooltipFn, ...rest } = scrubberProps;

  const result = render(
    <CartesianChart
      series={sampleSeries}
      width={width}
      height={height}
      enableScrubbing
    >
      <Scrubber {...rest} tooltip={tooltipFn} />
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

describe('DefaultScrubberTooltip', () => {
  it('is not mounted when no scrubber position is active', () => {
    const { queryByTestId } = renderScrubberTooltip({
      scrubberProps: {
        tooltip: () => ({ items: [{ label: 'Date', value: 'Jan' }] }),
      },
    });
    expect(queryByTestId('chart-tooltip')).toBeNull();
  });

  it('is not mounted when items callback returns an empty array', () => {
    const { getByTestId, queryByTestId } = renderScrubberTooltip({
      scrubberProps: { tooltip: () => ({ items: [] }) },
    });
    moveScrubber(getByTestId('chart-svg'), 200);
    expect(queryByTestId('chart-tooltip')).toBeNull();
  });

  it('is visible when scrubber is active and items are provided', () => {
    const { getByTestId } = renderScrubberTooltip({
      scrubberProps: {
        tooltip: () => ({ items: [{ label: 'Date', value: 'Jan' }] }),
      },
    });
    moveScrubber(getByTestId('chart-svg'), 200);
    expect(getByTestId('chart-tooltip').style.opacity).toBe('1');
  });

  it('renders item title and value text', () => {
    const { getByTestId, getByText } = renderScrubberTooltip({
      scrubberProps: {
        tooltip: () => ({ items: [{ label: 'Date', value: 'Jan' }] }),
      },
    });
    moveScrubber(getByTestId('chart-svg'), 200);
    expect(getByText('Date')).toBeTruthy();
    expect(getByText('Jan')).toBeTruthy();
  });

  it('renders multiple items', () => {
    const { getByTestId, getByText } = renderScrubberTooltip({
      scrubberProps: {
        tooltip: () => ({
          items: [
            { label: 'Date', value: 'Jan' },
            { label: 'Price', value: '$10' },
          ],
        }),
      },
    });
    moveScrubber(getByTestId('chart-svg'), 200);
    expect(getByText('Date')).toBeTruthy();
    expect(getByText('Jan')).toBeTruthy();
    expect(getByText('Price')).toBeTruthy();
    expect(getByText('$10')).toBeTruthy();
  });

  it('passes the active data index to the tooltip items via closure', () => {
    const items = vi.fn().mockReturnValue([{ label: 'i', value: '0' }]);
    const { getByTestId } = renderScrubberTooltip({
      scrubberProps: { tooltip: (i) => ({ items: items(i) }) },
    });
    moveScrubber(getByTestId('chart-svg'), 200);
    expect(items).toHaveBeenCalledWith(expect.any(Number));
  });

  it('suppresses the tooltip for specific indices when items returns empty', () => {
    const { getByTestId, queryByTestId } = renderScrubberTooltip({
      scrubberProps: {
        tooltip: (i) =>
          i === 0 ? { items: [{ label: 'T', value: 'V' }] } : { items: [] },
      },
    });
    const svg = getByTestId('chart-svg');
    moveScrubber(svg, 200);
    expect(queryByTestId('chart-tooltip')).toBeNull();
  });

  it('unmounts tooltip on mouseleave', () => {
    const { getByTestId, queryByTestId } = renderScrubberTooltip({
      scrubberProps: {
        tooltip: () => ({ items: [{ label: 'T', value: 'V' }] }),
      },
    });
    const svg = getByTestId('chart-svg');
    moveScrubber(svg, 200);
    expect(getByTestId('chart-tooltip')).toBeTruthy();
    act(() => {
      fireEvent.mouseLeave(svg);
    });
    expect(queryByTestId('chart-tooltip')).toBeNull();
  });

  it('positions the tooltip to the right of the scrubber by default', () => {
    const { getByTestId } = renderScrubberTooltip({
      scrubberProps: {
        tooltip: () => ({ items: [{ label: 'T', value: 'V' }] }),
      },
    });
    moveScrubber(getByTestId('chart-svg'), 0);
    const rect = getByTestId('chart-tooltip').querySelector('rect');
    const x = parseFloat(rect?.getAttribute('x') ?? '0');
    expect(x).toBeGreaterThan(0);
  });

  it('flips the tooltip to the left when it would overflow the right edge', () => {
    const { getByTestId } = renderScrubberTooltip({
      scrubberProps: {
        tooltip: () => ({
          minWidth: 120,
          offset: 10,
          items: [{ label: 'T', value: 'V' }],
        }),
      },
    });
    moveScrubber(getByTestId('chart-svg'), 380);
    const rect = getByTestId('chart-tooltip').querySelector('rect');
    const rectX = parseFloat(rect?.getAttribute('x') ?? '0');
    expect(rectX).toBeLessThan(380);
  });

  it('applies a custom offset from tooltip content', () => {
    const { getByTestId } = renderScrubberTooltip({
      scrubberProps: {
        tooltip: () => ({
          offset: 30,
          items: [{ label: 'T', value: 'V' }],
        }),
      },
    });
    moveScrubber(getByTestId('chart-svg'), 0);
    const rect = getByTestId('chart-tooltip').querySelector('rect');
    const rectX = parseFloat(rect?.getAttribute('x') ?? '0');
    expect(rectX).toBeGreaterThanOrEqual(30);
  });

  it('honors minWidth from tooltip content as a minimum rect width', () => {
    const minWidth = 180;
    const { getByTestId } = renderScrubberTooltip({
      scrubberProps: {
        tooltip: () => ({
          minWidth,
          items: [{ label: 'T', value: 'V' }],
        }),
      },
    });
    moveScrubber(getByTestId('chart-svg'), 100);
    const rect = getByTestId('chart-tooltip').querySelector('rect');
    expect(
      parseFloat(rect?.getAttribute('width') ?? '0'),
    ).toBeGreaterThanOrEqual(minWidth);
  });

  it('calls tooltip with different indices as the scrubber moves', () => {
    const tooltip = vi
      .fn()
      .mockReturnValue({ items: [{ label: 'T', value: 'V' }] });
    const { getByTestId } = renderScrubberTooltip({
      scrubberProps: { tooltip },
    });
    const svg = getByTestId('chart-svg');
    moveScrubber(svg, 50);
    moveScrubber(svg, 300);
    const calledIndices = tooltip.mock.calls.map((args) => args[0]);
    expect(new Set(calledIndices).size).toBeGreaterThan(1);
  });

  describe('title in tooltip content', () => {
    it('renders a static string title', () => {
      const { getByTestId, getByText } = renderScrubberTooltip({
        scrubberProps: {
          tooltip: () => ({
            title: 'My Title',
            items: [{ label: 'T', value: 'V' }],
          }),
        },
      });
      moveScrubber(getByTestId('chart-svg'), 200);
      expect(getByText('My Title')).toBeTruthy();
    });

    it('renders the title from a callback in content', () => {
      const { getByTestId, getByText } = renderScrubberTooltip({
        scrubberProps: {
          tooltip: (i) => ({
            title: `Index ${i}`,
            items: [{ label: 'T', value: 'V' }],
          }),
        },
      });
      moveScrubber(getByTestId('chart-svg'), 200);
      expect(getByText(/^Index \d+$/)).toBeTruthy();
    });

    it('passes the active data index to the title callback', () => {
      const title = vi.fn().mockReturnValue('Title');
      const { getByTestId } = renderScrubberTooltip({
        scrubberProps: {
          tooltip: () => ({
            title,
            items: [{ label: 'T', value: 'V' }],
          }),
        },
      });
      moveScrubber(getByTestId('chart-svg'), 200);
      expect(title).toHaveBeenCalledWith(expect.any(Number));
    });

    it('does not render a title element when title is omitted', () => {
      const { getByTestId } = renderScrubberTooltip({
        scrubberProps: {
          tooltip: () => ({ items: [{ label: 'T', value: 'V' }] }),
        },
      });
      moveScrubber(getByTestId('chart-svg'), 200);
      const tooltip = getByTestId('chart-tooltip');
      expect(
        tooltip.querySelector('[data-testid="chart-tooltip-title"]'),
      ).toBeNull();
    });

    it('does not render a title element when title callback returns undefined', () => {
      const { getByTestId } = renderScrubberTooltip({
        scrubberProps: {
          tooltip: () => ({
            title: () => undefined,
            items: [{ label: 'T', value: 'V' }],
          }),
        },
      });
      moveScrubber(getByTestId('chart-svg'), 200);
      const tooltip = getByTestId('chart-tooltip');
      expect(
        tooltip.querySelector('[data-testid="chart-tooltip-title"]'),
      ).toBeNull();
    });

    it('increases the tooltip rect height when a title is present', () => {
      const withTitle = renderScrubberTooltip({
        scrubberProps: {
          tooltip: () => ({
            title: 'Title',
            items: [{ label: 'T', value: 'V' }],
          }),
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

      const withoutTitle = renderScrubberTooltip({
        scrubberProps: {
          tooltip: () => ({ items: [{ label: 'T', value: 'V' }] }),
        },
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

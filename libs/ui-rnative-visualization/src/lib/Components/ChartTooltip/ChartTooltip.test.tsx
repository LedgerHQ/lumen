import { describe, expect, it, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { ThemeProvider } from '@ledgerhq/lumen-ui-rnative';
import { render } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import { CartesianChart } from '../CartesianChart';
import { ScrubberContextProvider } from '../Scrubber/context';
import type { ScrubberContextValue } from '../Scrubber/types';
import { ChartTooltip } from './ChartTooltip';
import type { ChartTooltipItemData } from './types';

const sampleSeries = [
  { id: 's1', stroke: '#7B61FF', data: [10, 20, 30, 40, 50] },
];

const Wrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='light'>
    {children}
  </ThemeProvider>
);

const activeScrubberContext: ScrubberContextValue = {
  enableScrubbing: true,
  scrubberPosition: 2,
  onScrubberPositionChange: () => undefined,
};

const idleScrubberContext: ScrubberContextValue = {
  enableScrubbing: true,
  scrubberPosition: undefined,
  onScrubberPositionChange: () => undefined,
};

const renderTooltip = ({
  tooltipProps = { items: () => [] },
  scrubberContext = activeScrubberContext,
  width = 400,
  height = 200,
}: {
  tooltipProps?: React.ComponentProps<typeof ChartTooltip>;
  scrubberContext?: ScrubberContextValue;
  width?: number;
  height?: number;
} = {}) =>
  render(
    <Wrapper>
      <CartesianChart series={sampleSeries} width={width} height={height}>
        <ScrubberContextProvider value={scrubberContext}>
          <ChartTooltip {...tooltipProps} />
        </ScrubberContextProvider>
      </CartesianChart>
    </Wrapper>,
  );

describe('ChartTooltip', () => {
  it('renders nothing when no scrubber position is active', () => {
    const { queryByTestId } = renderTooltip({
      tooltipProps: { items: () => [{ label: 'Date', value: 'Jan' }] },
      scrubberContext: idleScrubberContext,
    });
    expect(queryByTestId('chart-tooltip')).toBeNull();
  });

  it('renders nothing when items callback returns an empty array', () => {
    const { queryByTestId } = renderTooltip({
      tooltipProps: { items: () => [] },
    });
    expect(queryByTestId('chart-tooltip')).toBeNull();
  });

  it('renders the tooltip group when scrubber is active and items are provided', () => {
    const { getByTestId } = renderTooltip({
      tooltipProps: { items: () => [{ label: 'Date', value: 'Jan' }] },
    });
    expect(getByTestId('chart-tooltip')).toBeTruthy();
  });

  it('renders the background rect', () => {
    const { getByTestId } = renderTooltip({
      tooltipProps: { items: () => [{ label: 'Date', value: 'Jan' }] },
    });
    expect(getByTestId('chart-tooltip-rect')).toBeTruthy();
  });

  it('renders item label and value text', () => {
    const { getByText } = renderTooltip({
      tooltipProps: { items: () => [{ label: 'Date', value: 'Jan' }] },
    });
    expect(getByText('Date')).toBeTruthy();
    expect(getByText('Jan')).toBeTruthy();
  });

  it('renders multiple items', () => {
    const { getByText } = renderTooltip({
      tooltipProps: {
        items: () => [
          { label: 'Date', value: 'Jan' },
          { label: 'Price', value: '$10' },
        ],
      },
    });
    expect(getByText('Date')).toBeTruthy();
    expect(getByText('Jan')).toBeTruthy();
    expect(getByText('Price')).toBeTruthy();
    expect(getByText('$10')).toBeTruthy();
  });

  it('passes the active data index to the items callback', () => {
    const items = jest
      .fn()
      .mockReturnValue([{ label: 'i', value: '0' }]) as unknown as (
      index: number,
    ) => ChartTooltipItemData[];
    renderTooltip({ tooltipProps: { items } });
    expect(items).toHaveBeenCalledWith(activeScrubberContext.scrubberPosition);
  });

  it('suppresses the tooltip when items returns empty for the active index', () => {
    const { queryByTestId } = renderTooltip({
      tooltipProps: { items: () => [] },
    });
    expect(queryByTestId('chart-tooltip')).toBeNull();
  });

  describe('flip-side and positioning logic', () => {
    const defaultItems = (): ChartTooltipItemData[] => [
      { label: 'Date', value: 'Jan' },
    ];

    const scrubberAt = (position: number): ScrubberContextValue => ({
      enableScrubbing: true,
      scrubberPosition: position,
      onScrubberPositionChange: () => undefined,
    });

    it("side='auto' places tooltip to the right when scrubber is mid-chart", () => {
      const { getByTestId } = renderTooltip({
        tooltipProps: { items: defaultItems },
        scrubberContext: scrubberAt(2),
      });
      expect(getByTestId('chart-tooltip-rect').props.x).toBe(210);
    });

    it("side='auto' flips tooltip left when right side would overflow (index 3)", () => {
      const { getByTestId } = renderTooltip({
        tooltipProps: { items: defaultItems },
        scrubberContext: scrubberAt(3),
      });
      expect(getByTestId('chart-tooltip-rect').props.x).toBe(160);
    });

    it("side='auto' flips at the rightmost scrubber position (index 4)", () => {
      const { getByTestId } = renderTooltip({
        tooltipProps: { items: defaultItems },
        scrubberContext: scrubberAt(4),
      });
      expect(getByTestId('chart-tooltip-rect').props.x).toBe(250);
    });

    it("side='left' always flips to the left regardless of scrubber position", () => {
      const { getByTestId } = renderTooltip({
        tooltipProps: { items: defaultItems, side: 'left' },
        scrubberContext: scrubberAt(2),
      });
      expect(getByTestId('chart-tooltip-rect').props.x).toBe(70);
    });

    it("side='right' never flips even at the rightmost position (index 4)", () => {
      const { getByTestId } = renderTooltip({
        tooltipProps: { items: defaultItems, side: 'right' },
        scrubberContext: scrubberAt(4),
      });
      expect(getByTestId('chart-tooltip-rect').props.x).toBe(390);
    });

    it('custom offset shifts the no-flip tooltip position', () => {
      const { getByTestId } = renderTooltip({
        tooltipProps: { items: defaultItems, offset: 20 },
        scrubberContext: scrubberAt(2),
      });
      expect(getByTestId('chart-tooltip-rect').props.x).toBe(220);
    });

    it('wider tooltipWidth can trigger a flip that the default width would not', () => {
      const { getByTestId } = renderTooltip({
        tooltipProps: { items: defaultItems, tooltipWidth: 200 },
        scrubberContext: scrubberAt(2),
      });
      expect(getByTestId('chart-tooltip-rect').props.x).toBe(20);
    });
  });

  describe('title prop', () => {
    it('renders a static string title', () => {
      const { getByTestId, getByText } = renderTooltip({
        tooltipProps: {
          title: 'My Title',
          items: () => [{ label: 'T', value: 'V' }],
        },
      });
      expect(getByTestId('chart-tooltip-title')).toBeTruthy();
      expect(getByText('My Title')).toBeTruthy();
    });

    it('renders the title returned by a callback', () => {
      const { getByTestId } = renderTooltip({
        tooltipProps: {
          title: (i) => `Index ${i}`,
          items: () => [{ label: 'T', value: 'V' }],
        },
      });
      expect(getByTestId('chart-tooltip-title')).toBeTruthy();
    });

    it('passes the active data index to the title callback', () => {
      const title = jest.fn().mockReturnValue('Title') as unknown as (
        index: number,
      ) => string;
      renderTooltip({
        tooltipProps: {
          title,
          items: () => [{ label: 'T', value: 'V' }],
        },
      });
      expect(title).toHaveBeenCalledWith(
        activeScrubberContext.scrubberPosition,
      );
    });

    it('does not render a title element when title is undefined', () => {
      const { queryByTestId } = renderTooltip({
        tooltipProps: { items: () => [{ label: 'T', value: 'V' }] },
      });
      expect(queryByTestId('chart-tooltip-title')).toBeNull();
    });

    it('does not render a title element when title callback returns null', () => {
      const { queryByTestId } = renderTooltip({
        tooltipProps: {
          title: () => null,
          items: () => [{ label: 'T', value: 'V' }],
        },
      });
      expect(queryByTestId('chart-tooltip-title')).toBeNull();
    });
  });
});

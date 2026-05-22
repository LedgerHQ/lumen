import { describe, expect, it, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { ThemeProvider } from '@ledgerhq/lumen-ui-rnative';
import { render } from '@testing-library/react-native';
import type { ComponentProps, ReactNode } from 'react';

import { CartesianChart } from '../../CartesianChart';
import { ScrubberContextProvider } from '../context';
import { Scrubber } from '../Scrubber';
import type { ScrubberContextValue, ScrubberTooltipContent } from '../types';

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
  scrubberProps = { tooltip: () => ({ items: [] }) },
  scrubberContext = activeScrubberContext,
  width = 400,
  height = 200,
}: {
  scrubberProps?: ComponentProps<typeof Scrubber>;
  scrubberContext?: ScrubberContextValue;
  width?: number;
  height?: number;
} = {}) =>
  render(
    <Wrapper>
      <CartesianChart series={sampleSeries} width={width} height={height}>
        <ScrubberContextProvider value={scrubberContext}>
          <Scrubber {...scrubberProps} />
        </ScrubberContextProvider>
      </CartesianChart>
    </Wrapper>,
  );

describe('DefaultScrubberTooltip', () => {
  it('renders nothing when no scrubber position is active', () => {
    const { queryByTestId } = renderTooltip({
      scrubberProps: {
        tooltip: () => ({ items: [{ label: 'Date', value: 'Jan' }] }),
      },
      scrubberContext: idleScrubberContext,
    });
    expect(queryByTestId('chart-tooltip')).toBeNull();
  });

  it('renders nothing when items callback returns an empty array', () => {
    const { queryByTestId } = renderTooltip({
      scrubberProps: { tooltip: () => ({ items: [] }) },
    });
    expect(queryByTestId('chart-tooltip')).toBeNull();
  });

  it('renders the tooltip group when scrubber is active and items are provided', () => {
    const { getByTestId } = renderTooltip({
      scrubberProps: {
        tooltip: () => ({ items: [{ label: 'Date', value: 'Jan' }] }),
      },
    });
    expect(getByTestId('chart-tooltip')).toBeTruthy();
  });

  it('renders the background rect', () => {
    const { getByTestId } = renderTooltip({
      scrubberProps: {
        tooltip: () => ({ items: [{ label: 'Date', value: 'Jan' }] }),
      },
    });
    expect(getByTestId('chart-tooltip-rect')).toBeTruthy();
  });

  it('renders item label and value text', () => {
    const { getByText } = renderTooltip({
      scrubberProps: {
        tooltip: () => ({ items: [{ label: 'Date', value: 'Jan' }] }),
      },
    });
    expect(getByText('Date')).toBeTruthy();
    expect(getByText('Jan')).toBeTruthy();
  });

  it('renders multiple items', () => {
    const { getByText } = renderTooltip({
      scrubberProps: {
        tooltip: () => ({
          items: [
            { label: 'Date', value: 'Jan' },
            { label: 'Price', value: '$10' },
          ],
        }),
      },
    });
    expect(getByText('Date')).toBeTruthy();
    expect(getByText('Jan')).toBeTruthy();
    expect(getByText('Price')).toBeTruthy();
    expect(getByText('$10')).toBeTruthy();
  });

  it('passes the active data index to the tooltip callback', () => {
    const tooltip = jest.fn().mockReturnValue({
      items: [{ label: 'i', value: '0' }],
    }) as unknown as (index: number) => ScrubberTooltipContent;
    renderTooltip({ scrubberProps: { tooltip } });
    expect(tooltip).toHaveBeenCalledWith(
      activeScrubberContext.scrubberPosition,
    );
  });

  it('suppresses the tooltip when items returns empty for the active index', () => {
    const { queryByTestId } = renderTooltip({
      scrubberProps: { tooltip: () => ({ items: [] }) },
    });
    expect(queryByTestId('chart-tooltip')).toBeNull();
  });

  describe('positioning logic', () => {
    const defaultTooltip = (): ScrubberTooltipContent => ({
      items: [{ label: 'Date', value: 'Jan' }],
    });

    const scrubberAt = (position: number): ScrubberContextValue => ({
      enableScrubbing: true,
      scrubberPosition: position,
      onScrubberPositionChange: () => undefined,
    });

    it('places tooltip to the right of the scrubber when mid-chart', () => {
      const { getByTestId } = renderTooltip({
        scrubberProps: { tooltip: defaultTooltip },
        scrubberContext: scrubberAt(2),
      });
      expect(getByTestId('chart-tooltip-rect').props.x).toBe(210);
    });

    it('flips tooltip left when right side would overflow (index 3)', () => {
      const { getByTestId } = renderTooltip({
        scrubberProps: {
          tooltip: () => ({ ...defaultTooltip(), minWidth: 120 }),
        },
        scrubberContext: scrubberAt(3),
      });
      expect(getByTestId('chart-tooltip-rect').props.x).toBe(160);
    });

    it('flips at the rightmost scrubber position (index 4)', () => {
      const { getByTestId } = renderTooltip({
        scrubberProps: {
          tooltip: () => ({ ...defaultTooltip(), minWidth: 120 }),
        },
        scrubberContext: scrubberAt(4),
      });
      expect(getByTestId('chart-tooltip-rect').props.x).toBe(250);
    });

    it('custom offset shifts the no-flip tooltip position', () => {
      const { getByTestId } = renderTooltip({
        scrubberProps: {
          tooltip: () => ({ ...defaultTooltip(), offset: 20 }),
        },
        scrubberContext: scrubberAt(2),
      });
      expect(getByTestId('chart-tooltip-rect').props.x).toBe(220);
    });

    it('wider minWidth can trigger a flip that the default width would not', () => {
      const { getByTestId } = renderTooltip({
        scrubberProps: {
          tooltip: () => ({ ...defaultTooltip(), minWidth: 200 }),
        },
        scrubberContext: scrubberAt(2),
      });
      expect(getByTestId('chart-tooltip-rect').props.x).toBe(20);
    });
  });

  describe('title in tooltip content', () => {
    it('renders a static string title', () => {
      const { getByTestId, getByText } = renderTooltip({
        scrubberProps: {
          tooltip: () => ({
            title: 'My Title',
            items: [{ label: 'T', value: 'V' }],
          }),
        },
      });
      expect(getByTestId('chart-tooltip-title')).toBeTruthy();
      expect(getByText('My Title')).toBeTruthy();
    });

    it('renders the title returned by a callback', () => {
      const { getByTestId } = renderTooltip({
        scrubberProps: {
          tooltip: () => ({
            title: (i: number) => `Index ${i}`,
            items: [{ label: 'T', value: 'V' }],
          }),
        },
      });
      expect(getByTestId('chart-tooltip-title')).toBeTruthy();
    });

    it('passes the active data index to the title callback', () => {
      const title = jest.fn().mockReturnValue('Title') as unknown as (
        index: number,
      ) => string;
      renderTooltip({
        scrubberProps: {
          tooltip: () => ({
            title,
            items: [{ label: 'T', value: 'V' }],
          }),
        },
      });
      expect(title).toHaveBeenCalledWith(
        activeScrubberContext.scrubberPosition,
      );
    });

    it('does not render a title element when title is undefined', () => {
      const { queryByTestId } = renderTooltip({
        scrubberProps: {
          tooltip: () => ({ items: [{ label: 'T', value: 'V' }] }),
        },
      });
      expect(queryByTestId('chart-tooltip-title')).toBeNull();
    });

    it('does not render a title element when title callback returns undefined', () => {
      const { queryByTestId } = renderTooltip({
        scrubberProps: {
          tooltip: () => ({
            title: () => undefined,
            items: [{ label: 'T', value: 'V' }],
          }),
        },
      });
      expect(queryByTestId('chart-tooltip-title')).toBeNull();
    });
  });
});

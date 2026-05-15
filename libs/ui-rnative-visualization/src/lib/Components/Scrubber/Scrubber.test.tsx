import { describe, expect, it } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { ThemeProvider } from '@ledgerhq/lumen-ui-rnative';
import { render } from '@testing-library/react-native';
import type { ReactNode, ComponentProps } from 'react';

import { CartesianChart } from '../CartesianChart';
import { ScrubberContextProvider } from './context';
import { Scrubber } from './Scrubber';
import type { ScrubberContextValue } from './types';

const sampleSeries = [
  { id: 's1', stroke: '#7B61FF', data: [10, 20, 30, 40, 50] },
  { id: 's2', stroke: '#44D7B6', data: [50, 40, 30, 20, 10] },
];

const Wrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='light'>
    {children}
  </ThemeProvider>
);

const activeScrubberContext = {
  enableScrubbing: true,
  scrubberPosition: 2,
  onScrubberPositionChange: () => undefined,
};

const renderScrubber = ({
  scrubberProps = {},
  scrubberContext = activeScrubberContext,
}: {
  scrubberProps?: ComponentProps<typeof Scrubber>;
  scrubberContext?: ScrubberContextValue;
} = {}) =>
  render(
    <Wrapper>
      <CartesianChart series={sampleSeries} width={400} height={200}>
        <ScrubberContextProvider value={scrubberContext}>
          <Scrubber {...scrubberProps} />
        </ScrubberContextProvider>
      </CartesianChart>
    </Wrapper>,
  );

describe('Scrubber', () => {
  it('renders nothing when no scrubber position is active', () => {
    const { queryByTestId } = renderScrubber({
      scrubberContext: {
        enableScrubbing: true,
        scrubberPosition: undefined,
        onScrubberPositionChange: () => undefined,
      },
    });
    expect(queryByTestId('scrubber')).toBeNull();
  });

  it('renders the scrubber group when a position is active', () => {
    const { getByTestId } = renderScrubber();
    expect(getByTestId('scrubber')).toBeTruthy();
  });

  it('renders the reference line by default', () => {
    const { getByTestId } = renderScrubber();
    expect(getByTestId('scrubber-line')).toBeTruthy();
  });

  it('hides the reference line when hideLine is true', () => {
    const { queryByTestId } = renderScrubber({
      scrubberProps: { hideLine: true },
    });
    expect(queryByTestId('scrubber-line')).toBeNull();
  });

  it('renders the overlay by default', () => {
    const { getByTestId } = renderScrubber();
    expect(getByTestId('scrubber-overlay')).toBeTruthy();
  });

  it('hides the overlay when hideOverlay is true', () => {
    const { queryByTestId } = renderScrubber({
      scrubberProps: { hideOverlay: true },
    });
    expect(queryByTestId('scrubber-overlay')).toBeNull();
  });

  it('does not render beacons by default', () => {
    const { queryAllByTestId } = renderScrubber();
    expect(queryAllByTestId(/scrubber-beacon-/)).toHaveLength(0);
  });

  it('renders one beacon per series when showBeacons is true', () => {
    const { getAllByTestId } = renderScrubber({
      scrubberProps: { showBeacons: true },
    });
    expect(getAllByTestId(/scrubber-beacon-/)).toHaveLength(2);
  });

  it('renders a label when a label function is provided', () => {
    const { getByTestId } = renderScrubber({
      scrubberProps: { label: (i: number) => `Index ${i}` },
    });
    expect(getByTestId('scrubber-label')).toBeTruthy();
  });

  it('does not render a label when no label function is provided', () => {
    const { queryByTestId } = renderScrubber();
    expect(queryByTestId('scrubber-label')).toBeNull();
  });

  it('renders chart tooltip when tooltip prop is set', () => {
    const { getByTestId } = renderScrubber({
      scrubberProps: {
        tooltip: () => ({ items: [{ label: 'L', value: 'V' }] }),
      },
    });
    expect(getByTestId('chart-tooltip')).toBeTruthy();
  });

  it('does not render chart tooltip when tooltip prop is not set', () => {
    const { queryByTestId } = renderScrubber();
    expect(queryByTestId('chart-tooltip')).toBeNull();
  });
});

import { describe, expect, it } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render } from '@testing-library/react-native';
import type { ReactNode, ComponentProps } from 'react';
import { Text } from 'react-native';
import { ThemeProvider } from '../../core/ThemeProvider';

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

  it('does not render beacon labels by default', () => {
    const { queryAllByTestId } = renderScrubber({
      scrubberProps: { showBeacons: true },
    });
    expect(queryAllByTestId(/scrubber-beacon-label-/)).toHaveLength(0);
  });

  it('renders a label per series and implies beacons when showBeaconLabel is true', () => {
    const { getAllByTestId } = renderScrubber({
      scrubberProps: { showBeaconLabel: true },
    });
    expect(getAllByTestId(/^scrubber-beacon-label-/)).toHaveLength(2);
    expect(getAllByTestId(/^scrubber-beacon-(?!label)/)).toHaveLength(2);
  });

  it('renders the custom beaconLabel content with series and value', () => {
    const { getByText } = renderScrubber({
      scrubberProps: {
        showBeaconLabel: true,
        beaconLabel: ({ series, value }) => (
          <Text>{`${series.id}:${value}`}</Text>
        ),
      },
    });
    expect(getByText('s1:30')).toBeTruthy();
    expect(getByText('s2:30')).toBeTruthy();
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

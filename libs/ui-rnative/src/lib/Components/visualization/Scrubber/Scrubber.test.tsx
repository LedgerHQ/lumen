import { describe, expect, it } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { fireEvent, render } from '@testing-library/react-native';
import type { ReactNode, ComponentProps } from 'react';
import { Text } from 'react-native';
import { ThemeProvider } from '../../core/ThemeProvider';

import { CartesianChart } from '../CartesianChart';
import { chartConfig } from '../config';
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

  it('sizes the default pill and reveals the label from native layout', () => {
    const { getByTestId } = renderScrubber({
      scrubberProps: { showBeaconLabel: true },
    });
    const getLabel = () => getByTestId('scrubber-beacon-label-s1');
    const layout = (width: number) => ({ nativeEvent: { layout: { width } } });

    expect(getLabel().props.opacity).toBe(0);

    const [text] = getLabel().findAll(
      (node: { type: unknown }) => node.type === 'Text',
    );
    fireEvent(text, 'layout', layout(40));
    const [rect] = getLabel().findAll(
      (node: { type: unknown }) => node.type === 'Rect',
    );
    expect(rect.props.width).toBe(40 + chartConfig.beaconLabel.paddingX * 2);

    fireEvent(getLabel(), 'layout', layout(56));
    expect(getLabel().props.opacity).toBe(1);
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

  it('rests beacons at the end of each line while idle', () => {
    const { getByTestId, queryByTestId } = renderScrubber({
      scrubberProps: { showBeacons: true },
      scrubberContext: {
        ...activeScrubberContext,
        scrubberPosition: undefined,
      },
    });
    expect(getByTestId('scrubber-beacon-s1')).toBeTruthy();
    expect(getByTestId('scrubber-beacon-s2')).toBeTruthy();
    expect(queryByTestId('scrubber-line')).toBeNull();
    expect(queryByTestId('scrubber-overlay')).toBeNull();
  });

  it('pulses only while idle and when idlePulse is true', () => {
    const idle = {
      ...activeScrubberContext,
      scrubberPosition: undefined,
    };
    const pulsing = renderScrubber({
      scrubberProps: { showBeacons: true, idlePulse: true },
      scrubberContext: idle,
    });
    expect(pulsing.queryAllByTestId('scrubber-pulse')).toHaveLength(2);
    pulsing.unmount();

    const scrubbing = renderScrubber({
      scrubberProps: { showBeacons: true, idlePulse: true },
    });
    expect(scrubbing.queryAllByTestId('scrubber-pulse')).toHaveLength(0);
  });

  it('does not pulse by default', () => {
    const { queryAllByTestId } = renderScrubber({
      scrubberProps: { showBeacons: true },
      scrubberContext: {
        ...activeScrubberContext,
        scrubberPosition: undefined,
      },
    });
    expect(queryAllByTestId('scrubber-pulse')).toHaveLength(0);
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

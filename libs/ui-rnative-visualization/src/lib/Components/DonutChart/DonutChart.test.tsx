import { describe, expect, it } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { ThemeProvider } from '@ledgerhq/lumen-ui-rnative';
import { render } from '@testing-library/react-native';

import { DonutChart } from './DonutChart';
import type { DonutSegment } from './types';

const sampleSeries: DonutSegment[] = [
  { id: 'bitcoin', label: 'Bitcoin', value: 50 },
  { id: 'ethereum', label: 'Ethereum', value: 30 },
  { id: 'tether', label: 'Tether', value: 20 },
];

const renderDonut = (props: Partial<React.ComponentProps<typeof DonutChart>>) =>
  render(
    <ThemeProvider themes={ledgerLiveThemes} colorScheme='light'>
      <DonutChart series={sampleSeries} {...props} />
    </ThemeProvider>,
  );

describe('DonutChart', () => {
  it('renders the ring', () => {
    const { getByTestId } = renderDonut({});
    getByTestId('donut-ring');
  });

  it('renders one segment path per series entry', () => {
    const { getAllByTestId } = renderDonut({});
    expect(getAllByTestId('donut-segment')).toHaveLength(3);
  });

  it('defaults to the md ring (168px)', () => {
    const { getByTestId } = renderDonut({});
    expect(getByTestId('donut-ring').props.width).toBe(168);
  });

  it('renders the sm ring (80px)', () => {
    const { getByTestId } = renderDonut({ size: 'sm' });
    expect(getByTestId('donut-ring').props.width).toBe(80);
  });

  it('renders the faint empty ring and no segments for an empty series', () => {
    const { getByTestId, queryByTestId } = renderDonut({ series: [] });
    getByTestId('donut-empty');
    expect(queryByTestId('donut-segment')).toBeNull();
  });

  it('renders the empty ring when every value is zero', () => {
    const { getByTestId, queryByTestId } = renderDonut({
      series: [
        { id: 'a', label: 'A', value: 0 },
        { id: 'b', label: 'B', value: 0 },
      ],
    });
    getByTestId('donut-empty');
    expect(queryByTestId('donut-segment')).toBeNull();
  });
});

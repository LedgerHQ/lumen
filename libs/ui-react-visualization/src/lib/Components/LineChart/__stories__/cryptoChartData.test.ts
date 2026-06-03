import { describe, expect, it } from 'vitest';

import {
  buildChartModel,
  createAxisDateFormatter,
  formatUsd,
  getMarkerColor,
  getMarkerTooltip,
  PERIODS,
  usdFormatter,
  type ChartMarker,
  type Period,
} from './cryptoChartData';

const PERIODS_BY_SPAN: Period[] = ['24H', '1W', '1M', '6M', '1Y', '5Y', 'All'];

const makeMarker = (
  transactions: ChartMarker['transactions'],
): ChartMarker => ({
  index: 10,
  transactions,
});

const totalTraded = (period: Period): number =>
  buildChartModel(period).markers.reduce(
    (sum, marker) =>
      sum + marker.transactions.reduce((acc, tx) => acc + tx.value, 0),
    0,
  );

describe('buildChartModel', () => {
  it('is deterministic across calls for the same period', () => {
    expect(buildChartModel('1Y')).toEqual(buildChartModel('1Y'));
  });

  it.each(PERIODS_BY_SPAN)(
    'produces a series matching the configured point count for %s',
    (period) => {
      const { data } = buildChartModel(period);
      expect(data).toHaveLength(PERIODS[period].points);
    },
  );

  it('reports high/low indices that match the series extrema', () => {
    const { data, highIndex, lowIndex } = buildChartModel('5Y');
    expect(data[highIndex]).toBe(Math.max(...data));
    expect(data[lowIndex]).toBe(Math.min(...data));
  });

  it('computes the average and trend direction from the series', () => {
    const { data, average, isPositive } = buildChartModel('6M');
    const expectedAverage =
      data.reduce((sum, value) => sum + value, 0) / data.length;
    expect(average).toBeCloseTo(expectedAverage);
    expect(isPositive).toBe(data[data.length - 1] >= data[0]);
  });

  it('keeps every marker within the drawable range and indexed', () => {
    const { data, markers, markerByIndex } = buildChartModel('1Y');
    for (const marker of markers) {
      expect(marker.index).toBeGreaterThanOrEqual(1);
      expect(marker.index).toBeLessThanOrEqual(data.length - 2);
      expect(markerByIndex.get(marker.index)).toBe(marker);
    }
  });

  it('returns five x ticks spanning the full series', () => {
    const { data, xTicks } = buildChartModel('1M');
    expect(xTicks).toHaveLength(5);
    expect(xTicks[0]).toBe(0);
    expect(xTicks[xTicks.length - 1]).toBe(data.length - 1);
  });

  it('treats each period as a superset of the narrower ones (canonical ledger)', () => {
    const totals = PERIODS_BY_SPAN.map(totalTraded);
    for (let i = 1; i < totals.length; i++) {
      expect(totals[i]).toBeGreaterThanOrEqual(totals[i - 1]);
    }
  });
});

describe('getMarkerColor', () => {
  it('uses the success token for a single buy', () => {
    expect(getMarkerColor(makeMarker([{ type: 'buy', value: 100 }]))).toBe(
      'var(--background-success-strong)',
    );
  });

  it('uses the error token for a single sell', () => {
    expect(getMarkerColor(makeMarker([{ type: 'sell', value: 100 }]))).toBe(
      'var(--background-error-strong)',
    );
  });

  it('uses the muted token for a cluster', () => {
    expect(
      getMarkerColor(
        makeMarker([
          { type: 'buy', value: 100 },
          { type: 'sell', value: 50 },
        ]),
      ),
    ).toBe('var(--background-muted-strong)');
  });
});

describe('getMarkerTooltip', () => {
  it('labels a single buy as "Received" with no title', () => {
    const tooltip = getMarkerTooltip(makeMarker([{ type: 'buy', value: 200 }]));
    expect(tooltip.title).toBeUndefined();
    expect(tooltip.items).toEqual([{ label: 'Received', value: '$200.00' }]);
  });

  it('labels a single sell as "Sent"', () => {
    const tooltip = getMarkerTooltip(makeMarker([{ type: 'sell', value: 75 }]));
    expect(tooltip.items).toEqual([{ label: 'Sent', value: '$75.00' }]);
  });

  it('sums a cluster by type and shows Received before Sent', () => {
    const tooltip = getMarkerTooltip(
      makeMarker([
        { type: 'buy', value: 100 },
        { type: 'sell', value: 50 },
        { type: 'buy', value: 25 },
      ]),
    );
    expect(tooltip.title).toBe('3 transactions');
    expect(tooltip.items).toEqual([
      { label: 'Received', value: '$125.00' },
      { label: 'Sent', value: '$50.00' },
    ]);
  });

  it('omits a type row when its cluster total is zero', () => {
    const tooltip = getMarkerTooltip(
      makeMarker([
        { type: 'buy', value: 100 },
        { type: 'buy', value: 40 },
      ]),
    );
    expect(tooltip.items).toEqual([{ label: 'Received', value: '$140.00' }]);
  });
});

describe('formatUsd', () => {
  it('formats with a currency symbol, grouping and two decimals', () => {
    expect(formatUsd(1234.5)).toBe('$1,234.50');
  });
});

describe('usdFormatter', () => {
  it('splits the value into the FormattedValue parts', () => {
    expect(usdFormatter(1234.5)).toEqual({
      integerPart: '1234',
      decimalPart: '50',
      currencyText: '$',
      decimalSeparator: '.',
      currencyPosition: 'start',
    });
  });
});

describe('createAxisDateFormatter', () => {
  it('formats the most recent tick using the reference date', () => {
    expect(createAxisDateFormatter('1M', 2)(1)).toBe('Jun 1');
  });

  it('formats in UTC regardless of the host timezone', () => {
    // The reference date is midnight UTC; only a UTC-pinned formatter renders
    // it as "12 AM", so this guards the determinism fix for snapshots.
    expect(createAxisDateFormatter('24H', 2)(1)).toBe('12 AM');
  });

  it('accepts a string tick value', () => {
    expect(createAxisDateFormatter('1M', 2)('1')).toBe('Jun 1');
  });
});

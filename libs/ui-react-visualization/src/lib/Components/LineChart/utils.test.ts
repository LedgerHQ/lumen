import { describe, expect, it } from 'vitest';

import type { Series } from '../../utils/types';
import { DEFAULT_AXIS_HEIGHT } from '../Axis';

import {
  computeAxisPadding,
  getChartDisplayState,
  hasValidSeriesData,
} from './utils';

const makeSeries = (data: (number | null)[]): Series => ({
  id: 'a',
  stroke: '#000',
  data,
});

describe('hasValidSeriesData', () => {
  it('returns false for undefined or empty series', () => {
    expect(hasValidSeriesData(undefined)).toBe(false);
    expect(hasValidSeriesData([])).toBe(false);
  });

  it('returns false when no series has at least two non-null points', () => {
    expect(hasValidSeriesData([makeSeries([1])])).toBe(false);
    expect(hasValidSeriesData([makeSeries([1, null])])).toBe(false);
    expect(hasValidSeriesData([makeSeries([null, null])])).toBe(false);
  });

  it('returns true once a series has two non-null points', () => {
    expect(hasValidSeriesData([makeSeries([1, 2])])).toBe(true);
  });

  it('ignores null gaps when counting valid points', () => {
    expect(hasValidSeriesData([makeSeries([1, null, 3])])).toBe(true);
  });

  it('returns true when any series is drawable', () => {
    expect(hasValidSeriesData([makeSeries([1]), makeSeries([1, 2, 3])])).toBe(
      true,
    );
  });

  it('treats a missing data array as no points', () => {
    expect(hasValidSeriesData([{ id: 'a', stroke: '#000' }])).toBe(false);
  });
});

describe('computeAxisPadding', () => {
  const base = {
    xAxisPosition: 'bottom' as const,
    yAxisPosition: 'start' as const,
    yAxisWidth: 40,
  };

  it('returns undefined when no axis is shown', () => {
    expect(
      computeAxisPadding({ ...base, showXAxis: false, showYAxis: false }),
    ).toBeUndefined();
  });

  it('reserves height on the side where the x-axis sits', () => {
    expect(
      computeAxisPadding({
        ...base,
        showXAxis: true,
        showYAxis: false,
        xAxisPosition: 'bottom',
      }),
    ).toEqual({ top: 0, bottom: DEFAULT_AXIS_HEIGHT, left: 0, right: 0 });

    expect(
      computeAxisPadding({
        ...base,
        showXAxis: true,
        showYAxis: false,
        xAxisPosition: 'top',
      }),
    ).toEqual({ top: DEFAULT_AXIS_HEIGHT, bottom: 0, left: 0, right: 0 });
  });

  it('reserves the y-axis width on the side where it sits', () => {
    expect(
      computeAxisPadding({
        ...base,
        showXAxis: false,
        showYAxis: true,
        yAxisPosition: 'start',
        yAxisWidth: 56,
      }),
    ).toEqual({ top: 0, bottom: 0, left: 56, right: 0 });

    expect(
      computeAxisPadding({
        ...base,
        showXAxis: false,
        showYAxis: true,
        yAxisPosition: 'end',
        yAxisWidth: 56,
      }),
    ).toEqual({ top: 0, bottom: 0, left: 0, right: 56 });
  });

  it('combines padding when both axes are shown', () => {
    expect(
      computeAxisPadding({
        showXAxis: true,
        showYAxis: true,
        xAxisPosition: 'bottom',
        yAxisPosition: 'start',
        yAxisWidth: 40,
      }),
    ).toEqual({ top: 0, bottom: DEFAULT_AXIS_HEIGHT, left: 40, right: 0 });
  });
});

describe('getChartDisplayState', () => {
  it('is initial-loading when loading with no data', () => {
    expect(
      getChartDisplayState({
        loading: true,
        hasData: false,
        emptyLabel: 'No data',
      }),
    ).toEqual({
      status: 'initial-loading',
      ariaLabel: 'Loading chart',
    });
  });

  it('is empty when not loading with no data', () => {
    expect(
      getChartDisplayState({
        loading: false,
        hasData: false,
        emptyLabel: 'Nothing here',
      }),
    ).toEqual({
      status: 'empty',
      ariaLabel: 'Nothing here',
    });
  });

  it('is transition-loading when loading with data', () => {
    expect(
      getChartDisplayState({
        loading: true,
        hasData: true,
        emptyLabel: 'No data',
      }),
    ).toEqual({
      status: 'transition-loading',
      ariaLabel: 'Loading chart',
    });
  });

  it('is ready with no aria label when data is present and not loading', () => {
    expect(
      getChartDisplayState({
        loading: false,
        hasData: true,
        emptyLabel: 'No data',
      }),
    ).toEqual({
      status: 'ready',
      ariaLabel: undefined,
    });
  });
});

import { describe, expect, it } from '@jest/globals';

import type { Series } from '../../utils/types';
import { DEFAULT_AXIS_HEIGHT } from '../Axis/XAxis';

import {
  canRenderLine,
  computeAxisPadding,
  getChartAriaLabel,
  getChartDisplayStates,
} from './utils';

const makeSeries = (data: (number | null)[]): Series => ({
  id: 'a',
  stroke: '#000',
  data,
});

describe('canRenderLine', () => {
  it('returns false for undefined or empty series', () => {
    expect(canRenderLine(undefined)).toBe(false);
    expect(canRenderLine([])).toBe(false);
  });

  it('returns false when no series has at least two finite points', () => {
    expect(canRenderLine([makeSeries([1])])).toBe(false);
    expect(canRenderLine([makeSeries([1, null])])).toBe(false);
    expect(canRenderLine([makeSeries([null, null])])).toBe(false);
  });

  it('returns true once a series has two finite points', () => {
    expect(canRenderLine([makeSeries([1, 2])])).toBe(true);
  });

  it('ignores null gaps when counting drawable points', () => {
    expect(canRenderLine([makeSeries([1, null, 3])])).toBe(true);
  });

  it('does not count NaN, Infinity, or holes as drawable points', () => {
    expect(canRenderLine([makeSeries([NaN, NaN])])).toBe(false);
    expect(canRenderLine([makeSeries([Infinity, -Infinity])])).toBe(false);
    expect(canRenderLine([makeSeries([NaN, 1])])).toBe(false);
    expect(
      canRenderLine([makeSeries([1, undefined as unknown as number, 2])]),
    ).toBe(true);
    expect(
      canRenderLine([makeSeries([1, undefined as unknown as number])]),
    ).toBe(false);
  });

  it('returns true when any series is drawable', () => {
    expect(canRenderLine([makeSeries([1]), makeSeries([1, 2, 3])])).toBe(true);
  });

  it('treats a missing data array as no points', () => {
    expect(canRenderLine([{ id: 'a', stroke: '#000' }])).toBe(false);
  });

  it('caps counted points to the x-axis domain length (like toScaledPoints)', () => {
    expect(canRenderLine([makeSeries([1, 2, 3])], ['Jan'])).toBe(false);
    expect(canRenderLine([makeSeries([1, 2, 3])], ['Jan', 'Feb'])).toBe(true);
  });

  it('does not reduce drawable points when xData is longer than the series', () => {
    expect(canRenderLine([makeSeries([1, 2])], ['a', 'b', 'c', 'd'])).toBe(
      true,
    );
  });

  it('counts only finite points within the capped range', () => {
    expect(canRenderLine([makeSeries([null, 2, 3])], ['Jan', 'Feb'])).toBe(
      false,
    );
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

describe('getChartDisplayStates', () => {
  it('is initial-loading when loading with no data', () => {
    expect(getChartDisplayStates({ loading: true, hasData: false })).toEqual({
      showPlaceholder: true,
      placeholderLoading: true,
      showEmptyOverlay: false,
      isTransitionLoading: false,
    });
  });

  it('is empty when not loading with no data', () => {
    expect(getChartDisplayStates({ loading: false, hasData: false })).toEqual({
      showPlaceholder: true,
      placeholderLoading: false,
      showEmptyOverlay: true,
      isTransitionLoading: false,
    });
  });

  it('is transition-loading when loading with data', () => {
    expect(getChartDisplayStates({ loading: true, hasData: true })).toEqual({
      showPlaceholder: false,
      placeholderLoading: false,
      showEmptyOverlay: false,
      isTransitionLoading: true,
    });
  });

  it('is ready when data is present and not loading', () => {
    expect(getChartDisplayStates({ loading: false, hasData: true })).toEqual({
      showPlaceholder: false,
      placeholderLoading: false,
      showEmptyOverlay: false,
      isTransitionLoading: false,
    });
  });
});

describe('getChartAriaLabel', () => {
  it('returns the loading label while loading, regardless of data', () => {
    expect(
      getChartAriaLabel({
        loading: true,
        hasData: false,
        emptyLabel: 'No data',
      }),
    ).toBe('Loading chart');
    expect(
      getChartAriaLabel({
        loading: true,
        hasData: true,
        emptyLabel: 'No data',
      }),
    ).toBe('Loading chart');
  });

  it('returns the empty label when not loading with no data', () => {
    expect(
      getChartAriaLabel({
        loading: false,
        hasData: false,
        emptyLabel: 'Nothing here',
      }),
    ).toBe('Nothing here');
  });

  it('returns undefined when data is present and not loading', () => {
    expect(
      getChartAriaLabel({
        loading: false,
        hasData: true,
        emptyLabel: 'No data',
      }),
    ).toBeUndefined();
  });
});

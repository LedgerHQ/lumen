import { describe, expect, it } from '@jest/globals';
import { renderHook } from '@testing-library/react-native';

import {
  isCategoricalScale,
  isNumericScale,
} from '../../../utils/scales/scales';
import type {
  ChartInset,
  ChartScaleFunction,
  Series,
} from '../../../utils/types';

import {
  buildScale,
  computeAxisRange,
  computeDrawingArea,
  useBuildChartContext,
} from './useBuildChartContext';

const makeSeries = (data: (number | null)[]): Series => ({
  id: 'test',
  stroke: '#000',
  data,
});

const DEFAULT_INSET: ChartInset = { top: 0, right: 0, bottom: 0, left: 0 };
const ZERO_PADDING: ChartInset = { top: 0, right: 0, bottom: 0, left: 0 };

const hookParams = (
  overrides: Partial<Parameters<typeof useBuildChartContext>[0]> = {},
) => ({
  series: [makeSeries([10, 20, 30])],
  width: 400,
  height: 200,
  inset: DEFAULT_INSET,
  axisPadding: ZERO_PADDING,
  ...overrides,
});

describe('computeAxisRange', () => {
  it('computes x range from drawing area', () => {
    const { xRange } = computeAxisRange({
      x: 10,
      y: 0,
      width: 100,
      height: 50,
    });
    expect(xRange).toEqual({ min: 10, max: 110 });
  });

  it('inverts y range for SVG coordinates', () => {
    const { yRange } = computeAxisRange({
      x: 0,
      y: 10,
      width: 100,
      height: 200,
    });
    expect(yRange).toEqual({ min: 210, max: 10 });
  });
});

describe('buildScale', () => {
  const range = { min: 0, max: 400 };

  it('builds a numeric linear scale by default', () => {
    const scale = buildScale({ min: 0, max: 100 }, range);
    expect(isNumericScale(scale)).toBe(true);
  });

  it('builds a numeric log scale', () => {
    const scale = buildScale({ min: 1, max: 100 }, range, 'log');
    expect(isNumericScale(scale)).toBe(true);
  });

  it('builds a categorical band scale', () => {
    const scale = buildScale({ min: 0, max: 2 }, range, 'band');
    expect(isCategoricalScale(scale)).toBe(true);
  });
});

describe('computeDrawingArea', () => {
  it('subtracts inset from available space', () => {
    const inset: ChartInset = { top: 10, right: 20, bottom: 30, left: 40 };
    const area = computeDrawingArea(400, 200, inset, ZERO_PADDING);
    expect(area).toEqual({ x: 40, y: 10, width: 340, height: 160 });
  });

  it('combines inset and axis padding', () => {
    const inset: ChartInset = { top: 5, right: 5, bottom: 5, left: 5 };
    const axisPad: ChartInset = { top: 0, right: 0, bottom: 28, left: 40 };
    const area = computeDrawingArea(400, 200, inset, axisPad);
    expect(area).toEqual({ x: 45, y: 5, width: 350, height: 162 });
  });

  it('clamps negative dimensions to zero', () => {
    const huge: ChartInset = { top: 100, right: 100, bottom: 100, left: 100 };
    const area = computeDrawingArea(50, 50, huge, ZERO_PADDING);
    expect(area.width).toBe(0);
    expect(area.height).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Hook integration tests
// ---------------------------------------------------------------------------

describe('useBuildChartContext', () => {
  it('returns undefined scales when drawing area is zero', () => {
    const { result } = renderHook(() =>
      useBuildChartContext(hookParams({ width: 0, height: 0 })),
    );
    expect(result.current.getXScale()).toBeUndefined();
    expect(result.current.getYScale()).toBeUndefined();
  });

  it('creates linear scales by default', () => {
    const { result } = renderHook(() => useBuildChartContext(hookParams()));
    const xScale = result.current.getXScale();
    const yScale = result.current.getYScale();
    expect(xScale).toBeDefined();
    expect(yScale).toBeDefined();
    expect(isNumericScale(xScale as ChartScaleFunction)).toBe(true);
    expect(isNumericScale(yScale as ChartScaleFunction)).toBe(true);
  });

  it('creates a band scale when scaleType is band', () => {
    const { result } = renderHook(() =>
      useBuildChartContext(hookParams({ xAxis: { scaleType: 'band' } })),
    );
    expect(
      isCategoricalScale(result.current.getXScale() as ChartScaleFunction),
    ).toBe(true);
  });

  it('computes data length from series', () => {
    const { result } = renderHook(() =>
      useBuildChartContext(
        hookParams({ series: [makeSeries([1, 2, 3, 4, 5])] }),
      ),
    );
    expect(result.current.dataLength).toBe(5);
  });

  it('computes data length from axis data when provided', () => {
    const { result } = renderHook(() =>
      useBuildChartContext(
        hookParams({ xAxis: { data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] } }),
      ),
    );
    expect(result.current.dataLength).toBe(5);
  });

  it('applies domain overrides', () => {
    const { result } = renderHook(() =>
      useBuildChartContext(
        hookParams({ yAxis: { domain: { min: 0, max: 100 } } }),
      ),
    );
    const yScale = result.current.getYScale()!;
    expect(isNumericScale(yScale)).toBe(true);
    expect(yScale.domain()).toEqual([0, 100]);
  });

  it('applies domain function overrides', () => {
    const { result } = renderHook(() =>
      useBuildChartContext(
        hookParams({
          yAxis: {
            domain: (bounds: { min: number; max: number }) => ({
              min: bounds.min - 5,
              max: bounds.max + 5,
            }),
          },
        }),
      ),
    );
    const domain = result.current.getYScale()!.domain();
    expect(domain[0]).toBe(0);
    expect(domain[1]).toBe(40);
  });

  it('inverts Y range for SVG coordinates', () => {
    const { result } = renderHook(() =>
      useBuildChartContext(
        hookParams({
          inset: { top: 10, right: 0, bottom: 0, left: 0 },
        }),
      ),
    );
    const yScale = result.current.getYScale()!;
    const range = yScale.range();
    expect(range[0]).toBeGreaterThan(range[1]);
  });

  it('exposes series and axis configs', () => {
    const series = [makeSeries([1, 2])];
    const xAxis = { scaleType: 'linear' as const };
    const { result } = renderHook(() =>
      useBuildChartContext(hookParams({ series, xAxis })),
    );
    expect(result.current.series).toBe(series);
    expect(result.current.getXAxisConfig()).toBe(xAxis);
  });

  it('builds a seriesMap for lookups', () => {
    const series = [makeSeries([1, 2])];
    const { result } = renderHook(() =>
      useBuildChartContext(hookParams({ series })),
    );
    expect(result.current.seriesMap.get('test')).toBe(series[0]);
    expect(result.current.seriesMap.size).toBe(1);
  });

  it('applies static axisPadding to drawingArea', () => {
    const axisPadding: ChartInset = { top: 0, right: 0, bottom: 28, left: 40 };
    const { result } = renderHook(() =>
      useBuildChartContext(hookParams({ axisPadding })),
    );
    expect(result.current.drawingArea.x).toBe(40);
    expect(result.current.drawingArea.width).toBe(400 - 40);
    expect(result.current.drawingArea.height).toBe(200 - 28);
  });
});

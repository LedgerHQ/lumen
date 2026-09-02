import { describe, expect, it } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { ThemeProvider } from '@ledgerhq/lumen-ui-rnative';
import { renderHook } from '@testing-library/react-native';

import type { DonutSegment } from '../types';
import { useContrastSafeSeries } from './useContrastSafeSeries';

const createWrapper =
  (colorScheme: 'light' | 'dark') =>
  ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider themes={ledgerLiveThemes} colorScheme={colorScheme}>
      {children}
    </ThemeProvider>
  );

const series: DonutSegment[] = [
  { id: 'near-white', label: 'Near white', value: 50, color: '#f5f5f5' },
  { id: 'black', label: 'Black', value: 30, color: '#000000' },
  { id: 'colorless', label: 'Colorless', value: 20 },
];

describe('useContrastSafeSeries', () => {
  it('returns the series untouched when disabled', () => {
    const { result } = renderHook(() => useContrastSafeSeries(series, false), {
      wrapper: createWrapper('light'),
    });

    expect(result.current).toBe(series);
  });

  it('darkens colors too close to the light surface', () => {
    const { result } = renderHook(() => useContrastSafeSeries(series, true), {
      wrapper: createWrapper('light'),
    });

    expect(result.current.map((segment) => segment.color)).toEqual([
      '#cccccc',
      '#000000',
      undefined,
    ]);
  });

  it('lightens colors too close to the dark surface', () => {
    const { result } = renderHook(() => useContrastSafeSeries(series, true), {
      wrapper: createWrapper('dark'),
    });

    expect(result.current.map((segment) => segment.color)).toEqual([
      '#f5f5f5',
      '#333333',
      undefined,
    ]);
  });

  it('keeps every other segment field', () => {
    const { result } = renderHook(() => useContrastSafeSeries(series, true), {
      wrapper: createWrapper('light'),
    });

    expect(result.current[0]).toEqual({
      id: 'near-white',
      label: 'Near white',
      value: 50,
      color: '#cccccc',
    });
  });
});

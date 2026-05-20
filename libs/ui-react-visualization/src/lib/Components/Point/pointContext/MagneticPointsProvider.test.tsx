import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';

import { useMagneticPointsContext } from './magneticPointsContext';
import { MagneticPointsProvider } from './MagneticPointsProvider';

const wrapper = ({ children }: { children: ReactNode }) => (
  <MagneticPointsProvider>{children}</MagneticPointsProvider>
);

describe('MagneticPointsProvider', () => {
  it('starts with an empty set', () => {
    const { result } = renderHook(() => useMagneticPointsContext(), {
      wrapper,
    });
    expect(result.current.getMagneticPoints().size).toBe(0);
  });

  it('registers a magnetic point', () => {
    const { result } = renderHook(() => useMagneticPointsContext(), {
      wrapper,
    });

    act(() => {
      result.current.register(3);
    });

    expect(result.current.getMagneticPoints().has(3)).toBe(true);
    expect(result.current.getMagneticPoints().size).toBe(1);
  });

  it('registers multiple magnetic points', () => {
    const { result } = renderHook(() => useMagneticPointsContext(), {
      wrapper,
    });

    act(() => {
      result.current.register(2);
      result.current.register(7);
    });

    const points = result.current.getMagneticPoints();
    expect(points.has(2)).toBe(true);
    expect(points.has(7)).toBe(true);
    expect(points.size).toBe(2);
  });

  it('unregisters a magnetic point', () => {
    const { result } = renderHook(() => useMagneticPointsContext(), {
      wrapper,
    });

    act(() => {
      result.current.register(5);
      result.current.register(8);
    });

    act(() => {
      result.current.unregister(5);
    });

    const points = result.current.getMagneticPoints();
    expect(points.has(5)).toBe(false);
    expect(points.has(8)).toBe(true);
    expect(points.size).toBe(1);
  });

  it('handles duplicate registrations gracefully', () => {
    const { result } = renderHook(() => useMagneticPointsContext(), {
      wrapper,
    });

    act(() => {
      result.current.register(4);
      result.current.register(4);
    });

    expect(result.current.getMagneticPoints().size).toBe(1);
  });

  it('handles unregistering a non-existent point gracefully', () => {
    const { result } = renderHook(() => useMagneticPointsContext(), {
      wrapper,
    });

    act(() => {
      result.current.unregister(99);
    });

    expect(result.current.getMagneticPoints().size).toBe(0);
  });
});

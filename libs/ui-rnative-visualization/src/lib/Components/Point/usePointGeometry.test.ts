import { describe, expect, it, jest } from '@jest/globals';
import { renderHook } from '@testing-library/react-native';

import type { BaseAxisProps } from '../Axis';
import { useMagneticRegistration } from './usePointGeometry';

const makeContext = () => ({
  register: jest.fn(),
  unregister: jest.fn(),
  version: 0,
  getMagneticPoints: () => new Set<number>(),
});

const noAxisConfig = (): BaseAxisProps | undefined => undefined;

describe('useMagneticRegistration', () => {
  it('registers the data index when magnetic is true', () => {
    const ctx = makeContext();
    renderHook(() => useMagneticRegistration(true, 3, noAxisConfig, ctx));

    expect(ctx.register).toHaveBeenCalledWith(3);
  });

  it('does not register when magnetic is false', () => {
    const ctx = makeContext();
    renderHook(() => useMagneticRegistration(false, 3, noAxisConfig, ctx));

    expect(ctx.register).not.toHaveBeenCalled();
  });

  it('unregisters on unmount', () => {
    const ctx = makeContext();
    const { unmount } = renderHook(() =>
      useMagneticRegistration(true, 3, noAxisConfig, ctx),
    );

    unmount();
    expect(ctx.unregister).toHaveBeenCalledWith(3);
  });

  it('resolves dataX through axis config data when provided', () => {
    const ctx = makeContext();
    const getXAxisConfig = (): BaseAxisProps => ({
      scaleType: 'band',
      data: [100, 200, 300],
    });

    renderHook(() => useMagneticRegistration(true, 200, getXAxisConfig, ctx));

    expect(ctx.register).toHaveBeenCalledWith(1);
  });

  it('does not register when axis data exists but does not contain the value', () => {
    const ctx = makeContext();
    const getXAxisConfig = (): BaseAxisProps => ({
      scaleType: 'band',
      data: [100, 200, 300],
    });

    renderHook(() => useMagneticRegistration(true, 999, getXAxisConfig, ctx));

    expect(ctx.register).not.toHaveBeenCalled();
  });

  it('re-registers when dataX changes', () => {
    const ctx = makeContext();
    const { rerender } = renderHook(
      ({ dataX }: { dataX: number }) =>
        useMagneticRegistration(true, dataX, noAxisConfig, ctx),
      { initialProps: { dataX: 2 } },
    );

    expect(ctx.register).toHaveBeenCalledWith(2);

    rerender({ dataX: 4 });

    expect(ctx.unregister).toHaveBeenCalledWith(2);
    expect(ctx.register).toHaveBeenCalledWith(4);
  });

  it('unregisters and stops when magnetic switches to false', () => {
    const ctx = makeContext();
    const { rerender } = renderHook(
      ({ magnetic }: { magnetic: boolean }) =>
        useMagneticRegistration(magnetic, 3, noAxisConfig, ctx),
      { initialProps: { magnetic: true } },
    );

    expect(ctx.register).toHaveBeenCalledWith(3);

    rerender({ magnetic: false });

    expect(ctx.unregister).toHaveBeenCalledWith(3);
  });
});

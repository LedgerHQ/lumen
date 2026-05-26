import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { AxisConfigProps } from '../../utils/types';
import { ARROW_HEIGHT, ARROW_WIDTH, GAP, LABEL_FONT_SIZE } from './constants';
import {
  buildArrowPoints,
  computeLabelY,
  isWithinBounds,
  resolveLabel,
  useMagneticRegistration,
} from './utils';

describe('isWithinBounds', () => {
  const area = { x: 10, y: 20, width: 100, height: 50 };

  it('returns true for a point inside the area', () => {
    expect(isWithinBounds(50, 40, area)).toBe(true);
  });

  it('returns true on the top-left edge', () => {
    expect(isWithinBounds(10, 20, area)).toBe(true);
  });

  it('returns true on the bottom-right edge', () => {
    expect(isWithinBounds(110, 70, area)).toBe(true);
  });

  it('returns false when x is left of the area', () => {
    expect(isWithinBounds(9, 40, area)).toBe(false);
  });

  it('returns false when x is right of the area', () => {
    expect(isWithinBounds(111, 40, area)).toBe(false);
  });

  it('returns false when y is above the area', () => {
    expect(isWithinBounds(50, 19, area)).toBe(false);
  });

  it('returns false when y is below the area', () => {
    expect(isWithinBounds(50, 71, area)).toBe(false);
  });
});

describe('buildArrowPoints', () => {
  const cx = 100;
  const cy = 200;
  const radius = 5;
  const halfW = ARROW_WIDTH / 2;

  it('builds a downward-pointing arrow for top position', () => {
    const result = buildArrowPoints(cx, cy, radius, 'top');
    const tipY = cy - radius - GAP;
    const baseY = tipY - ARROW_HEIGHT;
    expect(result).toBe(
      `${cx},${tipY} ${cx - halfW},${baseY} ${cx + halfW},${baseY}`,
    );
  });

  it('builds an upward-pointing arrow for bottom position', () => {
    const result = buildArrowPoints(cx, cy, radius, 'bottom');
    const tipY = cy + radius + GAP;
    const baseY = tipY + ARROW_HEIGHT;
    expect(result).toBe(
      `${cx},${tipY} ${cx - halfW},${baseY} ${cx + halfW},${baseY}`,
    );
  });
});

describe('resolveLabel', () => {
  it('returns a string label as-is', () => {
    expect(resolveLabel('Peak', 0)).toBe('Peak');
  });

  it('calls a function label with dataX', () => {
    expect(resolveLabel((i) => `#${i}`, 3)).toBe('#3');
  });

  it('returns undefined for an undefined label', () => {
    expect(resolveLabel(undefined, 0)).toBeUndefined();
  });

  it('returns undefined for an empty string', () => {
    expect(resolveLabel('', 0)).toBeUndefined();
  });

  it('returns undefined when a function returns an empty string', () => {
    expect(resolveLabel(() => '', 0)).toBeUndefined();
  });
});

describe('computeLabelY', () => {
  const pixelY = 100;
  const radius = 5;

  it('positions label above the point when labelPosition is top with arrow', () => {
    const result = computeLabelY(pixelY, radius, 'top', true);
    const arrowOffset = ARROW_HEIGHT + GAP;
    expect(result).toBe(pixelY - radius - arrowOffset - GAP);
  });

  it('positions label above the point when labelPosition is top without arrow', () => {
    const result = computeLabelY(pixelY, radius, 'top', false);
    expect(result).toBe(pixelY - radius - GAP - GAP);
  });

  it('positions label below the point when labelPosition is bottom with arrow', () => {
    const result = computeLabelY(pixelY, radius, 'bottom', true);
    const arrowOffset = ARROW_HEIGHT + GAP;
    expect(result).toBe(pixelY + radius + arrowOffset + GAP + LABEL_FONT_SIZE);
  });

  it('positions label below the point when labelPosition is bottom without arrow', () => {
    const result = computeLabelY(pixelY, radius, 'bottom', false);
    expect(result).toBe(pixelY + radius + GAP + GAP + LABEL_FONT_SIZE);
  });
});

const makeContext = () => ({
  register: vi.fn(),
  unregister: vi.fn(),
  getMagneticPoints: () => new Set<number>(),
});

const noAxisConfig = (): AxisConfigProps | undefined => undefined;

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
    const getXAxisConfig = (): AxisConfigProps => ({
      scaleType: 'band',
      data: [100, 200, 300],
    });

    renderHook(() => useMagneticRegistration(true, 200, getXAxisConfig, ctx));

    expect(ctx.register).toHaveBeenCalledWith(1);
  });

  it('falls back to dataX when axis data does not contain the value', () => {
    const ctx = makeContext();
    const getXAxisConfig = (): AxisConfigProps => ({
      scaleType: 'band',
      data: [100, 200, 300],
    });

    renderHook(() => useMagneticRegistration(true, 999, getXAxisConfig, ctx));

    expect(ctx.register).toHaveBeenCalledWith(999);
  });

  it('re-registers when dataX changes', () => {
    const ctx = makeContext();
    const { rerender } = renderHook(
      ({ dataX }) => useMagneticRegistration(true, dataX, noAxisConfig, ctx),
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
      ({ magnetic }) => useMagneticRegistration(magnetic, 3, noAxisConfig, ctx),
      { initialProps: { magnetic: true } },
    );

    expect(ctx.register).toHaveBeenCalledWith(3);

    rerender({ magnetic: false });

    expect(ctx.unregister).toHaveBeenCalledWith(3);
  });
});

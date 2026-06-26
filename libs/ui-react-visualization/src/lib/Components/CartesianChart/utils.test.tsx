import { describe, expect, it } from 'vitest';

import { ZERO_PADDING, resolveAxisPadding, resolveInset } from './utils';

describe('resolveInset', () => {
  it('should return ZERO_PADDING when undefined', () => {
    expect(resolveInset(undefined)).toEqual(ZERO_PADDING);
  });

  it('should resolve a uniform number', () => {
    expect(resolveInset(10)).toEqual({
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
    });
  });

  it('should handle zero as a uniform number', () => {
    expect(resolveInset(0)).toEqual(ZERO_PADDING);
  });

  it('should handle negative uniform values', () => {
    expect(resolveInset(-5)).toEqual({
      top: -5,
      right: -5,
      bottom: -5,
      left: -5,
    });
  });

  it('should resolve a full partial object', () => {
    expect(resolveInset({ top: 10, right: 15, bottom: 20, left: 25 })).toEqual({
      top: 10,
      right: 15,
      bottom: 20,
      left: 25,
    });
  });

  it('should treat missing sides as 0 when given a partial object', () => {
    expect(resolveInset({ top: 10 })).toEqual({
      top: 10,
      right: 0,
      bottom: 0,
      left: 0,
    });
  });

  it('should handle an empty object', () => {
    expect(resolveInset({})).toEqual(ZERO_PADDING);
  });
});

describe('resolveAxisPadding', () => {
  it('should return ZERO_PADDING when undefined', () => {
    expect(resolveAxisPadding(undefined)).toEqual(ZERO_PADDING);
  });

  it('should resolve a full padding object', () => {
    expect(
      resolveAxisPadding({ top: 5, right: 10, bottom: 15, left: 20 }),
    ).toEqual({
      top: 5,
      right: 10,
      bottom: 15,
      left: 20,
    });
  });

  it('should treat missing sides as 0', () => {
    expect(resolveAxisPadding({ bottom: 30 })).toEqual({
      top: 0,
      right: 0,
      bottom: 30,
      left: 0,
    });
  });

  it('should handle an empty object', () => {
    expect(resolveAxisPadding({})).toEqual(ZERO_PADDING);
  });
});

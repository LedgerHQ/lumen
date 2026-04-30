import { describe, expect, it } from 'vitest';

import {
  OVERFLOW_BUFFER,
  ZERO_PADDING,
  resolveAxisPadding,
  resolveInset,
} from './utils';

describe('resolveInset', () => {
  it('should return DEFAULT_INSET when undefined', () => {
    expect(resolveInset(undefined)).toEqual(OVERFLOW_BUFFER);
  });

  it('should add a uniform number to each default side', () => {
    expect(resolveInset(10)).toEqual({
      top: 10 + OVERFLOW_BUFFER.top,
      right: 10 + OVERFLOW_BUFFER.right,
      bottom: 10 + OVERFLOW_BUFFER.bottom,
      left: 10 + OVERFLOW_BUFFER.left,
    });
  });

  it('should handle zero as a uniform number', () => {
    expect(resolveInset(0)).toEqual(OVERFLOW_BUFFER);
  });

  it('should handle negative uniform values', () => {
    expect(resolveInset(-5)).toEqual({
      top: -5 + OVERFLOW_BUFFER.top,
      right: -5 + OVERFLOW_BUFFER.right,
      bottom: -5 + OVERFLOW_BUFFER.bottom,
      left: -5 + OVERFLOW_BUFFER.left,
    });
  });

  it('should merge a full partial object with defaults', () => {
    expect(resolveInset({ top: 10, right: 15, bottom: 20, left: 25 })).toEqual({
      top: 10 + OVERFLOW_BUFFER.top,
      right: 15 + OVERFLOW_BUFFER.right,
      bottom: 20 + OVERFLOW_BUFFER.bottom,
      left: 25 + OVERFLOW_BUFFER.left,
    });
  });

  it('should treat missing sides as 0 when given a partial object', () => {
    expect(resolveInset({ top: 10 })).toEqual({
      top: 10 + OVERFLOW_BUFFER.top,
      right: OVERFLOW_BUFFER.right,
      bottom: OVERFLOW_BUFFER.bottom,
      left: OVERFLOW_BUFFER.left,
    });
  });

  it('should handle an empty object', () => {
    expect(resolveInset({})).toEqual(OVERFLOW_BUFFER);
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

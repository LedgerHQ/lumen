import { shallowEqual } from './shallowEqual';

describe('shallowEqual', () => {
  it('returns true for the same reference', () => {
    const obj = { a: 1 };
    expect(shallowEqual(obj, obj)).toBe(true);
  });

  it('returns true for objects with identical primitive values', () => {
    expect(shallowEqual({ a: 1, b: 'x' }, { a: 1, b: 'x' })).toBe(true);
  });

  it('returns false when values differ', () => {
    expect(shallowEqual({ a: 1 }, { a: 2 })).toBe(false);
  });

  it('returns false when key counts differ', () => {
    expect(
      shallowEqual({ a: 1 } as Record<string, unknown>, { a: 1, b: 2 }),
    ).toBe(false);
  });

  it('returns false when keys differ', () => {
    expect(
      shallowEqual(
        { a: 1 } as Record<string, unknown>,
        { b: 1 } as Record<string, unknown>,
      ),
    ).toBe(false);
  });

  it('returns true when both objects are empty', () => {
    expect(shallowEqual({}, {})).toBe(true);
  });

  it('does not perform deep comparison on nested objects', () => {
    const inner = { nested: true };
    expect(shallowEqual({ a: inner }, { a: inner })).toBe(true);
    expect(shallowEqual({ a: { nested: true } }, { a: { nested: true } })).toBe(
      false,
    );
  });

  it('uses Object.is semantics (NaN === NaN, +0 !== -0)', () => {
    expect(shallowEqual({ a: NaN }, { a: NaN })).toBe(true);
    expect(shallowEqual({ a: +0 }, { a: -0 })).toBe(false);
  });
});

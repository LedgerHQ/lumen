import { renderHook } from '@testing-library/react';
import { createRef } from 'react';
import type { Ref } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { assignRef, mergeRefs, useMergedRef } from './useMergeRef';

describe('assignRef', () => {
  it('calls a function ref with the value', () => {
    const ref = vi.fn();
    assignRef(ref, 'node');
    expect(ref).toHaveBeenCalledWith('node');
  });

  it('sets current on an object ref', () => {
    const ref = createRef<string>();
    assignRef(ref, 'node');
    expect(ref.current).toBe('node');
  });

  it('ignores null and undefined refs', () => {
    expect(() => assignRef(null, 'node')).not.toThrow();
    expect(() => assignRef(undefined, 'node')).not.toThrow();
  });

  it('returns the cleanup of a function ref', () => {
    const cleanup = vi.fn();
    expect(assignRef(() => cleanup, 'node')).toBe(cleanup);
  });
});

describe('mergeRefs', () => {
  it('forwards the node to every ref', () => {
    const fnRef = vi.fn();
    const objectRef = createRef<string>();
    const merged = mergeRefs<string>(fnRef, objectRef, null, undefined);

    merged('node');

    expect(fnRef).toHaveBeenCalledWith('node');
    expect(objectRef.current).toBe('node');
  });

  it('resets every ref to null on detach', () => {
    const fnRef = vi.fn();
    const objectRef = createRef<string>();
    const merged = mergeRefs<string>(fnRef, objectRef);

    merged('node');
    merged(null);

    expect(fnRef).toHaveBeenLastCalledWith(null);
    expect(objectRef.current).toBeNull();
  });

  it('runs function ref cleanups on detach', () => {
    const cleanup = vi.fn();
    const ref = vi.fn(() => cleanup);
    const merged = mergeRefs<string>(ref);

    merged('node');
    expect(cleanup).not.toHaveBeenCalled();

    merged(null);
    expect(cleanup).toHaveBeenCalledTimes(1);

    merged(null);
    expect(cleanup).toHaveBeenCalledTimes(1);
  });
});

describe('useMergedRef', () => {
  it('returns a callback that assigns all refs', () => {
    const fnRef = vi.fn();
    const objectRef = createRef<string>();
    const { result } = renderHook(() => useMergedRef<string>(fnRef, objectRef));

    result.current('node');

    expect(fnRef).toHaveBeenCalledWith('node');
    expect(objectRef.current).toBe('node');
  });

  it('keeps the same callback while refs are unchanged', () => {
    const objectRef = createRef<string>();
    const { result, rerender } = renderHook(() =>
      useMergedRef<string>(objectRef),
    );
    const first = result.current;

    rerender();

    expect(result.current).toBe(first);
  });

  it('returns a new callback when a ref changes', () => {
    const { result, rerender } = renderHook(
      ({ ref }: { ref: Ref<string> }) => useMergedRef<string>(ref),
      { initialProps: { ref: createRef<string>() } },
    );
    const first = result.current;

    rerender({ ref: createRef<string>() });

    expect(result.current).not.toBe(first);
  });
});

import type { RefCallback, Ref } from 'react';
import { useMemo } from 'react';

type PossibleRef<T> = Ref<T> | undefined;
type RefCleanup = void | (() => void);

export function assignRef<T>(ref: PossibleRef<T>, value: T | null): RefCleanup {
  if (typeof ref === 'function') {
    return ref(value);
  } else if (typeof ref === 'object' && ref !== null && 'current' in ref) {
    (ref as { current: T | null }).current = value;
  }
}

export function mergeRefs<T>(...refs: PossibleRef<T>[]): RefCallback<T> {
  const cleanupMap = new Map<PossibleRef<T>, () => void>();

  return (node: T | null) => {
    if (node === null) {
      refs.forEach((ref) => {
        const cleanup = cleanupMap.get(ref);
        if (typeof cleanup === 'function') {
          cleanup();
        }
        assignRef(ref, null);
      });
      cleanupMap.clear();
      return;
    }

    refs.forEach((ref) => {
      const cleanup = assignRef(ref, node);
      if (typeof cleanup === 'function') {
        cleanupMap.set(ref, cleanup);
      }
    });
  };
}

export function useMergedRef<T>(...refs: PossibleRef<T>[]): RefCallback<T> {
  return useMemo(() => mergeRefs<T>(...refs), refs);
}

// TODO: consolidate into @ledgerhq/lumen-utils-shared
import {
  useState,
  useCallback,
  useRef,
  useEffect,
  startTransition,
} from 'react';

type SetStateAction<T> = T | ((prev: T) => T);

/**
 * A hook that allows a component to be either controlled or uncontrolled.
 * When `prop` is provided, the component is controlled and uses that value.
 * When `prop` is undefined, the component manages its own internal state.
 */
export function useControllableState<T>({
  prop,
  defaultProp,
  onChange,
}: {
  /** The controlled value. If provided, the component becomes controlled. */
  prop?: T;
  /** The default value for uncontrolled mode. */
  defaultProp: T;
  /** Callback fired when the value changes. */
  onChange?: (value: T) => void;
}): [T, (value: SetStateAction<T>) => void] {
  const [internalState, setInternalState] = useState<T>(prop ?? defaultProp);
  const isControlled = prop !== undefined;
  const value = isControlled ? prop : internalState;

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const previousValueRef = useRef(value);

  const setValue = useCallback(
    (next: SetStateAction<T>) => {
      const nextValue =
        typeof next === 'function'
          ? (next as (prev: T) => T)(previousValueRef.current)
          : next;

      if (!isControlled) {
        startTransition(() => {
          setInternalState(nextValue);
        });
      }

      onChangeRef.current?.(nextValue);
      previousValueRef.current = nextValue;
    },
    [isControlled],
  );

  useEffect(() => {
    if (prop !== undefined) {
      setInternalState(prop);
      previousValueRef.current = prop;
    }
  }, [prop]);

  return [value, setValue];
}

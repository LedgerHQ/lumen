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
 *
 * @example
 * // Uncontrolled usage
 * const [value, setValue] = useControllableState({
 *   defaultProp: false,
 *   onChange: (newValue) => console.log('Changed to:', newValue),
 * });
 *
 * @example
 * // Controlled usage
 * const [value, setValue] = useControllableState({
 *   prop: controlledValue,
 *   defaultProp: false,
 *   onChange: onValueChange,
 * });
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

  // Use ref to avoid stale closure issues with onChange
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Track previous value to avoid unnecessary onChange calls
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

      // Always call onChange to notify parent
      onChangeRef.current?.(nextValue);
      previousValueRef.current = nextValue;
    },
    [isControlled],
  );

  // Sync internal state when controlled prop changes
  useEffect(() => {
    if (prop !== undefined) {
      setInternalState(prop);
      previousValueRef.current = prop;
    }
  }, [prop]);

  return [value, setValue];
}

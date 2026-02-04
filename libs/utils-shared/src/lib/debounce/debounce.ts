export type DebounceOptions = {
  /**
   * Invoke on the leading edge of the timeout.
   * @default false
   */
  leading?: boolean;
  /**
   * Invoke on the trailing edge of the timeout.
   * @default true
   */
  trailing?: boolean;
  /**
   * Maximum time func is allowed to be delayed before it's invoked.
   */
  maxWait?: number;
};

export type DebouncedFunction<T extends (...args: never[]) => unknown> = {
  (...args: Parameters<T>): ReturnType<T> | undefined;
  /**
   * Cancels any pending invocation.
   */
  cancel: () => void;
  /**
   * Immediately invokes any pending invocation.
   */
  flush: () => ReturnType<T> | undefined;
  /**
   * Returns true if there is a pending invocation.
   */
  pending: () => boolean;
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with `cancel`, `flush`, and `pending`
 * methods.
 *
 * By default, only `trailing` is enabled:
 * - `leading`: Invoke immediately on the first call
 * - `trailing`: Invoke after `wait` ms of no calls
 * - `maxWait`: Maximum time to wait before forcing invocation
 *
 * @example
 * // Debounce search input to avoid excessive API calls
 * const debouncedSearch = debounce(search, 300);
 * input.addEventListener('input', debouncedSearch);
 *
 * @example
 * // Invoke immediately, then debounce subsequent calls
 * const debounced = debounce(fn, 200, { leading: true });
 *
 * @example
 * // Guarantee invocation at least every 1000ms
 * const debounced = debounce(fn, 200, { maxWait: 1000 });
 */
export function debounce<T extends (...args: never[]) => unknown>(
  func: T,
  wait: number,
  options: DebounceOptions = {},
): DebouncedFunction<T> {
  const { leading = false, trailing = true, maxWait } = options;

  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let maxTimeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastCallTime: number | null = null;
  let lastInvokeTime = 0;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: unknown = null;
  let result: ReturnType<T> | undefined;

  const hasMaxWait = maxWait !== undefined;
  const maxWaitMs = hasMaxWait ? Math.max(maxWait, wait) : 0;

  const invokeFunc = (time: number): ReturnType<T> => {
    lastInvokeTime = time;
    const args = lastArgs!;
    const thisArg = lastThis;
    lastArgs = null;
    lastThis = null;
    result = func.apply(thisArg, args) as ReturnType<T>;
    return result;
  };

  const remainingWait = (time: number): number => {
    const timeSinceLastCall = lastCallTime ? time - lastCallTime : 0;
    return wait - timeSinceLastCall;
  };

  const shouldInvoke = (time: number): boolean => {
    const timeSinceLastCall = lastCallTime ? time - lastCallTime : wait;
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      lastCallTime === null ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (hasMaxWait && timeSinceLastInvoke >= maxWaitMs)
    );
  };

  const trailingEdge = (time: number): ReturnType<T> | undefined => {
    timeoutId = null;

    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = null;
    lastThis = null;
    return result;
  };

  const timerExpired = (): void => {
    const time = Date.now();

    if (shouldInvoke(time)) {
      trailingEdge(time);
      return;
    }

    // Restart the timer with remaining wait
    timeoutId = setTimeout(timerExpired, remainingWait(time));
  };

  const maxTimerExpired = (): void => {
    const time = Date.now();
    maxTimeoutId = null;

    if (lastArgs) {
      invokeFunc(time);
      // Reset the regular timer since we just invoked
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(timerExpired, wait);
      }
    }
  };

  const leadingEdge = (time: number): ReturnType<T> | undefined => {
    lastInvokeTime = time;
    timeoutId = setTimeout(timerExpired, wait);

    if (hasMaxWait) {
      maxTimeoutId = setTimeout(maxTimerExpired, maxWaitMs);
    }

    if (leading) {
      return invokeFunc(time);
    }
    return result;
  };

  const cancel = (): void => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    if (maxTimeoutId !== null) {
      clearTimeout(maxTimeoutId);
    }
    lastInvokeTime = 0;
    lastArgs = null;
    lastThis = null;
    lastCallTime = null;
    timeoutId = null;
    maxTimeoutId = null;
  };

  const flush = (): ReturnType<T> | undefined => {
    if (timeoutId === null && maxTimeoutId === null) {
      return result;
    }
    return trailingEdge(Date.now());
  };

  const pending = (): boolean => {
    return timeoutId !== null || maxTimeoutId !== null;
  };

  const debounced = function (
    this: unknown,
    ...args: Parameters<T>
  ): ReturnType<T> | undefined {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timeoutId === null) {
        return leadingEdge(time);
      }
      if (hasMaxWait) {
        // Reset the timer on each call when maxWait is set
        clearTimeout(timeoutId);
        timeoutId = setTimeout(timerExpired, wait);
        return invokeFunc(time);
      }
    }

    if (timeoutId === null) {
      timeoutId = setTimeout(timerExpired, wait);
    }

    return result;
  } as DebouncedFunction<T>;

  debounced.cancel = cancel;
  debounced.flush = flush;
  debounced.pending = pending;

  return debounced;
}

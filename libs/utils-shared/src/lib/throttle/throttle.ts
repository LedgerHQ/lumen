import { debounce, DebouncedFunction } from '../debounce';

export type ThrottleOptions = {
  /**
   * Invoke on the leading edge of the timeout.
   * @default true
   */
  leading?: boolean;
  /**
   * Invoke on the trailing edge of the timeout.
   * @default true
   */
  trailing?: boolean;
};

export type ThrottledFunction<T extends (...args: never[]) => unknown> =
  DebouncedFunction<T>;

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with `cancel`,
 * `flush`, and `pending` methods.
 *
 * Throttle is implemented using debounce with `maxWait` equal to `wait`,
 * which guarantees the function is invoked at regular intervals.
 *
 * By default, both `leading` and `trailing` are enabled:
 * - `leading`: Invoke immediately on the first call
 * - `trailing`: Invoke after `wait` ms if called again during the wait period
 *
 * @example
 * // Throttle scroll handler to run at most once every 100ms
 * const throttledScroll = throttle(handleScroll, 100);
 * window.addEventListener('scroll', throttledScroll);
 *
 * @example
 * // Only invoke on trailing edge (like debounce but with max frequency)
 * const throttled = throttle(fn, 200, { leading: false });
 *
 * @example
 * // Only invoke on leading edge (ignore calls during wait period)
 * const throttled = throttle(fn, 200, { trailing: false });
 */
export function throttle<T extends (...args: never[]) => unknown>(
  func: T,
  wait: number,
  options: ThrottleOptions = {},
): ThrottledFunction<T> {
  const { leading = true, trailing = true } = options;

  return debounce(func, wait, {
    leading,
    trailing,
    maxWait: wait,
  });
}

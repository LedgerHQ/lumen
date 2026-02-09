import { throttle } from '@ledgerhq/lumen-utils-shared';
import { UIEvent, useEffect, useMemo, useRef } from 'react';
import {
  TABLE_CELL_HEIGHT,
  TABLE_SCROLL_BOTTOM_THRESHOLD_IN_ROW,
} from '../constants';

const SCROLL_THROTTLE_MS = 150;

/**
 * Checks if a scroll container has reached the bottom.
 * Uses a threshold tolerance to handle subpixel rounding issues.
 */
export const isScrolledToBottom = ({
  element,
  threshold = 10,
}: {
  element: HTMLElement;
  threshold?: number;
}): boolean => {
  const { scrollTop, scrollHeight, clientHeight } = element;
  return scrollTop + clientHeight >= scrollHeight - threshold;
};

type UseThrottledScrollBottomOptions = {
  /**
   * Callback fired when the user scrolls near the bottom.
   */
  onScrollBottom?: () => void;
  /**
   * When true, disables the callback to prevent duplicate fetches.
   */
  isLoading?: boolean;
  /**
   * Distance from bottom (in pixels) to trigger the callback.
   * @default 2
   */
  thresholdInRow?: number;
};

/**
 * Hook that provides a throttled scroll handler for infinite scroll patterns.
 * Fires `onScrollBottom` when the user scrolls within `threshold` pixels of the bottom.
 *
 * @example
 * const handleScroll = useThrottledScrollBottom({
 *   onScrollBottom: fetchMore,
 *   isLoading,
 * });
 *
 * return <div onScroll={handleScroll}>...</div>;
 */
export const useThrottledScrollBottom = ({
  onScrollBottom,
  isLoading = false,
  thresholdInRow = TABLE_SCROLL_BOTTOM_THRESHOLD_IN_ROW,
}: UseThrottledScrollBottomOptions):
  | ((event: UIEvent<HTMLElement>) => void)
  | undefined => {
  const threshold = useMemo(
    () => thresholdInRow * TABLE_CELL_HEIGHT,
    [thresholdInRow],
  );
  const callbackRef = useRef(onScrollBottom);
  const isLoadingRef = useRef(isLoading);

  // Keep refs in sync
  callbackRef.current = onScrollBottom;
  isLoadingRef.current = isLoading;
  const throttledCheckRef = useRef<{ cancel: () => void } | null>(null);

  const handler = useMemo(() => {
    if (!onScrollBottom) {
      return undefined;
    }

    // Inner throttled function receives the element directly (not the event)
    // This avoids issues with React's synthetic event recycling
    const throttledCheck = throttle((element: HTMLElement) => {
      if (isLoadingRef.current || !callbackRef.current) {
        return;
      }

      if (isScrolledToBottom({ element, threshold })) {
        callbackRef.current();
      }
    }, SCROLL_THROTTLE_MS);

    // Store reference for cleanup
    throttledCheckRef.current = throttledCheck;

    // Outer handler extracts currentTarget immediately before React recycles the event
    return (event: UIEvent<HTMLElement>) => {
      const element = event.currentTarget;
      if (element) {
        throttledCheck(element);
      }
    };
  }, [onScrollBottom, threshold]);

  // Cleanup: cancel pending throttled calls on unmount or when handler changes
  useEffect(() => {
    return () => {
      throttledCheckRef.current?.cancel();
    };
  }, [handler]);

  return handler;
};

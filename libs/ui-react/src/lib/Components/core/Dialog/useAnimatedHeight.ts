import { useLayoutEffect, useState } from 'react';

/**
 * Tracks the natural height of an element so a clipping parent can transition
 * to it. The element must size from its content only (never from the parent),
 * otherwise measuring and animating feed back into each other.
 *
 * A callback ref (not a ref object) is returned because the element lives in a
 * portal that mounts after the owning component, so an effect on a ref object
 * would run before it exists.
 */
export const useAnimatedHeight = (
  enabled: boolean,
): [(node: HTMLDivElement | null) => void, number | undefined] => {
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number>();

  useLayoutEffect(() => {
    if (!enabled || !element) {
      return;
    }
    const measure = () => setHeight(element.offsetHeight);
    measure();

    if (typeof ResizeObserver === 'undefined') {
      return;
    }
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => {
      observer.disconnect();
      // Reopening must not animate from the previous session's height.
      setHeight(undefined);
    };
  }, [enabled, element]);

  return [setElement, enabled ? height : undefined];
};

import { useEffect, useState } from 'react';

const DURATION_MS = 200;

/**
 * Animates an element's `height` whenever its content size changes, without
 * wrapping its children. The element stays at `height: auto` at rest.
 */
export const useAnimatedHeight = (
  enabled: boolean,
): ((node: HTMLDivElement | null) => void) => {
  const [element, setElement] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (
      !enabled ||
      !element ||
      typeof ResizeObserver === 'undefined' ||
      typeof element.animate !== 'function'
    ) {
      return;
    }
    let lastHeight: number | undefined;
    let animation: Animation | undefined;

    const observer = new ResizeObserver(() => {
      // The animation resizes the element on every frame.
      if (animation) {
        return;
      }
      const nextHeight = element.offsetHeight;
      // The first callback reports the settled initial size, not a change.
      if (lastHeight === undefined || nextHeight === lastHeight) {
        lastHeight = nextHeight;
        return;
      }
      const running = element.animate(
        {
          height: [`${lastHeight}px`, `${nextHeight}px`],
          overflowY: ['hidden', 'hidden'],
        },
        { duration: DURATION_MS, easing: 'ease-out' },
      );
      const done = () => {
        animation = undefined;
      };
      running.onfinish = done;
      running.oncancel = done;
      animation = running;
      lastHeight = nextHeight;
    });
    observer.observe(element);

    return () => {
      observer.disconnect();
      animation?.cancel();
    };
  }, [enabled, element]);

  return setElement;
};

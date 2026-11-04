import type { RefObject } from 'react';
import { useCallback, useLayoutEffect } from 'react';
import { useScrollOverflow } from '../../../../utils/useScrollOverflow/useScrollOverflow';

export type ScrollDirection = 'left' | 'right';

/**
 * Overflow state and the scroll action backing the left/right arrow buttons.
 */
export function useScrollArrows(scrollRef: RefObject<HTMLDivElement | null>): {
  canScrollLeft: boolean;
  canScrollRight: boolean;
  scrollBy: (direction: ScrollDirection) => void;
} {
  const { canScrollLeft, canScrollRight } = useScrollOverflow(scrollRef);

  const scrollBy = useCallback(
    (direction: ScrollDirection) => {
      const el = scrollRef.current;
      if (!el) {
        return;
      }
      // Clamped scrollTo, not scrollBy: iOS WebKit does not clamp a smooth
      // scrollBy after a touch scroll, so it overshoots past the edge.
      const amount = el.clientWidth / 2;
      const maxScroll = el.scrollWidth - el.clientWidth;
      const isRtl = getComputedStyle(el).direction === 'rtl';
      const [min, max] = isRtl ? [-maxScroll, 0] : [0, maxScroll];
      const target = el.scrollLeft + (direction === 'left' ? -amount : amount);
      el.scrollTo({
        left: Math.min(max, Math.max(min, target)),
        behavior: 'smooth',
      });
    },
    [scrollRef],
  );

  return { canScrollLeft, canScrollRight, scrollBy };
}

/**
 * Centers the selected segment on mount only, so a later selection change never
 * fights the scroll position the user set by hand.
 */
export function useScrollSelectedIntoView(
  scrollRef: RefObject<HTMLDivElement | null>,
  selectedIndex: number,
): void {
  useLayoutEffect(() => {
    if (selectedIndex < 0) {
      return;
    }
    const container = scrollRef.current;
    if (!container) {
      return;
    }
    const buttons = container.querySelectorAll('button[role="radio"]');
    const target = buttons[selectedIndex] as HTMLElement | undefined;
    if (target) {
      const { offsetLeft, offsetWidth } = target;
      const { clientWidth } = container;
      container.scrollLeft = offsetLeft - (clientWidth - offsetWidth) / 2;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

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
      const amount = el.clientWidth / 2;
      el.scrollBy({
        left: direction === 'left' ? -amount : amount,
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

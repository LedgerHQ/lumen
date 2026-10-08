import type { RefObject } from 'react';
import { useLayoutEffect, useState } from 'react';

type ScrollOverflow = {
  canScrollLeft: boolean;
  canScrollRight: boolean;
};

const getScrollOverflow = (el: HTMLElement, isRtl: boolean): ScrollOverflow => {
  const maxScroll = el.scrollWidth - el.clientWidth;
  // RTL containers start at scrollLeft 0 on the right edge and go negative.
  const offset = Math.abs(el.scrollLeft);
  const hiddenAtStart = offset > 0;
  const hiddenAtEnd = offset < maxScroll - 1;

  return {
    canScrollLeft: isRtl ? hiddenAtEnd : hiddenAtStart,
    canScrollRight: isRtl ? hiddenAtStart : hiddenAtEnd,
  };
};

/**
 * Tracks whether the scroll container still has content hidden on either
 * physical side (left / right), in both LTR and RTL.
 */
export function useScrollOverflow(
  scrollRef: RefObject<HTMLElement | null>,
): ScrollOverflow {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    const isRtl = getComputedStyle(el).direction === 'rtl';

    const update = (): void => {
      const overflow = getScrollOverflow(el, isRtl);
      setCanScrollLeft(overflow.canScrollLeft);
      setCanScrollRight(overflow.canScrollRight);
    };

    update();
    el.addEventListener('scroll', update, { passive: true });

    const ro =
      typeof ResizeObserver === 'undefined'
        ? undefined
        : new ResizeObserver(update);
    ro?.observe(el);

    // The content width drives overflow just as much as the container width,
    // and the content can be swapped after mount (e.g. a skeleton replaced by
    // the table), so follow the first child as it changes.
    let observedContent: Element | null = null;
    const observeContent = (): void => {
      const content = el.firstElementChild;
      if (content === observedContent) {
        return;
      }
      if (observedContent) {
        ro?.unobserve(observedContent);
      }
      if (content) {
        ro?.observe(content);
      }
      observedContent = content;
    };
    observeContent();

    const mo = new MutationObserver(() => {
      observeContent();
      update();
    });
    mo.observe(el, { childList: true });

    return () => {
      el.removeEventListener('scroll', update);
      ro?.disconnect();
      mo.disconnect();
    };
  }, [scrollRef]);

  return { canScrollLeft, canScrollRight };
}

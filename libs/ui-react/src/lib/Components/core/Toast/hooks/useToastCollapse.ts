import { useEffect, useRef, useState, type RefObject } from 'react';

// Included in the slot height so the exit transition collapses the gap
// between stacked toasts along with the content.
const STACK_GAP_PX = 8;

type UseToastCollapseReturn = {
  contentRef: RefObject<HTMLDivElement | null>;
  height: number | undefined;
};

/**
 * Measures the toast content so the collapse slot can animate its height.
 * `height` stays `undefined` until the first observation, leaving the slot
 * at its intrinsic size.
 *
 * @internal
 */
export const useToastCollapse = (): UseToastCollapseReturn => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [measuredHeight, setMeasuredHeight] = useState<number | null>(null);

  useEffect(() => {
    const element = contentRef.current;
    if (!element || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(([entry]) => {
      setMeasuredHeight(entry.contentRect.height + STACK_GAP_PX);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { contentRef, height: measuredHeight ?? undefined };
};

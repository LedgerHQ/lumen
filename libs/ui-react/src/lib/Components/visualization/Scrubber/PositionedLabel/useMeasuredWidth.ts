import type { DependencyList, RefObject } from 'react';
import { useLayoutEffect, useRef, useState } from 'react';

import { safeGetBBoxWidth } from '../DefaultScrubberTooltip/utils';

/**
 * Measures an SVG element's rendered width. Re-measures synchronously when
 * `deps` change, and on resize for content that changes on its own (e.g. a
 * custom label whose text depends on state the label owns).
 */
export const useMeasuredWidth = (
  deps: DependencyList,
): [RefObject<SVGGElement | null>, number] => {
  const ref = useRef<SVGGElement>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    setWidth(safeGetBBoxWidth(ref.current));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element || typeof ResizeObserver === 'undefined') {
      return;
    }
    const observer = new ResizeObserver(() => {
      setWidth(safeGetBBoxWidth(element));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, width];
};

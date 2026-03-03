import React, { useLayoutEffect, useMemo, useState } from 'react';

export type PillLayout = {
  width: number;
  height: number;
  x: number;
};

type UsePillElementLayoutEffectParams = {
  ref: React.RefObject<HTMLDivElement | null>;
  selectedIndex: number;
  children: React.ReactNode;
};

export function usePillElementLayoutEffect({
  ref,
  selectedIndex,
  children,
}: UsePillElementLayoutEffectParams): { pill: PillLayout } {
  const [pill, setPill] = useState<PillLayout>({ width: 0, height: 0, x: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const sync = (): void => {
      const { width, height } = el.getBoundingClientRect();
      const count = React.Children.count(children);
      const slotWidth = count > 0 ? width / count : 0;
      setPill({
        width: slotWidth,
        height,
        x: selectedIndex >= 0 ? selectedIndex * slotWidth : 0,
      });
    };

    sync();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [children, selectedIndex, ref]);

  return { pill };
}

export function useSegmentedControlSelectedIndex(
  selectedValue: string,
  children: React.ReactNode,
): number {
  return useMemo(
    () =>
      React.Children.toArray(children).findIndex(
        (c) =>
          React.isValidElement(c) &&
          (c.props as { value?: string }).value === selectedValue,
      ),
    [selectedValue, children],
  );
}

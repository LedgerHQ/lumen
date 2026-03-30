import {
  Children,
  isValidElement,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';

export type PillLayout = {
  width: number;
  height: number;
  x: number;
};

export function usePillElementLayoutEffect({
  ref,
  selectedIndex,
  children,
}: {
  ref: React.RefObject<HTMLDivElement | null>;
  selectedIndex: number;
  children: React.ReactNode;
}): { pill: PillLayout; isReady: boolean } {
  const [pill, setPill] = useState<PillLayout>({ width: 0, height: 0, x: 0 });
  const [isReady, setIsReady] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const sync = (): void => {
      const { height } = el.getBoundingClientRect();
      const buttons = Array.from(el.children).slice(0, -1) as HTMLElement[];
      const target = selectedIndex >= 0 ? buttons[selectedIndex] : undefined;
      setPill({
        width: target?.offsetWidth ?? 0,
        height,
        x: target?.offsetLeft ?? 0,
      });
    };

    sync();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [children, selectedIndex, ref]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setIsReady(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return { pill, isReady };
}

export function useSegmentedControlSelectedIndex(
  selectedValue: string,
  children: ReactNode,
): number {
  return useMemo(
    () =>
      Children.toArray(children).findIndex(
        (c) =>
          isValidElement(c) &&
          (c.props as { value?: string }).value === selectedValue,
      ),
    [selectedValue, children],
  );
}

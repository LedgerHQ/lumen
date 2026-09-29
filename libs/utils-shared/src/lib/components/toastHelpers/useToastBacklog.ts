import { useEffect, useRef } from 'react';
import { toastStore } from './toastStore';
import type { ToastItem } from './types';

/**
 * Tracks the toasts that have waited in the backlog (past `visibleSlots`), so
 * the view can animate their promotion from behind the stack rather than
 * from the anchored edge. Also completes `dismiss` for backlog toasts: they
 * are never mounted, so there is no exit animation to wait for.
 *
 * Returns whether a given toast id has been backlogged.
 */
export const useToastBacklog = (
  items: ToastItem[],
  visibleSlots: number,
): ((id: string) => boolean) => {
  const backloggedIds = useRef(new Set<string>());

  useEffect(() => {
    backloggedIds.current = new Set(
      items
        .filter(
          (item, index) =>
            index >= visibleSlots || backloggedIds.current.has(item.id),
        )
        .map((item) => item.id),
    );
    items
      .slice(visibleSlots)
      .filter((item) => item.exiting)
      .forEach((item) => toastStore.dismiss(item.id));
  }, [items, visibleSlots]);

  return (id) => backloggedIds.current.has(id);
};

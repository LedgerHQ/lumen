import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { resetToastStore, toastStore } from './toastStore';
import type { ToastItem } from './types';
import { useToastBacklog } from './useToastBacklog';

const toast = (id: string, exiting?: boolean): ToastItem => ({
  id,
  appearance: 'info',
  loading: false,
  title: id,
  dismissible: true,
  ...(exiting ? { exiting } : {}),
});

describe('useToastBacklog', () => {
  beforeEach(() => {
    resetToastStore();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('backlog tracking', () => {
    it('marks only items past visibleSlots', () => {
      const [visible, queued, alsoQueued] = ['a', 'b', 'c'].map((id) =>
        toast(id),
      );
      const { result } = renderHook(() =>
        useToastBacklog([visible, queued, alsoQueued], 1),
      );

      expect(result.current(visible.id)).toBe(false);
      expect(result.current(queued.id)).toBe(true);
      expect(result.current(alsoQueued.id)).toBe(true);
    });

    it('marks a promoted id as queued', () => {
      const [first, queued] = ['a', 'b'].map((id) => toast(id));
      const { result, rerender } = renderHook(
        ({ items }) => useToastBacklog(items, 1),
        { initialProps: { items: [first, queued] } },
      );

      expect(result.current(first.id)).toBe(false);
      expect(result.current(queued.id)).toBe(true);

      rerender({ items: [queued] });

      expect(result.current(queued.id)).toBe(true);
    });

    it('keeps previously queued items marked when visibleSlots grows', () => {
      const [first, queued] = ['a', 'b'].map((id) => toast(id));
      const { result, rerender } = renderHook(
        ({ visibleSlots }) => useToastBacklog([first, queued], visibleSlots),
        { initialProps: { visibleSlots: 1 } },
      );

      expect(result.current(queued.id)).toBe(true);

      rerender({ visibleSlots: 2 });

      expect(result.current(first.id)).toBe(false);
      expect(result.current(queued.id)).toBe(true);
    });

    it('marks newly overflowed items when visibleSlots shrinks', () => {
      const [first, second] = ['a', 'b'].map((id) => toast(id));
      const { result, rerender } = renderHook(
        ({ visibleSlots }) => useToastBacklog([first, second], visibleSlots),
        { initialProps: { visibleSlots: 2 } },
      );

      expect(result.current(second.id)).toBe(false);

      rerender({ visibleSlots: 1 });

      expect(result.current(first.id)).toBe(false);
      expect(result.current(second.id)).toBe(true);
    });

    it('forgets an id once it leaves the list', () => {
      const [visible, queued] = ['a', 'b'].map((id) => toast(id));
      const { result, rerender } = renderHook(
        ({ items }) => useToastBacklog(items, 1),
        { initialProps: { items: [visible, queued] } },
      );

      expect(result.current(queued.id)).toBe(true);

      rerender({ items: [visible] });

      expect(result.current(queued.id)).toBe(false);
    });
  });

  describe('completing dismiss', () => {
    it('dismisses exiting items that are still in the backlog', () => {
      const dismiss = vi.spyOn(toastStore, 'dismiss');
      const visible = toast('visible', true);
      const queued = toast('queued', true);
      const alsoQueued = toast('also-queued', true);

      renderHook(() => useToastBacklog([visible, queued, alsoQueued], 1));

      expect(dismiss).toHaveBeenCalledTimes(2);
      expect(dismiss).toHaveBeenCalledWith(queued.id);
      expect(dismiss).toHaveBeenCalledWith(alsoQueued.id);
      expect(dismiss).not.toHaveBeenCalledWith(visible.id);
    });

    it('leaves backlog items alone until they are exiting', () => {
      const dismiss = vi.spyOn(toastStore, 'dismiss');

      renderHook(() => useToastBacklog([toast('visible'), toast('queued')], 1));

      expect(dismiss).not.toHaveBeenCalled();
    });

    it('removes a dismissed backlog item without an exit animation', () => {
      const visibleId = toastStore.add({ title: 'Visible' });
      const queuedId = toastStore.add({ title: 'Queued' });
      const stillQueuedId = toastStore.add({ title: 'Still queued' });
      const { rerender } = renderHook(
        ({ items }) => useToastBacklog(items, 1),
        { initialProps: { items: toastStore.getSnapshot() } },
      );

      act(() => {
        toastStore.dismiss(queuedId);
      });
      rerender({ items: toastStore.getSnapshot() });

      expect(toastStore.getSnapshot().map((item) => item.id)).toEqual([
        visibleId,
        stillQueuedId,
      ]);
    });

    it('finishes dismissAll for backlog items and leaves visible ones exiting', () => {
      const visibleId = toastStore.add({ title: 'Visible' });
      toastStore.add({ title: 'Queued' });
      toastStore.add({ title: 'Also queued' });
      const { rerender } = renderHook(
        ({ items }) => useToastBacklog(items, 1),
        { initialProps: { items: toastStore.getSnapshot() } },
      );

      act(() => {
        toastStore.dismissAll();
      });
      rerender({ items: toastStore.getSnapshot() });

      expect(toastStore.getSnapshot()).toEqual([
        expect.objectContaining({ id: visibleId, exiting: true }),
      ]);
    });
  });
});

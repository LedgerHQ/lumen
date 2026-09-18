import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useToastQueue } from './useToastQueue';

describe('useToastQueue', () => {
  describe('duration resolution', () => {
    it('applies the Lumen default per appearance', () => {
      const { result } = renderHook(() => useToastQueue(3));

      act(() => {
        result.current.add({ appearance: 'info', title: 'Info' });
        result.current.add({ appearance: 'success', title: 'Success' });
        result.current.add({ appearance: 'warning', title: 'Warning' });
        result.current.add({ appearance: 'error', title: 'Error' });
      });

      const [info, success, warning, error] = result.current.items;
      expect(info.durationMs).toBe(5000);
      expect(success.durationMs).toBe(5000);
      expect(warning.durationMs).toBe(Infinity);
      expect(error.durationMs).toBe(Infinity);
    });

    it('persists loading items regardless of appearance', () => {
      const { result } = renderHook(() => useToastQueue(3));

      act(() => {
        result.current.add({
          appearance: 'success',
          loading: true,
          title: 'Uploading',
        });
      });

      expect(result.current.items[0].durationMs).toBe(Infinity);
    });

    it('lets a per-item duration win over the appearance default', () => {
      const { result } = renderHook(() => useToastQueue(3));

      act(() => {
        result.current.add({
          appearance: 'info',
          title: 'Custom',
          duration: 1234,
        });
      });

      expect(result.current.items[0].durationMs).toBe(1234);
    });

    it('lets provider-level overrides win over the default, but not over a per-item duration', () => {
      const { result } = renderHook(() => useToastQueue(3, { info: 8000 }));

      act(() => {
        result.current.add({ appearance: 'info', title: 'Overridden' });
        result.current.add({
          appearance: 'info',
          title: 'Still per-item',
          duration: 5000,
        });
      });

      expect(result.current.items[0].durationMs).toBe(8000);
      expect(result.current.items[1].durationMs).toBe(5000);
    });

    it('treats a resolved 0 as persist (Infinity), from a per-item duration, a provider override, or the appearance default', () => {
      const { result } = renderHook(() => useToastQueue(3, { success: 0 }));

      act(() => {
        result.current.add({ appearance: 'error', title: 'Default persists' });
        result.current.add({
          appearance: 'success',
          title: 'Override persists',
        });
        result.current.add({
          appearance: 'info',
          title: 'Per-item persists',
          duration: 0,
        });
      });

      expect(result.current.items[0].durationMs).toBe(Infinity);
      expect(result.current.items[1].durationMs).toBe(Infinity);
      expect(result.current.items[2].durationMs).toBe(Infinity);
    });
  });

  describe('backlog', () => {
    it('flags only the items added while every visible slot is taken', () => {
      const { result } = renderHook(() => useToastQueue(1));

      act(() => {
        result.current.add({ title: 'Visible' });
        result.current.add({ title: 'Backlog' });
      });

      expect(result.current.items[0].queued).toBe(false);
      expect(result.current.items[1].queued).toBe(true);
    });
  });

  describe('update', () => {
    it('recomputes durationMs when appearance/loading changes (e.g. loading -> success)', () => {
      const { result } = renderHook(() => useToastQueue(3));
      let id = '';

      act(() => {
        id = result.current.add({ title: 'Loading', loading: true });
      });
      expect(result.current.items[0].durationMs).toBe(Infinity);

      act(() => {
        result.current.update(id, {
          appearance: 'success',
          loading: false,
          title: 'Done',
        });
      });
      expect(result.current.items[0].durationMs).toBe(5000);
      expect(result.current.items[0].title).toBe('Done');
    });

    it('leaves durationMs untouched when the patch does not affect timing', () => {
      const { result } = renderHook(() => useToastQueue(3));
      let id = '';

      act(() => {
        id = result.current.add({ title: 'Original', duration: 1234 });
      });

      act(() => {
        result.current.update(id, { title: 'Renamed' });
      });

      expect(result.current.items[0].durationMs).toBe(1234);
      expect(result.current.items[0].title).toBe('Renamed');
    });
  });

  describe('dismiss / dismissAll', () => {
    it('is two-phase for a visible item: first flags exiting, second removes it', () => {
      const { result } = renderHook(() => useToastQueue(3));
      let id = '';

      act(() => {
        id = result.current.add({ title: 'Visible' });
      });

      act(() => {
        result.current.dismiss(id);
      });
      expect(result.current.items[0].exiting).toBe(true);

      act(() => {
        result.current.dismiss(id);
      });
      expect(result.current.items).toHaveLength(0);
    });

    it('removes a backlog item immediately, without the exiting phase', () => {
      const { result } = renderHook(() => useToastQueue(1));
      let backlogId = '';

      act(() => {
        result.current.add({ title: 'Visible' });
        backlogId = result.current.add({ title: 'Backlog' });
      });

      act(() => {
        result.current.dismiss(backlogId);
      });
      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].title).toBe('Visible');
    });

    it('dismissAll flags visible items as exiting and drops the backlog outright', () => {
      const { result } = renderHook(() => useToastQueue(1));

      act(() => {
        result.current.add({ title: 'Visible' });
        result.current.add({ title: 'Backlog' });
      });

      act(() => {
        result.current.dismissAll();
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].title).toBe('Visible');
      expect(result.current.items[0].exiting).toBe(true);
    });
  });

  describe('maxItems', () => {
    it.each([1.5, Number.NaN, -1, 0, Number.POSITIVE_INFINITY])(
      'falls back to 3 when maxItems is %s',
      (maxItems) => {
        const { result } = renderHook(() => useToastQueue(maxItems));

        act(() => {
          result.current.add({ title: 'A' });
          result.current.add({ title: 'B' });
          result.current.add({ title: 'C' });
          result.current.add({ title: 'D' });
        });

        expect(result.current.maxItems).toBe(3);
        expect(result.current.items.map((item) => item.queued)).toEqual([
          false,
          false,
          false,
          true,
        ]);

        const thirdId = result.current.items[2].id;
        act(() => {
          result.current.dismiss(thirdId);
        });
        expect(result.current.items[2].exiting).toBe(true);
        expect(result.current.items).toHaveLength(4);
      },
    );
  });
});

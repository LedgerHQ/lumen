import { beforeEach, describe, expect, it, vi } from 'vitest';

import { resetToastStore, resolveMaxItems, toastStore } from './toastStore';

describe('toastStore', () => {
  beforeEach(() => {
    resetToastStore();
    toastStore.configure({ maxItems: 3 });
  });

  describe('duration resolution', () => {
    it('applies the Lumen default per appearance', () => {
      toastStore.add({ appearance: 'info', title: 'Info' });
      toastStore.add({ appearance: 'success', title: 'Success' });
      toastStore.add({ appearance: 'warning', title: 'Warning' });
      toastStore.add({ appearance: 'error', title: 'Error' });

      const [info, success, warning, error] = toastStore.getSnapshot();
      expect(info.durationMs).toBe(5000);
      expect(success.durationMs).toBe(5000);
      expect(warning.durationMs).toBe(Infinity);
      expect(error.durationMs).toBe(Infinity);
    });

    it('persists loading items regardless of appearance', () => {
      toastStore.add({
        appearance: 'success',
        loading: true,
        title: 'Uploading',
      });

      expect(toastStore.getSnapshot()[0].durationMs).toBe(Infinity);
    });

    it('lets a per-item duration win over the appearance default', () => {
      toastStore.add({ appearance: 'info', title: 'Custom', duration: 1234 });

      expect(toastStore.getSnapshot()[0].durationMs).toBe(1234);
    });

    it('lets toaster duration overrides win over the default, but not over a per-item duration', () => {
      toastStore.configure({ maxItems: 3, durations: { info: 8000 } });

      toastStore.add({ appearance: 'info', title: 'Overridden' });
      toastStore.add({
        appearance: 'info',
        title: 'Still per-item',
        duration: 5000,
      });

      const [overridden, perItem] = toastStore.getSnapshot();
      expect(overridden.durationMs).toBe(8000);
      expect(perItem.durationMs).toBe(5000);
    });

    it('treats a resolved 0 as persist (Infinity), from a per-item duration, a toaster override, or the appearance default', () => {
      toastStore.configure({ maxItems: 3, durations: { success: 0 } });

      toastStore.add({ appearance: 'error', title: 'Default persists' });
      toastStore.add({ appearance: 'success', title: 'Override persists' });
      toastStore.add({
        appearance: 'info',
        title: 'Per-item persists',
        duration: 0,
      });

      const [defaultPersists, overridePersists, perItemPersists] =
        toastStore.getSnapshot();
      expect(defaultPersists.durationMs).toBe(Infinity);
      expect(overridePersists.durationMs).toBe(Infinity);
      expect(perItemPersists.durationMs).toBe(Infinity);
    });
  });

  describe('backlog', () => {
    it('flags only the items added while every visible slot is taken', () => {
      toastStore.configure({ maxItems: 1 });

      toastStore.add({ title: 'Visible' });
      toastStore.add({ title: 'Backlog' });

      const [visible, backlog] = toastStore.getSnapshot();
      expect(visible.queued).toBe(false);
      expect(backlog.queued).toBe(true);
    });
  });

  describe('update', () => {
    it('recomputes durationMs when appearance/loading changes (e.g. loading -> success)', () => {
      const id = toastStore.add({ title: 'Loading', loading: true });
      expect(toastStore.getSnapshot()[0].durationMs).toBe(Infinity);

      toastStore.update(id, {
        appearance: 'success',
        loading: false,
        title: 'Done',
      });
      expect(toastStore.getSnapshot()[0].durationMs).toBe(5000);
      expect(toastStore.getSnapshot()[0].title).toBe('Done');
    });

    it('leaves durationMs untouched when the patch does not affect timing', () => {
      const id = toastStore.add({ title: 'Original', duration: 1234 });

      toastStore.update(id, { title: 'Renamed' });

      expect(toastStore.getSnapshot()[0].durationMs).toBe(1234);
      expect(toastStore.getSnapshot()[0].title).toBe('Renamed');
    });

    it('clears a trailing action when the patch sets action to undefined', () => {
      const id = toastStore.add({
        title: 'Loading',
        action: { label: 'Cancel', onAction: () => {} },
      });
      expect(toastStore.getSnapshot()[0].action?.label).toBe('Cancel');

      toastStore.update(id, { title: 'Done', action: undefined });
      expect(toastStore.getSnapshot()[0].action).toBeUndefined();
    });

    it('keeps the trailing action when the patch omits action', () => {
      const id = toastStore.add({
        title: 'Loading',
        action: { label: 'Cancel', onAction: () => {} },
      });

      toastStore.update(id, { title: 'Still loading' });
      expect(toastStore.getSnapshot()[0].action?.label).toBe('Cancel');
    });

    it('is a no-op for an unknown id', () => {
      toastStore.add({ title: 'Visible' });
      const before = toastStore.getSnapshot();

      toastStore.update('unknown-id', { title: 'Nope' });

      expect(toastStore.getSnapshot()).toBe(before);
    });
  });

  describe('dismiss / dismissAll', () => {
    it('is two-phase for a visible item: first flags exiting, second removes it', () => {
      const id = toastStore.add({ title: 'Visible' });

      toastStore.dismiss(id);
      expect(toastStore.getSnapshot()[0].exiting).toBe(true);

      toastStore.dismiss(id);
      expect(toastStore.getSnapshot()).toHaveLength(0);
    });

    it('removes a backlog item immediately, without the exiting phase', () => {
      toastStore.configure({ maxItems: 1 });
      toastStore.add({ title: 'Visible' });
      const backlogId = toastStore.add({ title: 'Backlog' });

      toastStore.dismiss(backlogId);
      const snapshot = toastStore.getSnapshot();
      expect(snapshot).toHaveLength(1);
      expect(snapshot[0].title).toBe('Visible');
    });

    it('dismissAll flags visible items as exiting and drops the backlog outright', () => {
      toastStore.configure({ maxItems: 1 });
      toastStore.add({ title: 'Visible' });
      toastStore.add({ title: 'Backlog' });

      toastStore.dismissAll();

      const snapshot = toastStore.getSnapshot();
      expect(snapshot).toHaveLength(1);
      expect(snapshot[0].title).toBe('Visible');
      expect(snapshot[0].exiting).toBe(true);
    });

    it('is a no-op for an unknown id', () => {
      toastStore.add({ title: 'Visible' });
      const before = toastStore.getSnapshot();

      toastStore.dismiss('unknown-id');

      expect(toastStore.getSnapshot()).toBe(before);
    });
  });

  describe('maxItems', () => {
    it.each([1.5, Number.NaN, -1, 0, Number.POSITIVE_INFINITY])(
      'falls back to 3 when maxItems is %s',
      (maxItems) => {
        toastStore.configure({ maxItems });

        toastStore.add({ title: 'A' });
        toastStore.add({ title: 'B' });
        toastStore.add({ title: 'C' });
        toastStore.add({ title: 'D' });

        const snapshot = toastStore.getSnapshot();
        expect(snapshot.map((item) => item.queued)).toEqual([
          false,
          false,
          false,
          true,
        ]);

        const thirdId = snapshot[2].id;
        toastStore.dismiss(thirdId);
        expect(toastStore.getSnapshot()[2].exiting).toBe(true);
        expect(toastStore.getSnapshot()).toHaveLength(4);
      },
    );
  });

  describe('subscribe', () => {
    it('notifies subscribers on every mutation and lets them unsubscribe', () => {
      let calls = 0;
      const unsubscribe = toastStore.subscribe(() => {
        calls += 1;
      });

      const id = toastStore.add({ title: 'Hello' });
      expect(calls).toBe(1);

      toastStore.update(id, { title: 'Updated' });
      expect(calls).toBe(2);

      unsubscribe();
      toastStore.dismiss(id);
      expect(calls).toBe(2);
    });

    it('keeps the same snapshot reference when nothing changed', () => {
      toastStore.add({ title: 'Hello' });
      const first = toastStore.getSnapshot();
      const second = toastStore.getSnapshot();
      expect(first).toBe(second);
    });
  });

  describe('registerRenderer', () => {
    it('does not warn for a single mounted renderer', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const unregister = toastStore.registerRenderer();
      expect(warnSpy).not.toHaveBeenCalled();

      unregister();
      warnSpy.mockRestore();
    });

    it('warns when more than one renderer is mounted at once', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const unregisterFirst = toastStore.registerRenderer();
      const unregisterSecond = toastStore.registerRenderer();
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy.mock.calls[0][0]).toContain('<Toaster />');

      unregisterFirst();
      unregisterSecond();
      warnSpy.mockRestore();
    });

    it('stops warning once enough renderers have unregistered', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const unregisterFirst = toastStore.registerRenderer();
      const unregisterSecond = toastStore.registerRenderer();
      unregisterSecond();
      unregisterFirst();

      toastStore.registerRenderer();
      expect(warnSpy).toHaveBeenCalledTimes(1);

      warnSpy.mockRestore();
    });
  });
});

describe('resolveMaxItems', () => {
  it.each([1.5, Number.NaN, -1, 0, Number.POSITIVE_INFINITY])(
    'falls back to 3 for %s',
    (maxItems) => {
      expect(resolveMaxItems(maxItems)).toBe(3);
    },
  );

  it('accepts any positive integer', () => {
    expect(resolveMaxItems(5)).toBe(5);
  });
});

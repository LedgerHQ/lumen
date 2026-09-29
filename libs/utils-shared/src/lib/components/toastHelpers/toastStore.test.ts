import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  resetToastStore,
  resolveDurationMs,
  resolveMaxItems,
  toastStore,
} from './toastStore';

describe('toastStore', () => {
  beforeEach(() => {
    resetToastStore();
  });

  describe('update', () => {
    it('keeps the per-item duration when the patch does not affect timing', () => {
      const id = toastStore.add({ title: 'Original', duration: 1234 });

      toastStore.update(id, { title: 'Renamed' });

      expect(toastStore.getSnapshot()[0].duration).toBe(1234);
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

    it('dismissAll flags every item as exiting', () => {
      toastStore.add({ title: 'A' });
      toastStore.add({ title: 'B' });

      toastStore.dismissAll();

      expect(toastStore.getSnapshot().map((item) => item.exiting)).toEqual([
        true,
        true,
      ]);
    });

    it('is a no-op for an unknown id', () => {
      toastStore.add({ title: 'Visible' });
      const before = toastStore.getSnapshot();

      toastStore.dismiss('unknown-id');

      expect(toastStore.getSnapshot()).toBe(before);
    });
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

describe('resolveDurationMs', () => {
  it('applies the Lumen default per appearance, and persists loading items', () => {
    expect(resolveDurationMs({ appearance: 'info', loading: false })).toBe(
      5000,
    );
    expect(resolveDurationMs({ appearance: 'error', loading: false })).toBe(
      Infinity,
    );
    expect(resolveDurationMs({ appearance: 'info', loading: true })).toBe(
      Infinity,
    );
  });

  it('lets a per-item duration win over toaster overrides, which win over the default', () => {
    const durations = { info: 8000 };
    expect(
      resolveDurationMs({ appearance: 'info', loading: false }, durations),
    ).toBe(8000);
    expect(
      resolveDurationMs(
        { appearance: 'info', loading: false, duration: 1234 },
        durations,
      ),
    ).toBe(1234);
  });

  it('treats a resolved 0 as persist', () => {
    expect(
      resolveDurationMs(
        { appearance: 'success', loading: false },
        { success: 0 },
      ),
    ).toBe(Infinity);
    expect(
      resolveDurationMs({ appearance: 'info', loading: false, duration: 0 }),
    ).toBe(Infinity);
  });
});

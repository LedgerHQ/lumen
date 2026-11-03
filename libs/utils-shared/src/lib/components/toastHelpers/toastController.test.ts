import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createToastController, toast } from './toastController';
import { resetToastStore, toastStore } from './toastStore';

const setup = () => {
  const actions = {
    add: vi.fn(() => 'toast-1'),
    update: vi.fn(),
    dismiss: vi.fn(),
    dismissAll: vi.fn(),
  };
  return { actions, controller: createToastController(actions) };
};

describe('createToastController', () => {
  it('notify adds the toast and returns its id', () => {
    const { actions, controller } = setup();

    expect(controller.notify({ title: 'Hello' })).toEqual({ id: 'toast-1' });
    expect(actions.add).toHaveBeenCalledWith({ title: 'Hello' });
  });

  it.each(['info', 'success', 'warning', 'error'] as const)(
    '%s sets the matching appearance',
    (appearance) => {
      const { actions, controller } = setup();

      expect(controller[appearance]({ title: 'Hi' })).toEqual({
        id: 'toast-1',
      });
      expect(actions.add).toHaveBeenCalledWith({ title: 'Hi', appearance });
    },
  );

  it('loading adds an info toast in the loading state', () => {
    const { actions, controller } = setup();

    controller.loading({ title: 'Saving' });

    expect(actions.add).toHaveBeenCalledWith({
      title: 'Saving',
      appearance: 'info',
      loading: true,
    });
  });

  it('forwards update, dismiss and dismissAll', () => {
    const { actions, controller } = setup();

    controller.update('toast-1', { title: 'Updated' });
    controller.dismiss('toast-1');
    controller.dismissAll();

    expect(actions.update).toHaveBeenCalledWith('toast-1', {
      title: 'Updated',
    });
    expect(actions.dismiss).toHaveBeenCalledWith('toast-1');
    expect(actions.dismissAll).toHaveBeenCalledTimes(1);
  });

  describe('promise', () => {
    it('shows a loading toast, then a success toast with the same id', async () => {
      const { actions, controller } = setup();
      const promise = Promise.resolve(42);

      const result = controller.promise(promise, {
        loading: { title: 'Saving' },
        success: { title: 'Saved' },
        error: { title: 'Failed' },
      });

      expect(result).toEqual({ id: 'toast-1' });
      expect(actions.add).toHaveBeenCalledWith({
        title: 'Saving',
        appearance: 'info',
        loading: true,
      });

      await promise;

      expect(actions.update).toHaveBeenCalledWith('toast-1', {
        title: 'Saved',
        appearance: 'success',
        loading: false,
        action: undefined,
        dismissible: true,
      });
    });

    it('resolves the success state from the value and keeps dismissible', async () => {
      const { actions, controller } = setup();
      const promise = Promise.resolve(3);
      const action = { label: 'Undo', onAction: vi.fn() };

      controller.promise(promise, {
        loading: { title: 'Saving' },
        success: (count) => ({
          title: `Saved ${count}`,
          dismissible: false,
          action,
        }),
        error: { title: 'Failed' },
      });
      await promise;

      expect(actions.update).toHaveBeenCalledWith('toast-1', {
        title: 'Saved 3',
        appearance: 'success',
        loading: false,
        action,
        dismissible: false,
      });
    });

    it('shows an error toast when the promise rejects', async () => {
      const { actions, controller } = setup();
      const promise = Promise.reject(new Error('boom'));

      controller.promise(promise, {
        loading: { title: 'Saving' },
        success: { title: 'Saved' },
        error: (error) => ({ title: (error as Error).message }),
      });
      await promise.catch(() => undefined);

      expect(actions.update).toHaveBeenCalledWith('toast-1', {
        title: 'boom',
        appearance: 'error',
        loading: false,
        action: undefined,
        dismissible: true,
      });
    });

    it('accepts a static error state', async () => {
      const { actions, controller } = setup();
      const promise = Promise.reject(new Error('boom'));

      controller.promise(promise, {
        loading: { title: 'Saving' },
        success: { title: 'Saved' },
        error: { title: 'Failed', dismissible: false },
      });
      await promise.catch(() => undefined);

      expect(actions.update).toHaveBeenCalledWith(
        'toast-1',
        expect.objectContaining({
          title: 'Failed',
          appearance: 'error',
          dismissible: false,
        }),
      );
    });
  });
});

describe('toast', () => {
  beforeEach(() => {
    resetToastStore();
  });

  it('is bound to the shared toast store', () => {
    const { id } = toast.success({ title: 'Saved' });

    expect(toastStore.getSnapshot()).toEqual([
      expect.objectContaining({ id, title: 'Saved', appearance: 'success' }),
    ]);
  });
});

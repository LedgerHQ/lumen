import type {
  ToastController,
  ToastNotifyOptions,
  ToastPromiseState,
  ToastUpdateOptions,
} from './types';

const resolvePromiseState = <Arg>(
  state: ToastPromiseState | ((arg: Arg) => ToastPromiseState),
  arg: Arg,
): ToastPromiseState => (typeof state === 'function' ? state(arg) : state);

/**
 * Builds the imperative `ToastController` API from a queue's primitive
 * actions. Pure and platform-agnostic — callers memoize it themselves (its
 * identity only needs to change when the underlying actions do).
 */
export const createToastController = ({
  add,
  update,
  dismiss,
  dismissAll,
}: {
  add: (options: ToastNotifyOptions) => string;
  update: (id: string, patch: ToastUpdateOptions) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}): ToastController => {
  const notify: ToastController['notify'] = (options) => ({
    id: add(options),
  });

  return {
    notify,
    info: (options) => notify({ ...options, appearance: 'info' }),
    success: (options) => notify({ ...options, appearance: 'success' }),
    warning: (options) => notify({ ...options, appearance: 'warning' }),
    error: (options) => notify({ ...options, appearance: 'error' }),
    loading: (options) =>
      notify({ ...options, appearance: 'info', loading: true }),
    update,
    dismiss,
    dismissAll,
    promise: (promise, options) => {
      const { id } = notify({
        ...options.loading,
        appearance: 'info',
        loading: true,
      });
      void promise.then(
        (value) =>
          update(id, {
            ...resolvePromiseState(options.success, value),
            appearance: 'success',
            loading: false,
          }),
        (error: unknown) =>
          update(id, {
            ...resolvePromiseState(options.error, error),
            appearance: 'error',
            loading: false,
          }),
      );
      return { id };
    },
  };
};

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
        (value) => {
          const state = resolvePromiseState(options.success, value);
          update(id, {
            ...state,
            appearance: 'success',
            loading: false,
            action: state.action,
          });
        },
        (error: unknown) => {
          const state = resolvePromiseState(options.error, error);
          update(id, {
            ...state,
            appearance: 'error',
            loading: false,
            action: state.action,
          });
        },
      );
      return { id };
    },
  };
};

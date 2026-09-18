import { useToastContext } from './ToastProvider';
import type { ToastController } from './types';

/**
 * Returns the imperative toast controller. Must be called from a component
 * rendered inside a `ToastProvider`.
 *
 * @example
 * const toast = useToast();
 *
 * toast.info({ title: 'Copied to clipboard' });
 * toast.error({ title: 'Something went wrong' });
 *
 * @example
 * // Bind a promise to a single toast
 * toast.promise(saveProfile(), {
 *   loading: { title: 'Saving…' },
 *   success: { title: 'Profile saved' },
 *   error: { title: 'Could not save', action: { label: 'Retry', onAction: retry } },
 * });
 */
export const useToast = (): ToastController =>
  useToastContext({ consumerName: 'useToast', contextRequired: true });

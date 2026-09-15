import { useSnackbarContext } from './SnackbarProvider';
import type { SnackbarController } from './types';

/**
 * Returns the imperative snackbar controller. Must be called from a component
 * rendered inside a `SnackbarProvider`.
 *
 * @example
 * const snackbar = useSnackbar();
 *
 * snackbar.info({ title: 'Copied to clipboard' });
 * snackbar.error({ title: 'Something went wrong' });
 *
 * @example
 * // Bind a promise to a single snackbar
 * snackbar.promise(saveProfile(), {
 *   loading: { title: 'Saving…' },
 *   success: { title: 'Profile saved' },
 *   error: { title: 'Could not save', action: { label: 'Retry', onAction: retry } },
 * });
 */
export const useSnackbar = (): SnackbarController =>
  useSnackbarContext({ consumerName: 'useSnackbar', contextRequired: true });

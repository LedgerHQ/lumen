import { useLayoutEffect, useSyncExternalStore } from 'react';
import type { ColorSchemeName } from './ThemeProvider.types';
import { COLOR_SCHEMES } from './ThemeProvider.types';

const getSystemColorScheme = (): 'light' | 'dark' =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const subscribeToSystemColorScheme = (callback: () => void): (() => void) => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noopSubscribe = (): (() => void) => () => {};

/**
 * Returns the resolved color scheme ('light' | 'dark'), handling 'system' by
 * subscribing to `prefers-color-scheme` changes.
 *
 * When colorScheme is explicit ('light' | 'dark'), the media-query listener
 * is skipped entirely to avoid unnecessary subscriptions and re-renders.
 */
export const useResolvedColorScheme = (
  colorScheme: ColorSchemeName,
): 'light' | 'dark' => {
  const isSystem = colorScheme === COLOR_SCHEMES.system;

  return useSyncExternalStore(
    isSystem ? subscribeToSystemColorScheme : noopSubscribe,
    isSystem ? getSystemColorScheme : () => colorScheme as 'light' | 'dark',
    () => 'light' as const,
  );
};

/**
 * Updates the root element className when the theme mode changes.
 * This allows the design-system theme config to be applied.
 */
export const useRootColorModeSideEffect = (
  resolvedColorScheme: 'light' | 'dark',
): void => {
  useLayoutEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(COLOR_SCHEMES.light, COLOR_SCHEMES.dark);
    root.classList.add(resolvedColorScheme);
  }, [resolvedColorScheme]);
};

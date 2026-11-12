import { coreTokens } from '../generated/js/primitives.js';

/**
 * Breakpoint min-widths in px (mobile-first). Single source for the Tailwind
 * `screens` and any responsive logic in JS.
 */
export const breakpoints = coreTokens.breakpoints;

export type Breakpoint = keyof typeof breakpoints;

/**
 * A value applied at every screen size, or mapped per breakpoint. Mobile-first:
 * each breakpoint applies from its min-width upward, and `base` below the first one.
 */
export type ResponsiveValue<T> = T | Partial<Record<'base' | Breakpoint, T>>;

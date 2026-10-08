export type Breakpoints = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * A value that is either applied at every screen size, or mapped per breakpoint
 * (mobile-first: each breakpoint applies from its min-width upward, `base` below `xs`).
 */
export type ResponsiveValue<T> = T | Partial<Record<'base' | Breakpoints, T>>;

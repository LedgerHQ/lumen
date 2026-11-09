import type { TokenModel } from '@lumen/design-sources';

/** Base breakpoint first; each later one applies from its min-width upward. */
const BREAKPOINT_ORDER = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

/**
 * The breakpoint modes, base first. Every target reads breakpoints from here,
 * so a new Figma breakpoint either builds everywhere or fails everywhere.
 */
export const orderedBreakpoints = (model: TokenModel): string[] => {
  const modes = model.modesOf('breakpoint');
  const unknown = modes.filter((mode) => !BREAKPOINT_ORDER.includes(mode));
  if (unknown.length) {
    throw new Error(
      `Unknown breakpoint(s) ${unknown.join(', ')}: give them a min-width`,
    );
  }
  return [...modes].sort(
    (a, b) => BREAKPOINT_ORDER.indexOf(a) - BREAKPOINT_ORDER.indexOf(b),
  );
};

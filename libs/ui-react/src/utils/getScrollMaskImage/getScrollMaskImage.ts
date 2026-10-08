type GetScrollMaskImageParams = {
  canScrollLeft: boolean;
  canScrollRight: boolean;
  /**
   * Fully transparent band, in px, at each scrollable edge (e.g. under overlay controls).
   * @default 0
   */
  inset?: number;
  /**
   * Length, in px, of the gradient from transparent to opaque after the inset.
   * @default 32
   */
  fade?: number;
};

/**
 * Builds a `mask-image` that fades content out on the sides that can still scroll.
 * Returns `undefined` when nothing overflows, so no mask is applied.
 */
export function getScrollMaskImage({
  canScrollLeft,
  canScrollRight,
  inset = 0,
  fade = 32,
}: GetScrollMaskImageParams): string | undefined {
  if (!canScrollLeft && !canScrollRight) {
    return undefined;
  }
  const opaqueFrom = inset + fade;

  const left = canScrollLeft
    ? `transparent 0px, transparent ${inset}px, black ${opaqueFrom}px`
    : 'black 0px';
  const right = canScrollRight
    ? `black calc(100% - ${opaqueFrom}px), transparent calc(100% - ${inset}px), transparent 100%`
    : 'black 100%';

  return `linear-gradient(to right, ${left}, ${right})`;
}

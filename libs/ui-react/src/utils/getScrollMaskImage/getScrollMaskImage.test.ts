import { describe, it, expect } from 'vitest';
import { getScrollMaskImage } from './getScrollMaskImage';

describe('getScrollMaskImage', () => {
  it('should return undefined when no side can scroll', () => {
    expect(
      getScrollMaskImage({ canScrollLeft: false, canScrollRight: false }),
    ).toBeUndefined();
  });

  it('should fade only the left edge', () => {
    expect(
      getScrollMaskImage({ canScrollLeft: true, canScrollRight: false }),
    ).toBe(
      'linear-gradient(to right, transparent 0px, transparent 0px, black 32px, black 100%)',
    );
  });

  it('should fade only the right edge', () => {
    expect(
      getScrollMaskImage({ canScrollLeft: false, canScrollRight: true }),
    ).toBe(
      'linear-gradient(to right, black 0px, black calc(100% - 32px), transparent calc(100% - 0px), transparent 100%)',
    );
  });

  it('should keep a transparent inset before the fade', () => {
    expect(
      getScrollMaskImage({
        canScrollLeft: true,
        canScrollRight: true,
        inset: 40,
        fade: 32,
      }),
    ).toBe(
      'linear-gradient(to right, transparent 0px, transparent 40px, black 72px, black calc(100% - 72px), transparent calc(100% - 40px), transparent 100%)',
    );
  });
});

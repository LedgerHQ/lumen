import { describe, expect, it } from 'vitest';
import { resolveLottieSource } from './resolveLottieSource';

describe('resolveLottieSource', () => {
  const animation = { light: 'light.lottie', dark: { uri: 'dark.lottie' } };

  it('should pick the variant matching the color scheme', () => {
    expect(resolveLottieSource(animation, 'light')).toBe(animation.light);
    expect(resolveLottieSource(animation, 'dark')).toBe(animation.dark);
  });

  it('should return a URL string as is', () => {
    expect(resolveLottieSource('https://example.com/a.lottie', 'dark')).toBe(
      'https://example.com/a.lottie',
    );
  });

  it('should return a bundled asset id as is', () => {
    expect(resolveLottieSource(1, 'light')).toBe(1);
  });

  it('should return a uri object as is', () => {
    const source = { uri: 'https://example.com/a.lottie' };
    expect(resolveLottieSource(source, 'light')).toBe(source);
  });
});

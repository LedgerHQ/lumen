import { describe, it, expect } from 'vitest';
import { getThemeUtilsByPrefix } from './getThemeUtilsByPrefix.js';

describe('getThemeUtilsByPrefix', () => {
  const realWorldTheme = {
    ':root': {
      '--color-background-canvas': 'var(--color-light-grey-050)',
      '--color-background-white': 'var(--color-light-constant-050)',
      '--color-text-primary': 'var(--color-light-grey-950)',
      '--color-text-secondary': 'var(--color-light-grey-950)',
      '--border-base': 'var(--color-light-grey-950)',
      '--border-muted': 'grey',
      '--border-width-thin': '1px',
      '--border-width-medium': '2px',
    },
  };

  it('should extract utilities and remove the prefix by default', () => {
    const backgroundColors = getThemeUtilsByPrefix(
      realWorldTheme,
      '--color-background-',
    );
    expect(backgroundColors).toEqual({
      canvas: 'var(--color-background-canvas)',
      white: 'var(--color-background-white)',
    });
  });

  it('should replace the search prefix with a custom prefix', () => {
    const textColors = getThemeUtilsByPrefix(realWorldTheme, '--color-text-', {
      customPrefix: 'text-',
    });
    expect(textColors).toEqual({
      'text-primary': 'var(--color-text-primary)',
      'text-secondary': 'var(--color-text-secondary)',
    });
  });

  it('should exclude specified prefixes from the result', () => {
    const borderColors = getThemeUtilsByPrefix(realWorldTheme, '--border-', {
      exclude: ['--border-width-'],
    });

    expect(borderColors).toEqual({
      base: 'var(--border-base)',
      muted: 'var(--border-muted)',
    });
  });

  it('should support both customPrefix and exclude options', () => {
    const borderColors = getThemeUtilsByPrefix(realWorldTheme, '--border-', {
      customPrefix: 'border-',
      exclude: ['--border-width-'],
    });

    expect(borderColors).toEqual({
      'border-base': 'var(--border-base)',
      'border-muted': 'var(--border-muted)',
    });
  });

  it('should return an empty object if no matches are found', () => {
    const result = getThemeUtilsByPrefix(realWorldTheme, '--non-existent-');
    expect(result).toEqual({});
  });
});

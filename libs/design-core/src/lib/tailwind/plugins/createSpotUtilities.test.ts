import { describe, expect, it } from 'vitest';
import { createSpotUtilities } from './createSpotUtilities.js';

type Theme = Parameters<typeof createSpotUtilities>[0];

const createTheme = (themeValues: Record<string, object>): Theme =>
  ((key: string) => themeValues[key]) as Theme;

describe('createSpotUtilities', () => {
  it('should create width and height utilities from the spot tokens', () => {
    const theme = createTheme({
      spotWidth: { 32: 'var(--spot-width-32)', 48: 'var(--spot-width-48)' },
      spotHeight: { 32: 'var(--spot-height-32)' },
    });

    expect(createSpotUtilities(theme)).toEqual({
      '.spot-w-32': { width: 'var(--spot-width-32)' },
      '.spot-w-48': { width: 'var(--spot-width-48)' },
      '.spot-h-32': { height: 'var(--spot-height-32)' },
    });
  });

  it('should ignore inherited keys', () => {
    const theme = createTheme({
      spotWidth: Object.create({ 40: 'var(--spot-width-40)' }),
      spotHeight: Object.create({ 40: 'var(--spot-height-40)' }),
    });

    expect(createSpotUtilities(theme)).toEqual({});
  });

  it('should return no utilities when the spot tokens are missing', () => {
    expect(createSpotUtilities(createTheme({}))).toEqual({});
  });
});

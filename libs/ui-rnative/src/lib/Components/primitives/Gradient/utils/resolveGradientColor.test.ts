import { describe, it, expect } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import {
  resolveGradientColor,
  processGradientStops,
} from './resolveGradientColor';

const bgColors = ledgerLiveThemes.dark.colors.bg;

describe('resolveGradientColor', () => {
  describe('resolveGradientColor', () => {
    it('should resolve background tokens to actual color values', () => {
      const accentColor = resolveGradientColor('accent', bgColors);
      expect(accentColor).toBe(bgColors.accent);
      expect(accentColor).toMatch(/^#|^rgb/);
    });

    it('should pass through raw hex colors unchanged', () => {
      expect(resolveGradientColor('#FF6B6B', bgColors)).toBe('#FF6B6B');
      expect(resolveGradientColor('#000', bgColors)).toBe('#000');
    });

    it('should pass through rgb/rgba colors unchanged', () => {
      expect(resolveGradientColor('rgb(255, 0, 0)', bgColors)).toBe(
        'rgb(255, 0, 0)',
      );
      expect(resolveGradientColor('rgba(255, 0, 0, 0.5)', bgColors)).toBe(
        'rgba(255, 0, 0, 0.5)',
      );
    });

    it('should pass through named CSS colors unchanged', () => {
      expect(resolveGradientColor('red', bgColors)).toBe('red');
      expect(resolveGradientColor('blue', bgColors)).toBe('blue');
    });
  });

  describe('processGradientStops', () => {
    it('should resolve color tokens in stops', () => {
      const stops = [{ color: 'accent' }, { color: 'error' }];
      const processed = processGradientStops(stops, bgColors);

      expect(processed[0].color).toBe(bgColors.accent);
      expect(processed[1].color).toBe(bgColors.error);
    });

    it('should preserve raw colors in stops', () => {
      const stops = [{ color: '#FF6B6B' }, { color: '#4ECDC4' }];
      const processed = processGradientStops(stops, bgColors);

      expect(processed[0].color).toBe('#FF6B6B');
      expect(processed[1].color).toBe('#4ECDC4');
    });

    it('should auto-spread offsets for 2 stops', () => {
      const stops = [{ color: '#FF6B6B' }, { color: '#4ECDC4' }];
      const processed = processGradientStops(stops, bgColors);

      expect(processed[0].offset).toBe(0);
      expect(processed[1].offset).toBe(1);
    });

    it('should auto-spread offsets for 3 stops', () => {
      const stops = [
        { color: '#FF6B6B' },
        { color: '#FFD93D' },
        { color: '#4ECDC4' },
      ];
      const processed = processGradientStops(stops, bgColors);

      expect(processed[0].offset).toBe(0);
      expect(processed[1].offset).toBe(0.5);
      expect(processed[2].offset).toBe(1);
    });

    it('should auto-spread offsets for 4 stops', () => {
      const stops = [
        { color: '#FF6B6B' },
        { color: '#FFD93D' },
        { color: '#6BCB77' },
        { color: '#4ECDC4' },
      ];
      const processed = processGradientStops(stops, bgColors);

      expect(processed[0].offset).toBeCloseTo(0);
      expect(processed[1].offset).toBeCloseTo(0.333, 2);
      expect(processed[2].offset).toBeCloseTo(0.666, 2);
      expect(processed[3].offset).toBeCloseTo(1);
    });

    it('should preserve explicit offsets', () => {
      const stops = [
        { color: '#FF6B6B', offset: 0.1 },
        { color: '#FFD93D', offset: 0.3 },
        { color: '#4ECDC4', offset: 0.9 },
      ];
      const processed = processGradientStops(stops, bgColors);

      expect(processed[0].offset).toBe(0.1);
      expect(processed[1].offset).toBe(0.3);
      expect(processed[2].offset).toBe(0.9);
    });

    it('should default opacity to 1', () => {
      const stops = [{ color: '#FF6B6B' }, { color: '#4ECDC4' }];
      const processed = processGradientStops(stops, bgColors);

      expect(processed[0].opacity).toBe(1);
      expect(processed[1].opacity).toBe(1);
    });

    it('should preserve explicit opacity', () => {
      const stops = [
        { color: '#FF6B6B', opacity: 0.5 },
        { color: '#4ECDC4', opacity: 0.8 },
      ];
      const processed = processGradientStops(stops, bgColors);

      expect(processed[0].opacity).toBe(0.5);
      expect(processed[1].opacity).toBe(0.8);
    });

    it('should handle single stop', () => {
      const stops = [{ color: '#FF6B6B' }];
      const processed = processGradientStops(stops, bgColors);

      expect(processed[0].offset).toBe(0);
      expect(processed[0].opacity).toBe(1);
    });

    it('should handle mixed token and raw colors', () => {
      const stops = [
        { color: 'accent', offset: 0 },
        { color: '#FF6B6B', offset: 0.5 },
        { color: 'error', offset: 1 },
      ];
      const processed = processGradientStops(stops, bgColors);

      expect(processed[0].color).toBe(bgColors.accent);
      expect(processed[1].color).toBe('#FF6B6B');
      expect(processed[2].color).toBe(bgColors.error);
    });
  });
});

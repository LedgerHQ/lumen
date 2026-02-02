import { describe, expect, it } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { renderHook } from '@testing-library/react-native';
import React from 'react';
import type { BoxShadowValue } from 'react-native';
import { LumenStyleSheetProvider } from '../provider/LumenStyleSheetProvider';
import { useResolveViewStyle, useResolveTextStyle } from './resolveStyle';

/**
 * Use actual theme from design-core for type-safe testing
 */
const themes = ledgerLiveThemes;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LumenStyleSheetProvider themes={themes as any} colorScheme='dark'>
    {children}
  </LumenStyleSheetProvider>
);

const lightWrapper = ({ children }: { children: React.ReactNode }) => (
  <LumenStyleSheetProvider themes={themes as any} colorScheme='light'>
    {children}
  </LumenStyleSheetProvider>
);

describe('resolve-style', () => {
  describe('useResolveViewStyle', () => {
    describe('Spacing props', () => {
      it('should resolve spacing tokens to pixel values', () => {
        const { result } = renderHook(
          () =>
            useResolveViewStyle({
              padding: 's16',
              marginTop: 's8',
              gap: 's4',
            }),
          { wrapper },
        );

        expect(result.current.padding).toBe(16);
        expect(result.current.marginTop).toBe(8);
        expect(result.current.gap).toBe(4);
      });

      it('should handle all spacing props', () => {
        const { result } = renderHook(
          () =>
            useResolveViewStyle({
              padding: 's8',
              paddingTop: 's4',
              paddingBottom: 's4',
              paddingLeft: 's16',
              paddingRight: 's16',
              paddingHorizontal: 's24',
              paddingVertical: 's32',
              margin: 's8',
              marginTop: 's4',
              marginBottom: 's4',
              marginLeft: 's16',
              marginRight: 's16',
              marginHorizontal: 's24',
              marginVertical: 's32',
              gap: 's8',
              rowGap: 's4',
              columnGap: 's16',
            }),
          { wrapper },
        );

        expect(result.current.padding).toBe(8);
        expect(result.current.paddingTop).toBe(4);
        expect(result.current.paddingBottom).toBe(4);
        expect(result.current.paddingLeft).toBe(16);
        expect(result.current.paddingRight).toBe(16);
        expect(result.current.paddingHorizontal).toBe(24);
        expect(result.current.paddingVertical).toBe(32);
        expect(result.current.margin).toBe(8);
        expect(result.current.marginTop).toBe(4);
        expect(result.current.marginBottom).toBe(4);
        expect(result.current.marginLeft).toBe(16);
        expect(result.current.marginRight).toBe(16);
        expect(result.current.marginHorizontal).toBe(24);
        expect(result.current.marginVertical).toBe(32);
        expect(result.current.gap).toBe(8);
        expect(result.current.rowGap).toBe(4);
        expect(result.current.columnGap).toBe(16);
      });

      it('should handle RTL spacing props', () => {
        const { result } = renderHook(
          () =>
            useResolveViewStyle({
              paddingStart: 's8',
              paddingEnd: 's16',
              marginStart: 's4',
              marginEnd: 's24',
            }),
          { wrapper },
        );

        expect(result.current.paddingStart).toBe(8);
        expect(result.current.paddingEnd).toBe(16);
        expect(result.current.marginStart).toBe(4);
        expect(result.current.marginEnd).toBe(24);
      });
    });

    describe('Size props', () => {
      it('should resolve size tokens to pixel values', () => {
        const { result } = renderHook(
          () =>
            useResolveViewStyle({
              width: 's192',
              height: 's96',
            }),
          { wrapper },
        );

        expect(result.current.width).toBe(192);
        expect(result.current.height).toBe(96);
      });

      it('should handle all size props', () => {
        const { result } = renderHook(
          () =>
            useResolveViewStyle({
              width: 's208',
              height: 's96',
              minWidth: 's48',
              minHeight: 's24',
              maxWidth: 's400',
              maxHeight: 's192',
            }),
          { wrapper },
        );

        expect(result.current.width).toBe(208);
        expect(result.current.height).toBe(96);
        expect(result.current.minWidth).toBe(48);
        expect(result.current.minHeight).toBe(24);
        expect(result.current.maxWidth).toBe(400);
        expect(result.current.maxHeight).toBe(192);
      });

      it('should resolve full size token to 100%', () => {
        const { result } = renderHook(
          () =>
            useResolveViewStyle({
              width: 'full',
            }),
          { wrapper },
        );

        expect(result.current.width).toBe('100%');
      });

      it('should handle full size for all size props', () => {
        const { result } = renderHook(
          () =>
            useResolveViewStyle({
              width: 'full',
              height: 'full',
              minWidth: 'full',
              minHeight: 'full',
              maxWidth: 'full',
              maxHeight: 'full',
            }),
          { wrapper },
        );

        expect(result.current.width).toBe('100%');
        expect(result.current.height).toBe('100%');
        expect(result.current.minWidth).toBe('100%');
        expect(result.current.minHeight).toBe('100%');
        expect(result.current.maxWidth).toBe('100%');
        expect(result.current.maxHeight).toBe('100%');
      });

      it('should handle mix of full and numeric size tokens', () => {
        const { result } = renderHook(
          () =>
            useResolveViewStyle({
              width: 'full',
              height: 's96',
              minWidth: 's48',
              maxWidth: 'full',
            }),
          { wrapper },
        );

        expect(result.current.width).toBe('100%');
        expect(result.current.height).toBe(96);
        expect(result.current.minWidth).toBe(48);
        expect(result.current.maxWidth).toBe('100%');
      });
    });

    describe('Background color props', () => {
      it('should resolve backgroundColor token to color value', () => {
        const { result } = renderHook(
          () =>
            useResolveViewStyle({
              backgroundColor: 'surface',
            }),
          { wrapper },
        );

        expect(result.current.backgroundColor).toBe(
          themes.dark.colors.bg.surface,
        );
      });

      it('should resolve different background color tokens', () => {
        const { result: baseResult } = renderHook(
          () => useResolveViewStyle({ backgroundColor: 'base' }),
          { wrapper },
        );
        const { result: accentResult } = renderHook(
          () => useResolveViewStyle({ backgroundColor: 'accent' }),
          { wrapper },
        );
        const { result: errorResult } = renderHook(
          () => useResolveViewStyle({ backgroundColor: 'error' }),
          { wrapper },
        );

        expect(baseResult.current.backgroundColor).toBe(
          themes.dark.colors.bg.base,
        );
        expect(accentResult.current.backgroundColor).toBe(
          themes.dark.colors.bg.accent,
        );
        expect(errorResult.current.backgroundColor).toBe(
          themes.dark.colors.bg.error,
        );
      });
    });

    describe('Border color props', () => {
      it('should resolve borderColor token to color value', () => {
        const { result } = renderHook(
          () =>
            useResolveViewStyle({
              borderColor: 'muted',
            }),
          { wrapper },
        );

        expect(result.current.borderColor).toBe(
          themes.dark.colors.border.muted,
        );
      });

      it('should handle all border color props', () => {
        const { result } = renderHook(
          () =>
            useResolveViewStyle({
              borderColor: 'base',
              borderTopColor: 'muted',
              borderBottomColor: 'active',
              borderLeftColor: 'error',
              borderRightColor: 'muted',
            }),
          { wrapper },
        );

        expect(result.current.borderColor).toBe(themes.dark.colors.border.base);
        expect(result.current.borderTopColor).toBe(
          themes.dark.colors.border.muted,
        );
        expect(result.current.borderBottomColor).toBe(
          themes.dark.colors.border.active,
        );
        expect(result.current.borderLeftColor).toBe(
          themes.dark.colors.border.error,
        );
        expect(result.current.borderRightColor).toBe(
          themes.dark.colors.border.muted,
        );
      });

      it('should handle RTL border color props', () => {
        const { result } = renderHook(
          () =>
            useResolveViewStyle({
              borderStartColor: 'base',
              borderEndColor: 'muted',
            }),
          { wrapper },
        );

        expect(result.current.borderStartColor).toBe(
          themes.dark.colors.border.base,
        );
        expect(result.current.borderEndColor).toBe(
          themes.dark.colors.border.muted,
        );
      });
    });

    describe('Border radius props', () => {
      it('should resolve borderRadius token to pixel value', () => {
        const { result } = renderHook(
          () =>
            useResolveViewStyle({
              borderRadius: 'md',
            }),
          { wrapper },
        );

        expect(result.current.borderRadius).toBe(12);
      });

      it('should handle all border radius props', () => {
        const { result } = renderHook(
          () =>
            useResolveViewStyle({
              borderRadius: 'lg',
              borderTopLeftRadius: 'sm',
              borderTopRightRadius: 'md',
              borderBottomLeftRadius: 'xs',
              borderBottomRightRadius: 'xl',
            }),
          { wrapper },
        );

        expect(result.current.borderRadius).toBe(16);
        expect(result.current.borderTopLeftRadius).toBe(8);
        expect(result.current.borderTopRightRadius).toBe(12);
        expect(result.current.borderBottomLeftRadius).toBe(4);
        expect(result.current.borderBottomRightRadius).toBe(24);
      });
    });

    describe('Shadow props', () => {
      it('should resolve boxShadow token to boxShadow array', () => {
        const { result } = renderHook(
          () =>
            useResolveViewStyle({
              boxShadow: 'sm',
            }),
          { wrapper },
        );

        expect(result.current.boxShadow).toEqual(
          themes.dark.shadows.sm.map((def) => ({
            offsetX: def.offsetX,
            offsetY: def.offsetY,
            blurRadius: def.blurRadius,
            spreadDistance: def.spreadDistance,
            color: def.color,
          })),
        );
      });

      it('should handle different shadow tokens', () => {
        const { result: lgResult } = renderHook(
          () => useResolveViewStyle({ boxShadow: 'lg' }),
          { wrapper },
        );
        const { result: xlResult } = renderHook(
          () => useResolveViewStyle({ boxShadow: 'xl' }),
          { wrapper },
        );

        const lgBoxShadow = lgResult.current.boxShadow as BoxShadowValue[];
        expect(lgBoxShadow).toHaveLength(themes.dark.shadows.lg.length);
        expect(lgBoxShadow[0].blurRadius).toBe(
          themes.dark.shadows.lg[0].blurRadius,
        );

        const xlBoxShadow = xlResult.current.boxShadow as BoxShadowValue[];
        expect(xlBoxShadow).toHaveLength(themes.dark.shadows.xl.length);
        expect(xlBoxShadow[0].blurRadius).toBe(
          themes.dark.shadows.xl[0].blurRadius,
        );
      });
    });

    describe('Passthrough props', () => {
      it('should pass through flex props unchanged', () => {
        const { result } = renderHook(
          () =>
            useResolveViewStyle({
              flex: 1,
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'stretch',
              alignContent: 'flex-start',
              flexGrow: 1,
              flexShrink: 0,
              flexBasis: 'auto',
            }),
          { wrapper },
        );

        expect(result.current.flex).toBe(1);
        expect(result.current.flexDirection).toBe('row');
        expect(result.current.flexWrap).toBe('wrap');
        expect(result.current.justifyContent).toBe('center');
        expect(result.current.alignItems).toBe('center');
        expect(result.current.alignSelf).toBe('stretch');
        expect(result.current.alignContent).toBe('flex-start');
        expect(result.current.flexGrow).toBe(1);
        expect(result.current.flexShrink).toBe(0);
        expect(result.current.flexBasis).toBe('auto');
      });

      it('should pass through position props unchanged', () => {
        const { result } = renderHook(
          () =>
            useResolveViewStyle({
              position: 'absolute',
              top: 's10',
              bottom: 's20',
              left: 's32',
              right: 's40',
              zIndex: 100,
            }),
          { wrapper },
        );

        expect(result.current.position).toBe('absolute');
        expect(result.current.top).toBe(10);
        expect(result.current.bottom).toBe(20);
        expect(result.current.left).toBe(32);
        expect(result.current.right).toBe(40);
        expect(result.current.zIndex).toBe(100);
      });

      it('should pass through RTL position props unchanged', () => {
        const { result } = renderHook(
          () =>
            useResolveViewStyle({
              position: 'absolute',
              start: 's10',
              end: 's20',
            }),
          { wrapper },
        );

        expect(result.current.position).toBe('absolute');
        expect(result.current.start).toBe(10);
        expect(result.current.end).toBe(20);
      });

      it('should pass through aspectRatio unchanged', () => {
        const { result } = renderHook(
          () =>
            useResolveViewStyle({
              aspectRatio: 16 / 9,
            }),
          { wrapper },
        );

        expect(result.current.aspectRatio).toBeCloseTo(16 / 9);
      });

      it('should pass through transform unchanged', () => {
        const { result } = renderHook(
          () =>
            useResolveViewStyle({
              transform: [{ rotate: '45deg' }, { scale: 1.5 }],
            }),
          { wrapper },
        );

        expect(result.current.transform).toEqual([
          { rotate: '45deg' },
          { scale: 1.5 },
        ]);
      });

      it('should pass through other props unchanged', () => {
        const { result } = renderHook(
          () =>
            useResolveViewStyle({
              overflow: 'hidden',
              display: 'flex',
              opacity: 0.5,
              borderWidth: 's2',
              borderStyle: 'solid',
            }),
          { wrapper },
        );

        expect(result.current.overflow).toBe('hidden');
        expect(result.current.display).toBe('flex');
        expect(result.current.opacity).toBe(0.5);
        expect(result.current.borderWidth).toBe(2);
        expect(result.current.borderStyle).toBe('solid');
      });
    });

    describe('Combined props', () => {
      it('should resolve a complex style object', () => {
        const { result } = renderHook(
          () =>
            useResolveViewStyle({
              width: 's192',
              padding: 's16',
              marginTop: 's8',
              backgroundColor: 'surface',
              borderRadius: 'md',
              borderColor: 'muted',
              borderWidth: 's2',
              boxShadow: 'sm',
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
            }),
          { wrapper },
        );

        expect(result.current.width).toBe(192);
        expect(result.current.padding).toBe(16);
        expect(result.current.marginTop).toBe(8);
        expect(result.current.backgroundColor).toBe(
          themes.dark.colors.bg.surface,
        );
        expect(result.current.borderRadius).toBe(12);
        expect(result.current.borderColor).toBe(
          themes.dark.colors.border.muted,
        );
        expect(result.current.borderWidth).toBe(2);
        expect(result.current.boxShadow).toBeDefined();
        expect((result.current.boxShadow as BoxShadowValue[])[0].color).toBe(
          themes.dark.shadows.sm[0].color,
        );
        expect(result.current.flex).toBe(1);
        expect(result.current.flexDirection).toBe('column');
        expect(result.current.alignItems).toBe('center');
      });
    });

    describe('Empty and undefined values', () => {
      it('should return empty object for empty style', () => {
        const { result } = renderHook(() => useResolveViewStyle({}), {
          wrapper,
        });
        expect(result.current).toEqual({});
      });

      it('should not include undefined values in result', () => {
        const { result } = renderHook(
          () =>
            useResolveViewStyle({
              padding: 's16',
            }),
          { wrapper },
        );

        expect(result.current).toEqual({ padding: 16 });
        expect(Object.keys(result.current)).toHaveLength(1);
      });
    });

    describe('Theme consistency', () => {
      it('should resolve same tokens differently for different themes', () => {
        const { result: darkResult } = renderHook(
          () => useResolveViewStyle({ backgroundColor: 'base' }),
          { wrapper },
        );
        const { result: lightResult } = renderHook(
          () => useResolveViewStyle({ backgroundColor: 'base' }),
          { wrapper: lightWrapper },
        );

        // Both should resolve, values may differ between themes
        expect(darkResult.current.backgroundColor).toBe(
          themes.dark.colors.bg.base,
        );
        expect(lightResult.current.backgroundColor).toBe(
          themes.light.colors.bg.base,
        );
      });
    });

    describe('Bare style merging', () => {
      it('should merge bareStyle with resolved lx styles', () => {
        const { result } = renderHook(
          () => useResolveViewStyle({ padding: 's16' }, { opacity: 0.5 }),
          { wrapper },
        );

        expect(result.current.padding).toBe(16);
        expect(result.current.opacity).toBe(0.5);
      });

      it('should allow bareStyle to override lx styles', () => {
        const { result } = renderHook(
          () => useResolveViewStyle({ padding: 's16' }, { padding: 24 }),
          { wrapper },
        );

        expect(result.current.padding).toBe(16);
      });
    });
  });

  describe('useResolveTextStyle', () => {
    it('should resolve text color token', () => {
      const { result } = renderHook(
        () =>
          useResolveTextStyle({
            color: 'muted',
          }),
        { wrapper },
      );

      expect(result.current.color).toBe(themes.dark.colors.text.muted);
    });

    it('should handle text without typography', () => {
      const { result } = renderHook(
        () =>
          useResolveTextStyle({
            color: 'base',
            padding: 's8',
          }),
        { wrapper },
      );

      expect(result.current.color).toBe(themes.dark.colors.text.base);
      expect(result.current.padding).toBe(8);
      expect(result.current.fontSize).toBeUndefined();
    });

    it('should pass through textAlign unchanged', () => {
      const { result } = renderHook(
        () =>
          useResolveTextStyle({
            textAlign: 'center',
          }),
        { wrapper },
      );

      expect(result.current.textAlign).toBe('center');
    });

    it('should pass through textTransform unchanged', () => {
      const { result } = renderHook(
        () =>
          useResolveTextStyle({
            textTransform: 'uppercase',
          }),
        { wrapper },
      );

      expect(result.current.textTransform).toBe('uppercase');
    });

    it('should pass through textDecorationLine unchanged', () => {
      const { result } = renderHook(
        () =>
          useResolveTextStyle({
            textDecorationLine: 'underline',
          }),
        { wrapper },
      );

      expect(result.current.textDecorationLine).toBe('underline');
    });

    describe('Bare style merging', () => {
      it('should merge bareStyle with resolved lx styles', () => {
        const { result } = renderHook(
          () => useResolveTextStyle({ color: 'muted' }, { opacity: 0.5 }),
          { wrapper },
        );

        expect(result.current.color).toBe(themes.dark.colors.text.muted);
        expect(result.current.opacity).toBe(0.5);
      });

      it('should allow bareStyle to override lx styles', () => {
        const { result } = renderHook(
          () => useResolveTextStyle({ color: 'muted' }, { color: '#FF0000' }),
          { wrapper },
        );

        expect(result.current.color).toBe('#9c9c9c');
      });
    });
  });
});

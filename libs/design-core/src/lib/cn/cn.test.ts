import { describe, it, expect } from 'vitest';

import { cn } from './cn';

describe('cn', () => {
  describe('class composition', () => {
    it('returns an empty string without inputs', () => {
      expect(cn()).toBe('');
      expect(cn('')).toBe('');
    });

    it('joins strings', () => {
      expect(cn('flex', 'items-center')).toBe('flex items-center');
    });

    it('drops falsy values', () => {
      expect(cn('flex', false, null, undefined, 0, '', 'gap-8')).toBe(
        'flex gap-8',
      );
    });

    it('applies conditional objects', () => {
      expect(cn('flex', { underline: true, italic: false })).toBe(
        'flex underline',
      );
    });

    it('flattens nested arrays', () => {
      expect(cn(['flex', ['items-center', ['gap-8']]])).toBe(
        'flex items-center gap-8',
      );
    });

    it('normalizes whitespace', () => {
      expect(cn('  flex   items-center ', '\ngap-8\t')).toBe(
        'flex items-center gap-8',
      );
    });

    it('keeps classes Tailwind does not know about', () => {
      expect(cn('lumen-root', 'my-custom-class', 'p-8')).toBe(
        'lumen-root my-custom-class p-8',
      );
    });

    it('lets the caller className override the base classes', () => {
      const className = 'bg-accent p-16';
      expect(cn('flex bg-muted p-8', className)).toBe('flex bg-accent p-16');
    });
  });

  describe('standard Tailwind merging', () => {
    it('keeps the last class of a conflicting pair', () => {
      expect(cn('p-8', 'p-16')).toBe('p-16');
      expect(cn('rounded-md', 'rounded-full')).toBe('rounded-full');
      expect(cn('rounded-2xl', 'rounded-xxs')).toBe('rounded-xxs');
      expect(cn('rounded-t-xxs', 'rounded-t-md')).toBe('rounded-t-md');
      expect(cn('flex', 'hidden')).toBe('hidden');
    });

    it('lets a shorthand drop earlier longhands, not the reverse', () => {
      expect(cn('px-8', 'p-16')).toBe('p-16');
      expect(cn('p-16', 'px-8')).toBe('p-16 px-8');
    });

    it('scopes conflicts to the same variant', () => {
      expect(cn('p-8', 'md:p-16')).toBe('p-8 md:p-16');
      expect(cn('hover:bg-muted', 'hover:bg-accent')).toBe('hover:bg-accent');
      expect(cn('md:hover:p-8', 'md:hover:p-16')).toBe('md:hover:p-16');
    });

    it('treats important and arbitrary values as their utility', () => {
      expect(cn('p-8', 'p-[3px]')).toBe('p-[3px]');
      expect(cn('!p-8', '!p-16')).toBe('!p-16');
      expect(cn('!p-8', 'p-16')).toBe('!p-8 p-16');
    });

    it('merges Lumen color tokens within the same property', () => {
      expect(cn('bg-muted', 'bg-accent')).toBe('bg-accent');
      expect(cn('border-muted', 'border-error')).toBe('border-error');
      expect(cn('bg-crypto-btc', 'bg-muted')).toBe('bg-muted');
    });

    it('keeps color and width utilities that share a prefix', () => {
      expect(cn('border-muted', 'border-2')).toBe('border-muted border-2');
    });

    it('keeps shadow size and shadow color together', () => {
      expect(cn('shadow-md', 'shadow-lg')).toBe('shadow-lg');
      expect(cn('shadow-md', 'shadow-muted')).toBe('shadow-md shadow-muted');
    });

    it('lets size drop earlier width and height', () => {
      expect(cn('w-40 h-40', 'size-48')).toBe('size-48');
      expect(cn('size-48', 'w-40')).toBe('size-48 w-40');
    });
  });

  describe('Lumen config', () => {
    describe('text colors', () => {
      it('treats text-base as a color, not a font size', () => {
        expect(cn('text-base', 'text-muted')).toBe('text-muted');
        expect(cn('text-muted', 'text-base')).toBe('text-base');
        expect(cn('text-base', 'text-muted-subtle')).toBe('text-muted-subtle');
      });

      it('keeps text alignment next to a text color', () => {
        expect(cn('text-base', 'text-center')).toBe('text-base text-center');
      });

      it('keeps arbitrary font sizes next to a text color', () => {
        expect(cn('text-[14px]', 'text-base')).toBe('text-[14px] text-base');
        expect(cn('text-[14px]', 'text-[16px]')).toBe('text-[16px]');
      });
    });

    describe('typography', () => {
      const typographyClasses = [
        ...['1', '2', '3', '4'].map((step) => `responsive-display-${step}`),
        ...['0', '1', '2', '3', '4', '5'].flatMap((step) => [
          `heading-${step}`,
          `heading-${step}-semi-bold`,
        ]),
        ...['1', '2', '3', '4'].flatMap((step) => [
          `body-${step}`,
          `body-${step}-semi-bold`,
        ]),
      ];

      it.each(typographyClasses)('%s overrides an earlier style', (name) => {
        const previous = name === 'body-1' ? 'body-2' : 'body-1';
        expect(cn(previous, name)).toBe(name);
      });

      it('merges across typography families', () => {
        expect(cn('heading-1', 'body-2')).toBe('body-2');
        expect(cn('body-2', 'responsive-display-1')).toBe(
          'responsive-display-1',
        );
        expect(cn('body-1', 'body-1-semi-bold')).toBe('body-1-semi-bold');
      });

      it('drops earlier font utilities it sets itself', () => {
        expect(
          cn(
            'text-[14px] font-bold font-mono leading-tight tracking-wide',
            'body-2',
          ),
        ).toBe('body-2');
      });

      it('keeps later font utilities as partial overrides', () => {
        expect(cn('body-2', 'font-bold')).toBe('body-2 font-bold');
        expect(cn('body-2', 'leading-tight')).toBe('body-2 leading-tight');
      });

      it('keeps the text color', () => {
        expect(cn('body-2 text-muted', 'body-1')).toBe('text-muted body-1');
      });

      it('merges per breakpoint', () => {
        expect(cn('md:body-1', 'md:body-2')).toBe('md:body-2');
        expect(cn('body-1', 'md:body-2')).toBe('body-1 md:body-2');
      });

      it('ignores steps outside the scale', () => {
        expect(cn('body-5', 'body-1')).toBe('body-5 body-1');
      });
    });

    describe('gradients', () => {
      it('keeps a gradient next to a background color', () => {
        expect(cn('bg-gradient-top', 'bg-muted')).toBe(
          'bg-gradient-top bg-muted',
        );
        expect(cn('bg-muted', 'bg-gradient-btc')).toBe(
          'bg-muted bg-gradient-btc',
        );
      });

      it('treats gradient color tokens as background colors', () => {
        expect(cn('bg-accent', 'bg-gradient-0')).toBe('bg-gradient-0');
        expect(cn('bg-gradient-overlay-80', 'bg-accent')).toBe('bg-accent');
        expect(cn('bg-gradient-top', 'bg-gradient-80')).toBe(
          'bg-gradient-top bg-gradient-80',
        );
      });

      it('merges gradients with other background images', () => {
        expect(cn('bg-gradient-top', 'bg-gradient-bottom')).toBe(
          'bg-gradient-bottom',
        );
        expect(cn('bg-linear-to-r', 'bg-gradient-error')).toBe(
          'bg-gradient-error',
        );
      });
    });
  });
});

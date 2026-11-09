import { createTokenModel, type Token } from '@lumen/design-sources';
import { describe, expect, it } from 'vitest';
import { coreFiles, orderedBreakpoints } from './selections.js';
import {
  hexToRgba,
  motion,
  shadowUtilities,
  typographyUtilities,
} from './tailwindBlocks.js';

const model = createTokenModel();
const core = coreFiles(model);
const coreTokens = model.tokens(core);
const resolve = (token: Token): unknown => model.resolve(token, core);

describe('hexToRgba', () => {
  it.each([
    ['#0000001a', 'rgba(0, 0, 0, 0.10)'],
    ['#00000040', 'rgba(0, 0, 0, 0.25)'],
    ['#ffffff', 'rgba(255, 255, 255, 1.00)'],
  ])('%s → %s', (hex, rgba) => {
    expect(hexToRgba(hex)).toBe(rgba);
  });
});

describe('Tailwind building blocks', () => {
  it('writes one typography class per style, reading breakpoint-aware variables', () => {
    const tokens = model
      .tokens(
        model.select(['primitives', 'breakpoint'], {
          breakpoint: orderedBreakpoints(model)[0],
        }),
      )
      .filter(({ source }) => source.collection === 'breakpoint');
    const utilities = typographyUtilities(tokens);

    expect(utilities['.heading-0-semi-bold']).toMatchObject({
      'font-weight': 'var(--font-style-heading-0-weight-semi-bold)',
    });
    expect(utilities['.responsive-display-1']).toMatchObject({
      'font-weight': 'var(--font-style-responsive-display-1-weight)',
    });
  });

  it('writes shadows through --tw-shadow-color', () => {
    expect(shadowUtilities(coreTokens, resolve)['.shadow-2xl']).toEqual({
      '--tw-shadow':
        '0 25px 50px -12px var(--tw-shadow-color, rgba(0, 0, 0, 0.25))',
      'box-shadow': 'var(--tw-shadow)',
    });
  });

  it('writes durations in ms and easings as cubic-bezier()', () => {
    const { durations, easings } = motion(coreTokens, resolve);

    expect(durations['300']).toBe('300ms');
    expect(easings['ease-in-out']).toBe('cubic-bezier(0.4, 0, 0.2, 1)');
  });
});

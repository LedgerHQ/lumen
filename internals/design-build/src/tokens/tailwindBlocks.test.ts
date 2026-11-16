import { createTokenModel, type Token } from '@lumen/design-sources';
import { describe, expect, it } from 'vitest';
import { coreFiles, orderedBreakpoints } from './modes.js';
import { motion, typographyUtilities } from './tailwindBlocks.js';

const model = createTokenModel();
const core = coreFiles(model);
const coreTokens = model.tokens(core);
const resolve = (token: Token): unknown => model.resolve(token, core);

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

  it('writes durations in ms and easings as cubic-bezier()', () => {
    const { durations, easings } = motion(coreTokens, resolve);

    expect(durations['300']).toBe('300ms');
    expect(easings['ease-in-out']).toBe('cubic-bezier(0.4, 0, 0.2, 1)');
  });
});

import { describe, it, expect, expectTypeOf } from 'vitest';

import { cssVar } from './cssVar';
import type { CSSVarName, CSSVarRef } from './cssVar';

describe('cssVar', () => {
  it('returns the input string unchanged', () => {
    expect(cssVar('var(--stroke-1)')).toBe('var(--stroke-1)');
    expect(cssVar('var(--text-muted)')).toBe('var(--text-muted)');
    expect(cssVar('var(--border-muted)')).toBe('var(--border-muted)');
  });

  it('accepts known primitive tokens', () => {
    expectTypeOf(cssVar('var(--stroke-1)')).toEqualTypeOf<CSSVarRef>();
    expectTypeOf(cssVar('var(--stroke-2)')).toEqualTypeOf<CSSVarRef>();
    expectTypeOf(cssVar('var(--spacing-8)')).toEqualTypeOf<CSSVarRef>();
    expectTypeOf(cssVar('var(--font-family-font)')).toEqualTypeOf<CSSVarRef>();
    expectTypeOf(cssVar('var(--border-radius-md)')).toEqualTypeOf<CSSVarRef>();
  });

  it('accepts known semantic tokens', () => {
    expectTypeOf(cssVar('var(--text-muted)')).toEqualTypeOf<CSSVarRef>();
    expectTypeOf(cssVar('var(--text-base)')).toEqualTypeOf<CSSVarRef>();
    expectTypeOf(cssVar('var(--border-muted)')).toEqualTypeOf<CSSVarRef>();
    expectTypeOf(
      cssVar('var(--border-muted-subtle)'),
    ).toEqualTypeOf<CSSVarRef>();
    expectTypeOf(cssVar('var(--background-base)')).toEqualTypeOf<CSSVarRef>();
    expectTypeOf(
      cssVar('var(--font-style-body-4-size)'),
    ).toEqualTypeOf<CSSVarRef>();
  });

  it('rejects raw color primitives at the type level', () => {
    // @ts-expect-error -- raw light color primitives must not be used directly
    cssVar('var(--color-light-grey-100)');
    // @ts-expect-error -- raw dark color primitives must not be used directly
    cssVar('var(--color-dark-grey-100)');
  });

  it('rejects unknown tokens at the type level', () => {
    // @ts-expect-error -- completely invalid token name
    cssVar('var(--does-not-exist)');
    // @ts-expect-error -- missing var() wrapper
    cssVar('--stroke-1');
  });

  it('CSSVarName excludes raw color primitives', () => {
    expectTypeOf<'--stroke-1'>().toMatchTypeOf<CSSVarName>();
    expectTypeOf<'--text-muted'>().toMatchTypeOf<CSSVarName>();
    expectTypeOf<'--color-light-grey-100'>().not.toMatchTypeOf<CSSVarName>();
    expectTypeOf<'--color-dark-grey-100'>().not.toMatchTypeOf<CSSVarName>();
  });
});

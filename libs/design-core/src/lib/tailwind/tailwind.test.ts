import { beforeAll, describe, expect, it } from 'vitest';
import { normalizeCss } from './testing/cssFingerprint.js';
import { loadDesignSystem, lumenCss } from './testing/loadTailwind.js';

type DesignSystem = Awaited<ReturnType<typeof loadDesignSystem>>;

/**
 * A few real classes compiled from `ledger-live.css`, read as CSS. The token
 * utilities are generated and committed, so `design-build check` already
 * guards them; these mostly guard the hand-written `lumen.css`, which nothing
 * else does.
 */
describe('Lumen Tailwind classes', () => {
  let lumen: DesignSystem;
  // Without the `@property` registrations Tailwind appends to its own utilities.
  const css = (className: string): string =>
    normalizeCss(lumen.candidatesToCss([className])[0] ?? '').replace(
      / @property [^{]+\{[^}]*\}/g,
      '',
    );

  beforeAll(async () => {
    lumen = await loadDesignSystem(lumenCss('ledger-live.css'));
  });

  it('maps token utilities to their variables', () => {
    expect(css('bg-base')).toMatchInlineSnapshot(
      `".bg-base { background-color: var(--background-base) }"`,
    );
    expect(css('text-muted')).toMatchInlineSnapshot(
      `".text-muted { color: var(--text-muted) }"`,
    );
    expect(css('p-16')).toMatchInlineSnapshot(
      `".p-16 { padding: var(--spacing-16) }"`,
    );
    expect(css('rounded-md')).toMatchInlineSnapshot(
      `".rounded-md { border-radius: var(--border-radius-md) }"`,
    );
    expect(css('heading-0')).toMatchInlineSnapshot(
      `".heading-0 { font-family: var(--font-family-font); font-size: var(--font-style-heading-0-size); font-weight: var(--font-style-heading-0-weight-medium); line-height: var(--font-style-heading-0-line-height); letter-spacing: var(--font-style-heading-0-letter-spacing); -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale }"`,
    );
    expect(css('shadow-md')).toMatchInlineSnapshot(
      `".shadow-md { --tw-shadow: var(--shadow-md); box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow) }"`,
    );
  });

  it('keeps the hand-written wiring of lumen.css', () => {
    expect(css('dark:bg-base')).toMatchInlineSnapshot(
      `".dark\\:bg-base { &:is(.dark *) { background-color: var(--background-base) } }"`,
    );
    expect(css('md:p-16')).toMatchInlineSnapshot(
      `".md\\:p-16 { @media (width >= 768px) { padding: var(--spacing-16) } }"`,
    );
    expect(css('animate-fade-in')).toMatchInlineSnapshot(
      `".animate-fade-in { animation: fade-in 300ms ease-in }"`,
    );
    expect(css('z-dialog-content')).toMatchInlineSnapshot(
      `".z-dialog-content { z-index: 100 }"`,
    );
    expect(css('scrollbar-none')).toMatchInlineSnapshot(
      `".scrollbar-none { scrollbar-width: none; &::-webkit-scrollbar { display: none } }"`,
    );
    expect(css('mask-fade-y')).toMatchInlineSnapshot(
      `".mask-fade-y { -webkit-mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent); mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent) }"`,
    );
  });

  it('drops the Tailwind defaults Lumen replaces with tokens', () => {
    for (const className of [
      'text-lg',
      'font-bold',
      'leading-tight',
      'bg-red-500',
    ]) {
      expect(css(className), className).toBe('');
    }
  });
});

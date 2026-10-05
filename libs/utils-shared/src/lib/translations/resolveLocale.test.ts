import { resolveLocale } from './resolveLocale';

const supported = ['en', 'fr', 'zh'] as const;

describe('resolveLocale', () => {
  it('returns an exact match', () => {
    expect(resolveLocale('fr', supported, 'en')).toBe('fr');
  });

  it('matches case-insensitively', () => {
    expect(resolveLocale('FR', supported, 'en')).toBe('fr');
  });

  it('falls back to the base language of a regional locale', () => {
    expect(resolveLocale('fr-FR', supported, 'en')).toBe('fr');
    expect(resolveLocale('zh_CN', supported, 'en')).toBe('zh');
  });

  it('returns the fallback for an unsupported locale', () => {
    expect(resolveLocale('it', supported, 'en')).toBe('en');
    expect(resolveLocale('it-IT', supported, 'en')).toBe('en');
  });

  it('returns the fallback when no locale is given', () => {
    expect(resolveLocale(undefined, supported, 'en')).toBe('en');
    expect(resolveLocale('', supported, 'en')).toBe('en');
  });
});

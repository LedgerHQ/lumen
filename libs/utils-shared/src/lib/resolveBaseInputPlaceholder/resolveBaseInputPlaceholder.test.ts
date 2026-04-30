import { describe, expect, it } from 'vitest';
import { resolveBaseInputPlaceholder } from './resolveBaseInputPlaceholder';

describe('resolveBaseInputPlaceholder', () => {
  it('with label: uses a single space when no user placeholder (float hack)', () => {
    expect(
      resolveBaseInputPlaceholder({ label: 'Email', placeholder: undefined }),
    ).toEqual({
      inputPlaceholder: ' ',
      labelStaysFloatedWithPlaceholder: false,
    });
  });

  it('with label: uses user placeholder and keeps label floated alongside it', () => {
    expect(
      resolveBaseInputPlaceholder({
        label: 'Username',
        placeholder: 'jane.doe',
      }),
    ).toEqual({
      inputPlaceholder: 'jane.doe',
      labelStaysFloatedWithPlaceholder: true,
    });
  });

  it('with label: treats whitespace-only placeholder as absent', () => {
    expect(
      resolveBaseInputPlaceholder({ label: 'x', placeholder: '   ' }),
    ).toEqual({
      inputPlaceholder: ' ',
      labelStaysFloatedWithPlaceholder: false,
    });
  });

  it('without label: defaults omitted placeholder to a single space', () => {
    expect(
      resolveBaseInputPlaceholder({ label: undefined, placeholder: undefined }),
    ).toEqual({
      inputPlaceholder: ' ',
      labelStaysFloatedWithPlaceholder: false,
    });
  });

  it('without label: passes through user placeholder', () => {
    expect(
      resolveBaseInputPlaceholder({ label: undefined, placeholder: 'Search' }),
    ).toEqual({
      inputPlaceholder: 'Search',
      labelStaysFloatedWithPlaceholder: false,
    });
  });

  it('without label: keeps empty string (not coerced to space)', () => {
    expect(
      resolveBaseInputPlaceholder({ label: undefined, placeholder: '' }),
    ).toEqual({
      inputPlaceholder: '',
      labelStaysFloatedWithPlaceholder: false,
    });
  });
});

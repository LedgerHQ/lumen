import { describe, expect, it } from 'vitest';
import { interpolate } from './interpolate';

describe('interpolate', () => {
  it('returns the template unchanged without params', () => {
    expect(interpolate('Page {{page}}')).toBe('Page {{page}}');
  });

  it('replaces a placeholder with a string or number param', () => {
    expect(interpolate('Trend up {{value}}', { value: '2.00%' })).toBe(
      'Trend up 2.00%',
    );
    expect(interpolate('Page {{page}}', { page: 3 })).toBe('Page 3');
  });

  it('replaces several placeholders, including repeated ones', () => {
    expect(
      interpolate('Step {{current}} of {{total}} ({{current}})', {
        current: 2,
        total: 5,
      }),
    ).toBe('Step 2 of 5 (2)');
  });

  it('allows whitespace inside the braces', () => {
    expect(interpolate('Page {{ page }}', { page: 1 })).toBe('Page 1');
  });

  it('keeps placeholders that have no matching param', () => {
    expect(interpolate('Step {{current}} of {{total}}', { current: 2 })).toBe(
      'Step 2 of {{total}}',
    );
  });

  it('ignores inherited object properties', () => {
    expect(interpolate('{{constructor}}', {})).toBe('{{constructor}}');
  });

  it('does not escape HTML in params', () => {
    expect(interpolate('{{value}}', { value: '<b>' })).toBe('<b>');
  });
});

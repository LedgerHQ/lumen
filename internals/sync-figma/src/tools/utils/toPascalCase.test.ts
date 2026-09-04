import { describe, it, expect } from 'vitest';
import { toPascalCase } from './toPascalCase.js';

describe('toPascalCase', () => {
  it('should convert kebab-case, snake_case, and spaces to PascalCase', () => {
    expect(toPascalCase('arrow-up')).toBe('ArrowUp');
    expect(toPascalCase('chevron_down')).toBe('ChevronDown');
    expect(toPascalCase('external link')).toBe('ExternalLink');
    expect(toPascalCase('settings alt-2_variant')).toBe('SettingsAlt2Variant');
  });

  it('should handle empty string, numbers, and consecutive separators', () => {
    expect(toPascalCase('')).toBe('');
    expect(toPascalCase('icon-24')).toBe('Icon24');
    expect(toPascalCase('arrow--up')).toBe('ArrowUp');
    expect(toPascalCase('-arrow-up')).toBe('ArrowUp');
  });
});

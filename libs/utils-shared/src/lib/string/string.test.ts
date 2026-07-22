import { describe, it, expect } from 'vitest';
import { hashString, toPascalCase } from './string.js';

describe('toPascalCase', () => {
  it('should convert kebab-case to PascalCase', () => {
    expect(toPascalCase('arrow-up')).toBe('ArrowUp');
    expect(toPascalCase('chevron-down')).toBe('ChevronDown');
    expect(toPascalCase('external-link')).toBe('ExternalLink');
    expect(toPascalCase('settings-alt-2')).toBe('SettingsAlt2');
  });

  it('should convert snake_case to PascalCase', () => {
    expect(toPascalCase('arrow_up')).toBe('ArrowUp');
    expect(toPascalCase('chevron_down')).toBe('ChevronDown');
    expect(toPascalCase('external_link')).toBe('ExternalLink');
    expect(toPascalCase('settings_alt_2')).toBe('SettingsAlt2');
  });

  it('should convert space-separated words to PascalCase', () => {
    expect(toPascalCase('arrow up')).toBe('ArrowUp');
    expect(toPascalCase('chevron down')).toBe('ChevronDown');
    expect(toPascalCase('external link')).toBe('ExternalLink');
  });

  it('should handle mixed separators', () => {
    expect(toPascalCase('arrow-up_down')).toBe('ArrowUpDown');
    expect(toPascalCase('external_link-icon')).toBe('ExternalLinkIcon');
    expect(toPascalCase('settings alt-2_variant')).toBe('SettingsAlt2Variant');
  });

  it('should handle single words', () => {
    expect(toPascalCase('arrow')).toBe('Arrow');
    expect(toPascalCase('icon')).toBe('Icon');
    expect(toPascalCase('button')).toBe('Button');
  });

  it('should handle already PascalCase strings', () => {
    expect(toPascalCase('ArrowUp')).toBe('Arrowup');
    expect(toPascalCase('ExternalLink')).toBe('Externallink');
    // Note: This behavior converts already PascalCase to lowercase except first letter
    // because it treats the whole string as one word without separators
  });

  it('should handle empty string', () => {
    expect(toPascalCase('')).toBe('');
  });

  it('should handle strings with numbers', () => {
    expect(toPascalCase('icon-24')).toBe('Icon24');
    expect(toPascalCase('chart_1')).toBe('Chart1');
    expect(toPascalCase('version 2')).toBe('Version2');
    expect(toPascalCase('api-v1-endpoint')).toBe('ApiV1Endpoint');
  });

  it('should handle multiple consecutive separators', () => {
    expect(toPascalCase('arrow--up')).toBe('ArrowUp');
    expect(toPascalCase('external__link')).toBe('ExternalLink');
    expect(toPascalCase('icon  button')).toBe('IconButton');
    expect(toPascalCase('mixed-_-separators')).toBe('MixedSeparators');
  });

  it('should handle separators at the beginning and end', () => {
    expect(toPascalCase('-arrow-up')).toBe('ArrowUp');
    expect(toPascalCase('_external-link_')).toBe('ExternalLink');
    expect(toPascalCase(' icon button ')).toBe('IconButton');
    expect(toPascalCase('--start-end--')).toBe('StartEnd');
  });

  it('should handle strings with special characters mixed with separators', () => {
    expect(toPascalCase('icon-24px')).toBe('Icon24px');
    expect(toPascalCase('api_v2.0')).toBe('ApiV2.0');
  });

  it('should handle case variations in input', () => {
    expect(toPascalCase('ARROW-UP')).toBe('ArrowUp');
    expect(toPascalCase('ExTerNaL-LiNk')).toBe('ExternalLink');
    expect(toPascalCase('mixed_CASE_string')).toBe('MixedCaseString');
  });

  it('should handle single character segments', () => {
    expect(toPascalCase('a-b-c')).toBe('ABC');
    expect(toPascalCase('x_y_z')).toBe('XYZ');
    expect(toPascalCase('i o s')).toBe('IOS');
  });
});

describe('hashString', () => {
  it('should be deterministic for the same input', () => {
    expect(hashString('user-123')).toBe(hashString('user-123'));
  });

  it('should produce different hashes for different inputs', () => {
    expect(hashString('user-1')).not.toBe(hashString('user-2'));
  });

  it('should return 0 for an empty string', () => {
    expect(hashString('')).toBe(0);
  });
});

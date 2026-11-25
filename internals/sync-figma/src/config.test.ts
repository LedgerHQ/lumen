import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { automationConfig } from './config.js';

describe('automationConfig', () => {
  it('points at the real folders, whatever the working directory', () => {
    expect(existsSync(automationConfig.figmaTokensPath)).toBe(true);
    expect(existsSync(automationConfig.iconsPath)).toBe(true);
    expect(existsSync(automationConfig.codeSyntaxPath)).toBe(true);
  });
});

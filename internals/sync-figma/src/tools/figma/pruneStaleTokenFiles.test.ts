import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { pruneStaleTokenFiles } from './pruneStaleTokenFiles.js';

describe('pruneStaleTokenFiles', () => {
  let outputDir: string;

  beforeEach(() => {
    outputDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tokens-'));
  });

  afterEach(() => {
    fs.rmSync(outputDir, { recursive: true, force: true });
  });

  const write = (fileName: string): void =>
    fs.writeFileSync(path.join(outputDir, fileName), '{}');

  it('deletes token files the export no longer produces', () => {
    write('3.brand.ledger-live.json');
    write('3.brand.ledger-wallet.json');

    const deleted = pruneStaleTokenFiles(outputDir, [
      '3.brand.ledger-live.json',
    ]);

    expect(deleted).toEqual(['3.brand.ledger-wallet.json']);
    expect(fs.readdirSync(outputDir)).toEqual(['3.brand.ledger-live.json']);
  });

  it('leaves non-JSON files and folders alone', () => {
    write('1.primitives.value.json');
    write('notes.md');
    fs.mkdirSync(path.join(outputDir, '.claude'));

    const deleted = pruneStaleTokenFiles(outputDir, [
      '1.primitives.value.json',
    ]);

    expect(deleted).toEqual([]);
    expect(fs.readdirSync(outputDir).sort()).toEqual([
      '.claude',
      '1.primitives.value.json',
      'notes.md',
    ]);
  });

  it('refuses to prune when the export is empty', () => {
    write('1.primitives.value.json');

    expect(() => pruneStaleTokenFiles(outputDir, [])).toThrow();
    expect(fs.readdirSync(outputDir)).toEqual(['1.primitives.value.json']);
  });
});

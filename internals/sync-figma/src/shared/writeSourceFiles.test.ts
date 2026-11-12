import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { toJsonFile, writeSourceFiles } from './writeSourceFiles.js';

describe('writeSourceFiles', () => {
  let outputDir: string;

  beforeEach(() => {
    outputDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sources-'));
  });

  afterEach(() => {
    fs.rmSync(outputDir, { recursive: true, force: true });
  });

  const write = (fileName: string): void =>
    fs.writeFileSync(path.join(outputDir, fileName), '{}');

  it('writes the export and deletes the files it no longer produces', () => {
    write('3.brand.ledger-live.json');
    write('3.brand.ledger-wallet.json');

    const result = writeSourceFiles(
      outputDir,
      { '3.brand.ledger-live.json': '{"a":1}' },
      { extension: '.json' },
    );

    expect(result).toEqual({
      written: ['3.brand.ledger-live.json'],
      deleted: ['3.brand.ledger-wallet.json'],
    });
    expect(fs.readdirSync(outputDir)).toEqual(['3.brand.ledger-live.json']);
    expect(
      fs.readFileSync(path.join(outputDir, '3.brand.ledger-live.json'), 'utf8'),
    ).toBe('{"a":1}');
  });

  it('only prunes files with the export’s extension', () => {
    write('check.svg');
    write('downloadData.json');
    fs.mkdirSync(path.join(outputDir, '.claude'));

    const { deleted } = writeSourceFiles(
      outputDir,
      { 'arrow.svg': '<svg/>' },
      { extension: '.svg' },
    );

    expect(deleted).toEqual(['check.svg']);
    expect(fs.readdirSync(outputDir).sort()).toEqual([
      '.claude',
      'arrow.svg',
      'downloadData.json',
    ]);
  });

  it('refuses to write or prune when the export is empty', () => {
    write('1.primitives.value.json');

    expect(() =>
      writeSourceFiles(outputDir, {}, { extension: '.json' }),
    ).toThrow('produced no .json files');
    expect(fs.readdirSync(outputDir)).toEqual(['1.primitives.value.json']);
  });

  it('keeps a case-only rename, on case-insensitive disks too', () => {
    write('airplane.svg');

    const result = writeSourceFiles(
      outputDir,
      { 'Airplane.svg': '<svg id="new"/>' },
      { extension: '.svg' },
    );

    expect(result.deleted).toEqual(['airplane.svg']);
    expect(fs.readdirSync(outputDir)).toEqual(['Airplane.svg']);
    expect(fs.readFileSync(path.join(outputDir, 'Airplane.svg'), 'utf8')).toBe(
      '<svg id="new"/>',
    );
  });

  it.each([
    [{ 'a.svg': '', 'A.svg': '' }, 'differ only by case'],
    [{ '../a.svg': '' }, 'unsafe file name'],
    [{ 'icons/a.svg': '' }, 'unsafe file name'],
  ])('refuses names that would clash or leave the folder', (files, error) => {
    write('kept.svg');

    expect(() =>
      writeSourceFiles(outputDir, files, { extension: '.svg' }),
    ).toThrow(error);
    expect(fs.readdirSync(outputDir)).toEqual(['kept.svg']);
  });

  it('creates the folder on the first export', () => {
    const fresh = path.join(outputDir, 'icons');

    writeSourceFiles(fresh, { 'a.svg': '<svg/>' }, { extension: '.svg' });

    expect(fs.readdirSync(fresh)).toEqual(['a.svg']);
  });
});

describe('toJsonFile', () => {
  it('indents with two spaces and ends with a newline', () => {
    expect(toJsonFile({ a: 1 })).toBe('{\n  "a": 1\n}\n');
  });
});

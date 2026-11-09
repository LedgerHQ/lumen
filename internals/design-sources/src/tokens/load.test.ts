import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  flattenTokens,
  loadTokenSources,
  parseFileName,
  type SourceFile,
} from './load.js';

describe('parseFileName', () => {
  it.each([
    [
      '4.breakpoint.xs.tokens.json',
      { order: 4, collection: 'breakpoint', mode: 'xs' },
    ],
    [
      '1.primitives.value.tokens.json',
      { order: 1, collection: 'primitives', mode: 'value' },
    ],
    ['7.motion.tokens.json', { order: 7, collection: 'motion', mode: null }],
    [
      'shadow.tokens.json',
      { order: Number.MAX_SAFE_INTEGER, collection: 'shadow', mode: null },
    ],
  ])('%s', (fileName, expected) => {
    expect(parseFileName(fileName)).toEqual(expected);
  });

  it('rejects other names', () => {
    expect(() => parseFileName('theme.json')).toThrow(
      'expected <order>.<collection>',
    );
  });
});

describe('loadTokenSources', () => {
  it('reads every committed collection in merge order', () => {
    const sources = loadTokenSources();
    const collections = [
      ...new Set(sources.map(({ collection }) => collection)),
    ];

    expect(collections.slice(0, 7)).toEqual([
      'primitives',
      'theme',
      'brand',
      'breakpoint',
      'icon',
      'spot',
      'motion',
    ]);
    expect(
      sources
        .filter(({ collection }) => collection === 'brand')
        .map(({ mode }) => mode),
    ).toEqual(['enterprise', 'ledger-live', 'websites']);
  });
});

describe('loadTokenSources failures', () => {
  const withSources = (
    files: Record<string, string>,
    run: (dir: string) => void,
  ): void => {
    const dir = mkdtempSync(path.join(os.tmpdir(), 'sources-'));
    for (const [file, contents] of Object.entries(files)) {
      mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
      writeFileSync(path.join(dir, file), contents);
    }
    try {
      run(dir);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  };

  it('refuses to load nothing instead of validating zero tokens', () => {
    withSources({}, (dir) => {
      expect(() => loadTokenSources(dir)).toThrow('No token sources');
    });
    withSources({ 'code/size.tokens.json': '{}' }, (dir) => {
      expect(() => loadTokenSources(dir)).toThrow('No token sources');
    });
  });

  it('names the file that is not valid JSON', () => {
    withSources({ 'figma/1.primitives.value.tokens.json': '{ oops' }, (dir) => {
      expect(() => loadTokenSources(dir)).toThrow(
        'figma/1.primitives.value.tokens.json: not valid JSON',
      );
    });
  });
});

describe('flattenTokens', () => {
  it('inherits group types and keeps the source path', () => {
    const source = {
      file: 'code/shadow.tokens.json',
      origin: 'code',
      order: 99,
      collection: 'shadow',
      mode: null,
      tokens: {
        size: {
          $type: 'dimension',
          sm: { $value: { value: 1, unit: 'px' } },
          md: { $type: 'number', $value: 2 },
        },
      },
    } as unknown as SourceFile;

    expect(flattenTokens(source).map(({ id, $type }) => [id, $type])).toEqual([
      ['size.sm', 'dimension'],
      ['size.md', 'number'],
    ]);
  });
});

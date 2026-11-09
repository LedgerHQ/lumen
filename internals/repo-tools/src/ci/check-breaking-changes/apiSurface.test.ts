import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { readSurface } from './apiSurface.ts';

let tmp: string;
let root: string;

function write(path: string, content: string): void {
  mkdirSync(dirname(join(tmp, path)), { recursive: true });
  writeFileSync(join(tmp, path), content);
}

beforeEach(() => {
  tmp = mkdtempSync(join(tmpdir(), 'api-surface-'));
  root = join(tmp, 'pkg');
  write(
    'pkg-dom/index.d.ts',
    `export type DomProps = { dir?: 'ltr' | 'rtl' };`,
  );
  write(
    'pkg/package.json',
    JSON.stringify({
      name: 'pkg',
      exports: {
        '.': { types: './dist/index.d.ts' },
        './symbols/*': './icons/*',
      },
      peerDependencies: { react: '^19.0.0' },
    }),
  );
  write(
    'pkg/dist/index.d.ts',
    `
import type { DomProps } from '../../pkg-dom/index';
type Base = { className?: string };
export type ButtonProps = Base & DomProps & {
  size?: 'sm' | 'md';
  label: string;
  count?: 1 | 2;
};
export declare function Button(props: ButtonProps): unknown;
export type SpotProps =
  | { appearance: 'icon'; icon: string }
  | { appearance: 'number'; number: number };
export declare function Spot(props: SpotProps): unknown;
export declare const sizeMap: { sm: { icon: 16 }; md: { icon: 20 } };
export declare function cn(...inputs: string[]): string;
export type OnlyAType = string;
export {};
`,
  );
  write('pkg/icons/apex.svg', '<svg/>');
  write('pkg/dist/tokens.css', ':root { --color-error: red; --text-: 0; }');
});

afterEach(() => {
  rmSync(tmp, { recursive: true, force: true });
});

describe('readSurface', () => {
  it('lists every exported name per entry point', () => {
    expect(readSurface(root).entries).toEqual({
      '.': [
        'Button',
        'ButtonProps',
        'OnlyAType',
        'Spot',
        'SpotProps',
        'cn',
        'sizeMap',
      ],
    });
  });

  it('reads component props, detailing only those the package declares', () => {
    expect(readSurface(root).props['.#Button']).toEqual({
      dir: { optional: true, values: null },
      className: { optional: true, values: null },
      size: { optional: true, values: ['md', 'sm'] },
      label: { optional: false, values: null },
      count: { optional: true, values: ['1', '2'] },
    });
  });

  it('merges discriminated props: optional unless every member has them', () => {
    expect(readSurface(root).props['.#Spot']).toEqual({
      appearance: { optional: false, values: ['icon', 'number'] },
      icon: { optional: true, values: null },
      number: { optional: true, values: null },
    });
  });

  it('lists the leaf paths of exported objects, not functions', () => {
    const { paths } = readSurface(root);

    expect(paths).toEqual({ '.#sizeMap': ['md.icon', 'sm.icon'] });
  });

  it('reads wildcard files, CSS tokens and peers', () => {
    const { files, tokens, peers } = readSurface(root);

    expect(files).toEqual(['./symbols/apex.svg']);
    expect(tokens).toEqual(['--color-error']);
    expect(peers).toEqual({ react: '^19.0.0' });
  });
});

import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { removeTrees, writePackage, writeTree } from './fixtures.js';
import { run } from './run.js';

const dir = writePackage();
afterAll(removeTrees);
const range = [
  '--package',
  '@ledgerhq/lumen-ui-react',
  '--from',
  '0.1.0',
  '--to',
  '0.1.3',
];

const oldApi = {
  'src/Menu.tsx':
    'export const Menu = () => (\n  <MenuItem\n    onSelect={close}\n  />\n);\n',
  'src/Card.tsx': 'export const C = () => <Card disabled />;\n',
  'package.json': '{ "dependencies": { "@radix-ui/react-menu": "1.0.0" } }\n',
  'node_modules/x/index.js': '<MenuItem onSelect={close} />',
};

/**
 * @param {string[]} argv
 * @param {string} [cwd]
 * @returns {{ code: number, output: string }}
 */
function exec(argv, cwd = process.cwd()) {
  let output = '';
  const code = run(argv, { cwd, dir, write: (text) => (output += text) });
  return { code, output };
}

describe('list', () => {
  it('prints the migrations in range', () => {
    const { code, output } = exec(['list', ...range]);
    expect(code).toBe(0);
    expect(output).toContain('menu-item-on-click (#10)');
    expect(output).toContain('card-disabled (#20)');
    expect(output).not.toContain('base-ui-required');
  });

  it('prints JSON', () => {
    const { output } = exec(['list', '--json', ...range]);
    const entries = /** @type {{ id: string }[]} */ (JSON.parse(output));
    expect(entries.map(({ id }) => id)).toEqual([
      'menu-item-on-click',
      'card-disabled',
    ]);
  });

  it('says when nothing is in range', () => {
    const args = ['list', '--package', '@ledgerhq/lumen-utils-shared'];
    expect(exec(args)).toEqual({ code: 0, output: 'No migrations in range.' });
  });
});

describe('show', () => {
  it('prints the migration file', () => {
    const { code, output } = exec(['show', 'card-disabled']);
    expect(code).toBe(0);
    expect(output).toContain('# card-disabled');
  });

  it('prints the entry and file as JSON', () => {
    const { output } = exec(['show', 'card-disabled', '--json']);
    expect(JSON.parse(output)).toMatchObject({
      id: 'card-disabled',
      pr: 20,
      content: expect.stringContaining('# card-disabled'),
    });
  });

  it('fails on an unknown id', () => {
    expect(exec(['show', 'nope'])).toEqual({
      code: 1,
      output: 'Unknown migration: nope',
    });
  });
});

describe('check', () => {
  it('fails while a removed API is still used', () => {
    const cwd = writeTree(oldApi);
    const { code, output } = exec(['check', ...range], cwd);
    expect(code).toBe(1);
    expect(output).toContain('pending menu-item-on-click');
    expect(output).toContain('src/Menu.tsx:2  <MenuItem');
    expect(output).toContain('review  card-disabled');
    expect(output).not.toContain('node_modules');
  });

  it('passes once fixed, listing review hits', () => {
    const cwd = writeTree({
      ...oldApi,
      'src/Menu.tsx': '<MenuItem onClick={close} />',
    });
    const { code, output } = exec(['check', ...range, '--cwd', cwd]);
    expect(code).toBe(0);
    expect(output).toContain('1 applied, 0 pending, 1 to review');
  });

  it('searches manifests for manifest patterns', () => {
    const cwd = writeTree(oldApi);
    const args = ['check', '--package', '@ledgerhq/lumen-ui-react', '--json'];
    const { code, output } = exec(args, cwd);
    const { ok, results } = JSON.parse(output);
    expect(code).toBe(1);
    expect(ok).toBe(false);
    expect(results[2]).toMatchObject({
      id: 'base-ui-required',
      status: 'pending',
      hits: [{ file: 'package.json', line: 1 }],
    });
  });

  it('reads a relative --cwd outside git', () => {
    const cwd = `${relative(process.cwd(), writeTree(oldApi))}/`;
    const { code, output } = exec(['check', ...range, '--cwd', cwd]);
    expect(code).toBe(1);
    expect(output).toContain('src/Menu.tsx:2  <MenuItem');
  });

  it('respects .gitignore in a git repo', () => {
    const cwd = writeTree({ ...oldApi, '.gitignore': 'src/Menu.tsx\n' });
    execFileSync('git', ['init', '-q'], { cwd });
    writeFileSync(join(cwd, 'src/New.tsx'), '<MenuItem onClick={close} />');
    const { output } = exec(['check', ...range], cwd);
    expect(output).toContain('applied menu-item-on-click');
  });
});

describe('usage', () => {
  it('prints help', () => {
    const { code, output } = exec(['--help']);
    expect(code).toBe(0);
    expect(output).toContain('Usage: lumen-migrations');
  });

  it.each([
    [[], 'missing command'],
    [['apply'], 'unknown command: apply'],
    [['show'], 'show needs a migration id'],
    [['list', '--from', '0.1.0'], '--from and --to need --package'],
    [
      ['list', '--package', '@ledgerhq/lumen-ui-react', '--to', 'latest'],
      'not a version: latest',
    ],
    [['list', '--nope'], "Unknown option '--nope'"],
    [
      ['check', '--package', '@ledgerhq/lumen-ui-reac'],
      'unknown package: @ledgerhq/lumen-ui-reac',
    ],
  ])('rejects %j', (argv, message) => {
    const { code, output } = exec(argv);
    expect(code).toBe(2);
    expect(output).toContain(message);
  });
});

import { parseArgs } from 'node:util';
import semver from 'semver';
import { checkMigrations } from './check.js';
import { formatCheck, formatList } from './format.js';
import { readIndex, readMigration, selectMigrations } from './migrations.js';

/** @import { IndexEntry, MigrationIndex } from '../index.d.cts' */
/** @import { Range } from './migrations.js' */

/**
 * @typedef {object} Io
 * @property {string} cwd
 * @property {(text: string) => void} write
 * @property {URL} [dir] The package root, for tests.
 */

/**
 * @typedef {object} Options
 * @property {string} [package]
 * @property {string} [from]
 * @property {string} [to]
 * @property {string} [cwd]
 * @property {boolean} [json]
 * @property {boolean} [help]
 */

const usage = `Usage: lumen-migrations <command> [options]

Commands:
  list            Migrations in range, oldest first
  show <id>       A migration's file: frontmatter and instructions
  check           Fails while a migration in range still has old-API hits

Options:
  --package <name>  Lumen package to pick migrations for
  --from <version>  Installed version (excluded)
  --to <version>    Target version (included)
  --cwd <dir>       Repo to check (default: current directory)
  --json            Machine-readable output`;

class UsageError extends Error {}

/**
 * @param {string[]} argv
 * @returns {{ command: string | undefined, args: string[], options: Options }}
 */
function parse(argv) {
  const { positionals, values } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      package: { type: 'string' },
      from: { type: 'string' },
      to: { type: 'string' },
      cwd: { type: 'string' },
      json: { type: 'boolean' },
      help: { type: 'boolean', short: 'h' },
    },
  });
  const [command, ...args] = positionals;
  return { command, args, options: values };
}

/**
 * A typo would select nothing and let `check` pass.
 * @param {string | undefined} name
 * @param {MigrationIndex} index
 * @returns {void}
 */
function assertKnownPackage(name, index) {
  if (name === undefined || index.packages.includes(name)) return;
  throw new UsageError(
    `unknown package: ${name}\nKnown: ${index.packages.join(', ')}`,
  );
}

/**
 * @param {Options} options
 * @param {MigrationIndex} index
 * @returns {Range}
 */
function rangeOf({ package: name, from, to }, index) {
  if ((from !== undefined || to !== undefined) && name === undefined) {
    throw new UsageError('--from and --to need --package');
  }
  assertKnownPackage(name, index);
  for (const version of [from, to]) {
    if (version !== undefined && semver.valid(version) === null) {
      throw new UsageError(`not a version: ${version}`);
    }
  }
  return { package: name, from, to };
}

/**
 * @param {Options} options
 * @param {Io} io
 * @returns {IndexEntry[]}
 */
function migrationsInRange(options, io) {
  const index = readIndex(io.dir);
  return selectMigrations(index, rangeOf(options, index));
}

/**
 * @param {unknown} value
 * @returns {string}
 */
function toJson(value) {
  return JSON.stringify(value, null, 2);
}

/**
 * @param {Options} options
 * @param {Io} io
 * @returns {number}
 */
function list(options, io) {
  const entries = migrationsInRange(options, io);
  io.write(options.json ? toJson(entries) : formatList(entries));
  return 0;
}

/**
 * @param {string | undefined} id
 * @param {Options} options
 * @param {Io} io
 * @returns {number}
 */
function show(id, options, io) {
  if (id === undefined) throw new UsageError('show needs a migration id');
  const entry = readIndex(io.dir).migrations.find((item) => item.id === id);
  if (entry === undefined) {
    io.write(`Unknown migration: ${id}`);
    return 1;
  }
  const content = readMigration(id, io.dir);
  io.write(options.json ? toJson({ ...entry, content }) : content);
  return 0;
}

/**
 * @param {Options} options
 * @param {Io} io
 * @returns {number}
 */
function check(options, io) {
  const entries = migrationsInRange(options, io);
  const results = checkMigrations(entries, options.cwd ?? io.cwd);
  const ok = results.every((result) => result.status !== 'pending');
  io.write(options.json ? toJson({ ok, results }) : formatCheck(results));
  return ok ? 0 : 1;
}

/**
 * @param {string | undefined} command
 * @param {string[]} args
 * @param {Options} options
 * @param {Io} io
 * @returns {number}
 */
function dispatch(command, args, options, io) {
  if (command === 'list') return list(options, io);
  if (command === 'show') return show(args[0], options, io);
  if (command === 'check') return check(options, io);
  throw new UsageError(
    command === undefined ? 'missing command' : `unknown command: ${command}`,
  );
}

/**
 * Exit codes: 0 success, 1 failed check or unknown id, 2 bad usage.
 * @param {string[]} argv
 * @param {Io} io
 * @returns {number}
 */
export function run(argv, io) {
  try {
    const { command, args, options } = parse(argv);
    if (options.help) {
      io.write(usage);
      return 0;
    }
    return dispatch(command, args, options, io);
  } catch (error) {
    if (!(error instanceof UsageError || isParseError(error))) throw error;
    io.write(`${error.message}\n\n${usage}`);
    return 2;
  }
}

/**
 * @param {unknown} error
 * @returns {error is Error}
 */
function isParseError(error) {
  return (
    error instanceof Error &&
    'code' in error &&
    String(error.code).startsWith('ERR_PARSE_ARGS')
  );
}

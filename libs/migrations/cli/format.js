/** @import { IndexEntry } from '../index.d.cts' */
/** @import { MigrationResult } from './check.js' */

/**
 * @param {IndexEntry} entry
 * @returns {string}
 */
function introducedText(entry) {
  return Object.entries(entry.introduced)
    .map(([name, version]) => `${name}@${version ?? 'unreleased'}`)
    .join(', ');
}

/**
 * @param {IndexEntry} entry
 * @returns {string}
 */
function entryLine(entry) {
  const pr = entry.pr === null ? '' : ` (#${entry.pr})`;
  return `${entry.id}${pr}\n  ${entry.title ?? ''}\n  ${introducedText(entry)}`;
}

/**
 * @param {IndexEntry[]} entries
 * @returns {string}
 */
export function formatList(entries) {
  if (entries.length === 0) return 'No migrations in range.';
  return entries.map(entryLine).join('\n\n');
}

/**
 * @param {MigrationResult} result
 * @returns {string}
 */
function resultBlock(result) {
  const hits = result.hits.map(
    (hit) => `  ${hit.file}:${hit.line}  ${hit.text}`,
  );
  return [`${result.status.padEnd(8)}${result.id}`, ...hits].join('\n');
}

/**
 * @param {MigrationResult[]} results
 * @param {MigrationResult['status']} status
 * @returns {number}
 */
function countOf(results, status) {
  return results.filter((result) => result.status === status).length;
}

/**
 * @param {MigrationResult[]} results
 * @returns {string}
 */
export function formatCheck(results) {
  if (results.length === 0) return 'No migrations in range.';
  const summary = `${countOf(results, 'applied')} applied, ${countOf(results, 'pending')} pending, ${countOf(results, 'review')} to review`;
  return [...results.map(resultBlock), '', summary].join('\n');
}

#!/usr/bin/env node
/**
 * Print the npm names of the libs that actually publish, one per line, so
 * workflows stop globbing `libs/*\/` and re-reading every manifest inline.
 *
 * Run: node internals/repo-tools/src/ci/getPublishableProjects.mjs
 */
import { publishableLibs } from '../lib/workspaceProjects.mjs';

if (import.meta.url === `file://${process.argv[1]}`) {
  for (const lib of publishableLibs()) console.log(lib.name);
}

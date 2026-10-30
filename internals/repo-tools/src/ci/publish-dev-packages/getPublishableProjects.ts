#!/usr/bin/env node
/**
 * Print the npm names of the libs that actually publish, one per line, so
 * workflows stop globbing `libs/*\/` and re-reading every manifest inline.
 *
 * Run: node internals/repo-tools/src/ci/publish-dev-packages/getPublishableProjects.ts
 */
import { publishableLibs } from '../../shared/workspaceProjects.ts';

if (import.meta.url === `file://${process.argv[1]}`) {
  for (const lib of publishableLibs()) console.log(lib.name);
}

/** `npm pack` a lib the way npm publish would, for scripts that need its tarball. */
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { workspaceRoot } from './workspaceProjects.ts';

export function pack(dir: string, destination: string): string {
  // An absolute path, not `libs/foo`: npm reads a bare `owner/name` as a GitHub
  // shorthand and tries to clone it. The bash this replaced got away with
  // `libs/foo/` only because of the trailing slash.
  const stdout = execFileSync(
    'npm',
    [
      'pack',
      join(workspaceRoot, dir),
      '--pack-destination',
      destination,
      '--json',
    ],
    { cwd: workspaceRoot, encoding: 'utf8' },
  );
  return JSON.parse(stdout)[0].filename;
}

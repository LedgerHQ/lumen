export type AdoptionStatus =
  | 'current'
  | 'behind'
  | 'far-behind'
  | 'diverged'
  | 'unresolved';

export type ClassifyResult = {
  status: AdoptionStatus;
  patchesBehind?: number;
};

type Semver = { major: number; minor: number; patch: number };

function parseSemver(version: string): Semver | undefined {
  const match = version.trim().match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!match) return undefined;
  const [, major, minor, patch] = match;
  return { major: Number(major), minor: Number(minor), patch: Number(patch) };
}

/**
 * Every Lumen release bumps only `patch` (AGENTS.md), so under normal
 * operation major.minor never move — patch subtraction is a valid "how many
 * releases behind" count. A major/minor mismatch is `diverged` rather than a
 * (meaningless) patch diff, since it means something other than the release
 * cadence moved the version — e.g. a manual pin, or a pre-1.0 minor bump.
 */
export function classifyVersion(
  currentVersion: string,
  latestVersion: string,
  farBehindThreshold: number,
): ClassifyResult {
  const current = parseSemver(currentVersion);
  const latest = parseSemver(latestVersion);
  if (!current || !latest) return { status: 'unresolved' };

  if (current.major !== latest.major || current.minor !== latest.minor) {
    return { status: 'diverged' };
  }

  const patchesBehind = latest.patch - current.patch;
  if (patchesBehind <= 0) return { status: 'current', patchesBehind: 0 };
  if (patchesBehind >= farBehindThreshold) {
    return { status: 'far-behind', patchesBehind };
  }
  return { status: 'behind', patchesBehind };
}

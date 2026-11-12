import semver from 'semver';
import type { ApiSurface, PropInfo } from './apiSurface.ts';

export type ApiChange = {
  change: 'removed' | 'required' | 'changed';
  surface: 'module' | 'export' | 'member' | 'value' | 'token' | 'dependency';
  ref: string;
  detail?: string;
};

type Kind = ApiChange['change'];
type Surface = ApiChange['surface'];

/** Lumen packages pin each other exactly, so those peers move every release. */
const lumenPeer = /^@ledgerhq\/lumen-/;

/** One change, as a migration ref. */
function toChange(
  change: Kind,
  surface: Surface,
  ref: string,
  detail?: string,
): ApiChange {
  return { change, surface, ref, detail };
}

/** Items of `before` that `after` lacks. */
function missing<T>(before: T[], after: T[]): T[] {
  const remaining = new Set(after);
  return before.filter((item) => !remaining.has(item));
}

/** `@scope/pkg` + `./symbols` → `@scope/pkg/symbols`. */
function moduleRef(name: string, entry: string): string {
  return `${name}${entry.slice(1)}`;
}

/** `./symbols#Apex` → `@scope/pkg/symbols#Apex`. */
function exportRef(name: string, key: string): string {
  const index = key.indexOf('#');
  return `${moduleRef(name, key.slice(0, index))}${key.slice(index)}`;
}

/** Keys present on both sides: a removed export is reported once, as such. */
function sharedKeys(before: object, after: object): string[] {
  return Object.keys(before).filter((key) => key in after);
}

/** Removed entry points, and exports removed from the remaining ones. */
function removedExports(
  name: string,
  before: ApiSurface,
  after: ApiSurface,
): ApiChange[] {
  return Object.entries(before.entries).flatMap(([entry, names]) => {
    const module = moduleRef(name, entry);
    const remaining = after.entries[entry];
    if (remaining === undefined) return [toChange('removed', 'module', module)];
    return missing(names, remaining).map((exported) =>
      toChange('removed', 'export', `${module}#${exported}`),
    );
  });
}

/** Files no longer served by a wildcard export. */
function removedFiles(
  name: string,
  before: ApiSurface,
  after: ApiSurface,
): ApiChange[] {
  return missing(before.files, after.files).map((file) =>
    toChange('removed', 'module', moduleRef(name, file)),
  );
}

/** How one prop that still exists changed. */
function propChanges(ref: string, was: PropInfo, now: PropInfo): ApiChange[] {
  const changes: ApiChange[] = [];
  if (was.optional && !now.optional) {
    changes.push(toChange('required', 'member', ref));
  }
  if (was.values === null && now.values !== null) {
    const narrowed = `narrowed to ${now.values.join(' | ')}`;
    changes.push(toChange('changed', 'member', ref, narrowed));
  }
  if (was.values !== null && now.values !== null) {
    changes.push(
      ...missing(was.values, now.values).map((value) =>
        toChange('removed', 'value', `${ref}=${value}`),
      ),
    );
  }
  return changes;
}

/** Removed, tightened and newly required props of one component. */
function componentChanges(
  base: string,
  was: Record<string, PropInfo>,
  now: Record<string, PropInfo>,
): ApiChange[] {
  const removedOrChanged = Object.entries(was).flatMap(([prop, info]) =>
    now[prop] === undefined
      ? [toChange('removed', 'member', `${base}.${prop}`)]
      : propChanges(`${base}.${prop}`, info, now[prop]),
  );
  const newlyRequired = Object.entries(now)
    .filter(([prop, info]) => !(prop in was) && !info.optional)
    .map(([prop]) => toChange('required', 'member', `${base}.${prop}`));
  return [...removedOrChanged, ...newlyRequired];
}

/** Prop changes of every component that still exists. */
function propsChanges(
  name: string,
  before: ApiSurface,
  after: ApiSurface,
): ApiChange[] {
  return sharedKeys(before.props, after.props).flatMap((key) =>
    componentChanges(exportRef(name, key), before.props[key], after.props[key]),
  );
}

/** Leaf paths removed from exported objects that still exist. */
function removedPaths(
  name: string,
  before: ApiSurface,
  after: ApiSurface,
): ApiChange[] {
  return sharedKeys(before.paths, after.paths).flatMap((key) =>
    missing(before.paths[key], after.paths[key]).map((path) =>
      toChange('removed', 'token', `${exportRef(name, key)}.${path}`),
    ),
  );
}

/** Literal values removed from exported type aliases that still exist. */
function removedTypeValues(
  name: string,
  before: ApiSurface,
  after: ApiSurface,
): ApiChange[] {
  return sharedKeys(before.types, after.types).flatMap((key) =>
    missing(before.types[key], after.types[key]).map((value) =>
      toChange('removed', 'value', `${exportRef(name, key)}=${value}`),
    ),
  );
}

/** CSS custom properties no longer declared. */
function removedTokens(
  name: string,
  before: ApiSurface,
  after: ApiSurface,
): ApiChange[] {
  return missing(before.tokens, after.tokens).map((token) =>
    toChange('removed', 'token', `${name}#${token}`),
  );
}

/** Whether `range` drops any version `previous` allowed. */
function narrows(previous: string, range: string): boolean {
  return Boolean(
    semver.validRange(previous) &&
    semver.validRange(range) &&
    !semver.subset(previous, range),
  );
}

/** Whether consumers must install `peer`: listed and not optional. */
function isRequiredPeer(surface: ApiSurface, peer: string): boolean {
  return peer in surface.peers && !surface.optionalPeers.includes(peer);
}

/**
 * How one peer of `after` changed: newly required, or its range dropped
 * versions. Lumen's own pins move every release, so only their requiredness counts.
 */
function peerChange(
  before: ApiSurface,
  after: ApiSurface,
  peer: string,
  range: string,
): ApiChange[] {
  const previous = before.peers[peer];
  if (isRequiredPeer(after, peer) && !isRequiredPeer(before, peer)) {
    return [toChange('required', 'dependency', peer, range)];
  }
  return previous !== undefined &&
    !lumenPeer.test(peer) &&
    narrows(previous, range)
    ? [toChange('changed', 'dependency', peer, `${previous} → ${range}`)]
    : [];
}

/** Changes of every peer of `after`. */
function peerChanges(before: ApiSurface, after: ApiSurface): ApiChange[] {
  return Object.entries(after.peers).flatMap(([peer, range]) =>
    peerChange(before, after, peer, range),
  );
}

/**
 * What a consumer of `before` loses by moving to `after`, as migration refs
 * (`module#Export.member=value`). Additions never break, so they're left out.
 */
export function diffSurfaces(
  name: string,
  before: ApiSurface,
  after: ApiSurface,
): ApiChange[] {
  return [
    ...removedExports(name, before, after),
    ...removedFiles(name, before, after),
    ...propsChanges(name, before, after),
    ...removedPaths(name, before, after),
    ...removedTypeValues(name, before, after),
    ...removedTokens(name, before, after),
    ...peerChanges(before, after),
  ];
}

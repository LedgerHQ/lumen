import type { LumenPackage } from '../../config.js';
import type { AdoptionStatus } from './classify.js';

export type Cell =
  | { status: 'not-used' }
  // `reason` says why the version couldn't be verified (missing file, raw
  // spec we don't understand, failed fetch) so a maintainer can act on it.
  | { status: 'unresolved'; reason: string }
  | {
      status: Exclude<AdoptionStatus, 'unresolved'>;
      version: string;
      patchesBehind?: number;
    };

export type ReportRow = {
  repo: string;
  cells: Record<LumenPackage, Cell>;
};

export type LatestVersions = Record<LumenPackage, string>;

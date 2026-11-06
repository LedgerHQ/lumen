/**
 * Types of `index.json`, published with it. `scripts/schema.test.ts` checks
 * they match what the schema parses, so the two can't drift.
 */

export type Detect = {
  pattern: string;
  in: 'source' | 'manifests';
  expect: 'none' | 'review';
};

export type Change = {
  change: 'renamed' | 'removed' | 'required' | 'changed';
  surface: 'module' | 'export' | 'member' | 'value' | 'token' | 'dependency';
  ref: string;
  to?: string;
  signal: 'loud' | 'silent' | 'visual';
  detect?: Detect[];
};

export type IndexEntry = {
  id: string;
  title: string | null;
  pr: number | null;
  commit: string | null;
  /** Package → first version that ships the change, `null` until released. */
  introduced: Record<string, string | null>;
  changes: Change[];
  requires?: Record<string, string>;
  codemod?: string;
};

export type MigrationIndex = {
  formatVersion: number;
  migrations: IndexEntry[];
};

declare const index: MigrationIndex;
// A JSON module's value is its default export.
// eslint-disable-next-line import/no-default-export
export default index;

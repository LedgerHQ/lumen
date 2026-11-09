import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import type { ApiChange } from '../apiDiff.ts';

const frontmatter = /^---\n([\s\S]*?)\n---/;

/** The `changes[].ref` of one migration file. */
function fileRefs(content: string): string[] {
  const yaml = content.match(frontmatter)?.[1];
  const data = yaml === undefined ? undefined : parse(yaml);
  const changes: unknown = data?.changes;
  if (!Array.isArray(changes)) return [];
  return changes
    .map((change) => change?.ref)
    .filter((ref): ref is string => typeof ref === 'string');
}

/** Every ref the migration files in `dir` declare. */
export function migrationRefs(dir: string): string[] {
  return readdirSync(dir)
    .filter((name) => name.endsWith('.md'))
    .flatMap((name) => fileRefs(readFileSync(join(dir, name), 'utf8')));
}

/** A ref as a full-match pattern, where `*` stands for any text. */
function refPattern(ref: string): RegExp {
  const escaped = ref.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^${escaped.replaceAll('*', '.*')}$`);
}

/** The changes no migration ref matches. */
export function uncovered(changes: ApiChange[], refs: string[]): ApiChange[] {
  const patterns = refs.map(refPattern);
  return changes.filter(
    (change) => !patterns.some((pattern) => pattern.test(change.ref)),
  );
}

import { parse } from 'yaml';
import type { MigrationFrontmatter } from './schema.ts';

export const migrationsPackage = '@ledgerhq/lumen-migrations';

const lumenPackage = /^@ledgerhq\/lumen-[^/#]+/;

/**
 * The Lumen packages a migration's refs point into: their release is when the
 * update reaches consumers. A `dependency` ref names what consumers must
 * install, not what changed, so it doesn't count.
 */
export function refPackages(frontmatter: MigrationFrontmatter): string[] {
  const names = frontmatter.changes
    .filter(({ surface }) => surface !== 'dependency')
    .map(({ ref }) => ref.match(lumenPackage)?.[0])
    .filter((name) => name !== undefined);
  return [...new Set(names)];
}

const frontmatterBlock = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/;

type Frontmatter =
  | { data: unknown; body: string }
  | { error: string }
  | undefined;

/**
 * Splits a Markdown file into its parsed YAML frontmatter and its body.
 * Broken YAML comes back as an error, so one bad file is reported like any
 * other invalid file instead of stopping the run.
 */
export function splitFrontmatter(content: string): Frontmatter {
  const [, yaml, body] = content.match(frontmatterBlock) ?? [];
  if (yaml === undefined || body === undefined) return undefined;
  try {
    return { data: parse(yaml), body };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { error: message.split('\n')[0] };
  }
}

/** The parsed frontmatter, or `undefined` when it's missing or not YAML. */
export function frontmatterData(content: string): unknown {
  const frontmatter = splitFrontmatter(content);
  return frontmatter !== undefined && 'data' in frontmatter
    ? frontmatter.data
    : undefined;
}

/** Package names listed in a version plan's frontmatter. */
export function planPackages(content: string): string[] {
  const data = frontmatterData(content);
  return data !== null && typeof data === 'object' ? Object.keys(data) : [];
}

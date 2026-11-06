import { parse } from 'yaml';

export const migrationsPackage = '@ledgerhq/lumen-migrations';

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

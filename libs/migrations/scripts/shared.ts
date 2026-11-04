import { parse } from 'yaml';

export const migrationsPackage = '@ledgerhq/lumen-migrations';

const frontmatterBlock = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/;

/** Splits a Markdown file into its parsed YAML frontmatter and its body. */
export function splitFrontmatter(
  content: string,
): { data: unknown; body: string } | undefined {
  const [, yaml, body] = content.match(frontmatterBlock) ?? [];
  if (yaml === undefined || body === undefined) return undefined;
  return { data: parse(yaml), body };
}

/** Package names listed in a version plan's frontmatter. */
export function planPackages(content: string): string[] {
  const data = splitFrontmatter(content)?.data;
  return data !== null && typeof data === 'object' ? Object.keys(data) : [];
}

import * as fs from 'node:fs';
import * as path from 'node:path';

export type WriteResult = { written: string[]; deleted: string[] };

/**
 * Writes every file of an export and deletes the files with the same extension
 * that the export no longer produces, so the folder mirrors Figma. Shared by
 * every asset kind (tokens, icons).
 */
export const writeSourceFiles = (
  outputDir: string,
  files: Record<string, string>,
  { extension }: { extension: string },
): WriteResult => {
  const names = Object.keys(files);
  // An empty export means the API call went wrong, not that the library is
  // empty: pruning would wipe every source file.
  if (names.length === 0) {
    throw new Error(
      `The Figma export produced no ${extension} files; not writing.`,
    );
  }

  // Names come from Figma: one must not leave the folder, and two that differ
  // only by case would be one file on macOS.
  const byLowerCase = new Map<string, string>();
  for (const name of names) {
    if (name !== path.basename(name) || name.startsWith('.')) {
      throw new Error(`The Figma export produced an unsafe file name: ${name}`);
    }
    const clash = byLowerCase.get(name.toLowerCase());
    if (clash) {
      throw new Error(
        `The Figma export produced ${clash} and ${name}, which differ only by case.`,
      );
    }
    byLowerCase.set(name.toLowerCase(), name);
  }

  // Pruning before writing keeps a case-only rename (`airplane.svg` →
  // `Airplane.svg`) right on a case-insensitive disk: writing first would
  // overwrite the old file in place, then prune it.
  const exported = new Set(names);
  fs.mkdirSync(outputDir, { recursive: true });
  const deleted = fs
    .readdirSync(outputDir, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name.endsWith(extension) &&
        !exported.has(entry.name),
    )
    .map((entry) => entry.name);
  for (const name of deleted) fs.unlinkSync(path.join(outputDir, name));

  for (const [name, contents] of Object.entries(files)) {
    fs.writeFileSync(path.join(outputDir, name), contents);
  }

  return { written: names.sort(), deleted: deleted.sort() };
};

/** The JSON formatting every committed source file uses. */
export const toJsonFile = (value: unknown): string =>
  `${JSON.stringify(value, null, 2)}\n`;

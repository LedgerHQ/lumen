import * as fs from 'fs';
import * as path from 'path';

/**
 * Deletes the token files a previous export wrote for collections or modes
 * that no longer exist in Figma, so `tokens/` mirrors the library. Returns the
 * deleted file names.
 */
export function pruneStaleTokenFiles(
  outputDir: string,
  exportedFileNames: string[],
): string[] {
  // An empty export means the API call went wrong, not that the library is
  // empty: pruning would wipe every token file.
  if (exportedFileNames.length === 0) {
    throw new Error('The Figma export produced no token files; not pruning.');
  }

  const exported = new Set(exportedFileNames);
  const staleFileNames = fs
    .readdirSync(outputDir, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name.endsWith('.json') &&
        !exported.has(entry.name),
    )
    .map((entry) => entry.name);

  staleFileNames.forEach((fileName) =>
    fs.unlinkSync(path.join(outputDir, fileName)),
  );

  return staleFileNames;
}

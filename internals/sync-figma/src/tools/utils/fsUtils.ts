import { promises as fs } from 'fs';
import path from 'path';

/**
 * Recursively finds all files with a specific extension in a directory.
 * @param dir The directory to search.
 * @param ext The file extension to find (e.g. '.svg').
 * @returns A promise that resolves to an array of file paths.
 */
export async function findFilesByExtension(
  dir: string,
  ext: string,
): Promise<string[]> {
  try {
    const directoryEntries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      directoryEntries.map((directoryEntry) => {
        const resolvedPath = path.resolve(dir, directoryEntry.name);
        if (directoryEntry.isDirectory()) {
          return findFilesByExtension(resolvedPath, ext);
        }
        return resolvedPath.endsWith(ext) ? [resolvedPath] : [];
      }),
    );
    return files.flat();
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

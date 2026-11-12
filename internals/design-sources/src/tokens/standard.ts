import { readFileSync } from 'node:fs';
import path from 'node:path';
import {
  defineConfig,
  formatMessage,
  type LogEntry,
  Logger,
  parse,
} from '@terrazzo/parser';
import { loadTokenSources, type SourceFile, TOKENS_DIR } from './load.js';

/** Keeps Terrazzo's warnings instead of printing them: any warning fails the check. */
class CollectingLogger extends Logger {
  readonly messages: string[] = [];

  override warn(...entries: LogEntry[]): void {
    this.messages.push(...entries.map((entry) => formatMessage(entry, 'warn')));
  }
}

/**
 * Parses the sources with Terrazzo, the DTCG reference implementation, and
 * returns every problem it reports, warnings included (it only warns on
 * deprecated forms such as hex-string colors). Proves the files are standard
 * DTCG, not just what our own model accepts.
 */
export const checkDtcgStandard = async (
  sources: SourceFile[] = loadTokenSources(),
  dir: string = TOKENS_DIR,
): Promise<string[]> => {
  const config = defineConfig({}, { cwd: new URL(`file://${dir}/`) });
  const problems = new Set<string>();

  // One file at a time, aliases unresolved: Terrazzo checks the format, and
  // validate.ts already checks every reference across files and modes.
  for (const { file } of sources) {
    const logger = new CollectingLogger({ level: 'warn' });
    try {
      await parse(
        [
          {
            filename: new URL(`file://${path.join(dir, file)}`),
            src: readFileSync(path.join(dir, file), 'utf8'),
          },
        ],
        { config, logger, skipLint: true, resolveAliases: false },
      );
    } catch (error) {
      problems.add((error as Error).message);
    }
    logger.messages.forEach((message) => problems.add(message));
  }
  return [...problems];
};

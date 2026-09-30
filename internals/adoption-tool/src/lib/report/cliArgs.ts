/** `--key value` pairs, space-separated (matches the convention used by
 * internals/sync-figma's targets) — not `--key=value`. */
export function parseCliArgs(args: string[]): Record<string, string> {
  const params: Record<string, string> = {};
  for (let index = 0; index < args.length; index += 1) {
    if (!args[index].startsWith('--')) continue;
    const key = args[index].slice(2);
    const value = args[index + 1];
    if (value && !value.startsWith('--')) {
      params[key] = value;
      index += 1;
    }
  }
  return params;
}

export type ReportFormat = 'markdown' | 'summary' | 'json';

const VALID_REPORT_FORMATS: ReportFormat[] = ['markdown', 'summary', 'json'];

/** `--format markdown` (default): the full table, everything, for
 * GitHub/PRs/terminal. `--format summary`: the severity-grouped bulleted
 * list meant for Slack — see `renderSlackReport`. `--format json`: the
 * machine-readable snapshot — see `renderJsonReport`. */
export function parseReportFormat(args: string[]): ReportFormat {
  const { format = 'markdown' } = parseCliArgs(args);
  if (!VALID_REPORT_FORMATS.includes(format as ReportFormat)) {
    throw new Error(
      `Invalid --format "${format}" — expected one of: ${VALID_REPORT_FORMATS.join(', ')}`,
    );
  }
  return format as ReportFormat;
}
